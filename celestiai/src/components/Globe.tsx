// components/Globe.tsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import * as THREE from "three";

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
  simTime: number;   // simulation clock (seconds)
  timeScale?: number; // speed multiplier (default = 1)
};

const MU_EARTH = 398600.4418; // km^3 / s^2
const EARTH_RADIUS_KM = 6371;
const SCENE_EARTH_RADIUS = 2;
const KM_TO_SCENE = SCENE_EARTH_RADIUS / EARTH_RADIUS_KM;

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

function positionFromElementsAtTime(
  a: number,
  e: number,
  iDeg: number,
  raanDeg: number,
  argPeriDeg: number,
  trueAnom0Deg: number,
  tSinceEpochSec: number
) {
  const n = Math.sqrt(MU_EARTH / Math.pow(a, 3));
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

  return new THREE.Vector3(
    posEci.x * KM_TO_SCENE,
    posEci.y * KM_TO_SCENE,
    posEci.z * KM_TO_SCENE
  );
}

function buildOrbitPoints(
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
    const pos = positionFromElementsAtTime(a, e, i, raan, argPeri, nu, 0);
    pts.push([pos.x, pos.y, pos.z]);
  }
  return pts;
}

const EarthMesh: React.FC = () => {
  const colorTex = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"
  );
  const bumpTex = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/earthbump1k.jpg"
  );
  const specTex = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/earthspec1k.jpg"
  );

  return (
    <mesh>
      <sphereGeometry args={[SCENE_EARTH_RADIUS, 64, 64]} />
      <meshPhongMaterial
        map={colorTex}
        bumpMap={bumpTex}
        bumpScale={0.03}
        specularMap={specTex}
        specular={new THREE.Color("grey")}
        shininess={10}
      />
    </mesh>
  );
};

const MovingSatellite: React.FC<{ sat: SatelliteElements; simTime: number; timeScale: number }> = ({
  sat,
  simTime,
  timeScale,
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      const pos = positionFromElementsAtTime(
        sat.semiMajorAxisKm,
        sat.eccentricity,
        sat.inclinationDeg,
        sat.raanDeg,
        sat.argPerigeeDeg,
        sat.trueAnomalyDeg,
        simTime * timeScale // scaled time
      );
      ref.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial color={sat.color ?? "red"} emissive={sat.color ?? "red"} />
    </mesh>
  );
};

const OrbitLine: React.FC<{ sat: SatelliteElements }> = ({ sat }) => {
  const points = useMemo(
    () =>
      buildOrbitPoints(
        sat.semiMajorAxisKm,
        sat.eccentricity,
        sat.inclinationDeg,
        sat.raanDeg,
        sat.argPerigeeDeg
      ),
    [sat]
  );
  return <Line points={points} color={sat.color ?? "cyan"} lineWidth={1} />;
};

const Globe: React.FC<Props> = ({ satellites, simTime, timeScale = 1 }) => {
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

        <EarthMesh />

        {satellites.map((s) => (
          <React.Fragment key={s.id}>
            <OrbitLine sat={s} />
            <MovingSatellite sat={s} simTime={simTime} timeScale={timeScale} />
          </React.Fragment>
        ))}

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
};

export default Globe;
