// components/Globe.tsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import * as THREE from "three";
import type { CelestialBody } from "../constants/bodies";

export type SatelliteElements = {
  id: number;
  name: string;
  semiMajorAxisKm: number;
  eccentricity: number;
  inclinationDeg: number;
  raanDeg: number;
  argPerigeeDeg: number;
  trueAnomalyDeg: number;
  color?: string;
};

type Props = {
  satellites: SatelliteElements[];
  simTime: number;
  timeScale?: number;
  body: CelestialBody;
};

// --- Solve Kepler's Equation ---
function solveKepler(M: number, e: number, maxIter = 50, tol = 1e-8) {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < maxIter; i++) {
    const f = E - e * Math.sin(E) - M;
    const f1 = 1 - e * Math.cos(E);
    const dE = f / f1;
    E -= dE;
    if (Math.abs(dE) < tol) break;
  }
  return E;
}

// --- Orbital Position from Elements ---
function positionFromElementsAtTime(
  mu: number,
  radiusKm: number,
  a: number,
  e: number,
  iDeg: number,
  raanDeg: number,
  argPeriDeg: number,
  trueAnom0Deg: number,
  tSinceEpochSec: number
) {
  const n = Math.sqrt(mu / Math.pow(a, 3)); // mean motion
  const i = THREE.MathUtils.degToRad(iDeg);
  const raan = THREE.MathUtils.degToRad(raanDeg);
  const argPeri = THREE.MathUtils.degToRad(argPeriDeg);
  const nu0 = THREE.MathUtils.degToRad(trueAnom0Deg);

  // Convert ν0 → E0
  const E0 = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(nu0 / 2));
  const M0 = E0 - e * Math.sin(E0);

  // Propagate mean anomaly
  const M = M0 + n * tSinceEpochSec;

  // Solve Kepler
  const E = solveKepler(M, e);

  // True anomaly
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );

  const r = a * (1 - e * Math.cos(E));
  const x_pf = r * Math.cos(nu);
  const y_pf = r * Math.sin(nu);

  const posPf = new THREE.Vector3(x_pf, y_pf, 0);

  const rot = new THREE.Matrix4()
    .makeRotationZ(raan)
    .multiply(new THREE.Matrix4().makeRotationX(i))
    .multiply(new THREE.Matrix4().makeRotationZ(argPeri));

  const posEci = posPf.applyMatrix4(rot);

  // Scale to scene units
  const SCENE_RADIUS = 2; // sphere radius in scene
  const KM_TO_SCENE = SCENE_RADIUS / radiusKm;

  return new THREE.Vector3(
    posEci.x * KM_TO_SCENE,
    posEci.y * KM_TO_SCENE,
    posEci.z * KM_TO_SCENE
  );
}

// --- Build full orbit polyline ---
function buildOrbitPoints(
  mu: number,
  radiusKm: number,
  a: number,
  e: number,
  i: number,
  raan: number,
  argPeri: number,
  segments = 256
) {
  const pts: [number, number, number][] = [];
  for (let j = 0; j <= segments; j++) {
    const nu = (j / segments) * 360;
    const pos = positionFromElementsAtTime(
      mu,
      radiusKm,
      a,
      e,
      i,
      raan,
      argPeri,
      nu,
      0
    );
    pts.push([pos.x, pos.y, pos.z]);
  }
  return pts;
}

// --- Central Body Mesh ---
const BodyMesh: React.FC<{ body: CelestialBody }> = ({ body }) => {
  const texture = body.texture
    ? new THREE.TextureLoader().load(body.texture)
    : null;

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial
        map={texture ?? undefined}
        bumpScale={0.03}
        specular={new THREE.Color("grey")}
        shininess={10}
      />
    </mesh>
  );
};

// --- Moving Satellite ---
const MovingSatellite: React.FC<{
  sat: SatelliteElements;
  simTime: number;
  timeScale: number;
  body: CelestialBody;
}> = ({ sat, simTime, timeScale, body }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      const pos = positionFromElementsAtTime(
        body.mu,
        body.radiusKm,
        sat.semiMajorAxisKm,
        sat.eccentricity,
        sat.inclinationDeg,
        sat.raanDeg,
        sat.argPerigeeDeg,
        sat.trueAnomalyDeg,
        simTime * timeScale
      );
      ref.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial
        color={sat.color ?? "red"}
        emissive={sat.color ?? "red"}
      />
    </mesh>
  );
};

// --- Orbit Line ---
const OrbitLine: React.FC<{ sat: SatelliteElements; body: CelestialBody }> = ({
  sat,
  body,
}) => {
  const points = useMemo(
    () =>
      buildOrbitPoints(
        body.mu,
        body.radiusKm,
        sat.semiMajorAxisKm,
        sat.eccentricity,
        sat.inclinationDeg,
        sat.raanDeg,
        sat.argPerigeeDeg
      ),
    [sat, body]
  );
  return <Line points={points} color={sat.color ?? "cyan"} lineWidth={1} />;
};

// --- Globe Root Component ---
const Globe: React.FC<Props> = ({ satellites, simTime, timeScale = 1, body }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.0} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />

        {/* Central Body */}
        <BodyMesh body={body} />

        {/* Satellites + Orbits */}
        {satellites.map((s) => (
          <React.Fragment key={s.id}>
            <OrbitLine sat={s} body={body} />
            <MovingSatellite
              sat={s}
              simTime={simTime}
              timeScale={timeScale}
              body={body}
            />
          </React.Fragment>
        ))}

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
};

export default Globe;
