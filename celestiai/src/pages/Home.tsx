// pages/Home.tsx
import React, { useState, useEffect } from "react";
import Globe from "../components/Globe";
import type { SatelliteElements } from "../components/Globe";
import SatelliteMenu from "../components/SatelliteMenu";

const Home: React.FC = () => {
  const [simTime, setSimTime] = useState(0);
  const [timeScale, setTimeScale] = useState(1);

  // Example satellites
  const [satellites, setSatellites] = useState<SatelliteElements[]>([
    {
      id: 1,
      name: "Hubble",
      semiMajorAxisKm: 6871,
      eccentricity: 0.001,
      inclinationDeg: 28.5,
      raanDeg: 0,
      argPerigeeDeg: 0,
      trueAnomalyDeg: 0,
      color: "red",
    },
    {
      id: 2,
      name: "Starlink",
      semiMajorAxisKm: 6921,
      eccentricity: 0.0001,
      inclinationDeg: 53,
      raanDeg: 10,
      argPerigeeDeg: 0,
      trueAnomalyDeg: 180,
      color: "blue",
    },
  ]);

  // Tick simulation time forward
  useEffect(() => {
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = (now - last) / 1000; // seconds
      last = now;
      setSimTime((t) => t + dt);
      requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <>
      <Globe satellites={satellites} simTime={simTime} timeScale={timeScale} />
      <SatelliteMenu satellites={satellites} setSatellites={setSatellites} />

      {/* Clean time slider overlay */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.5)",
          borderRadius: "10px",
          padding: "10px 20px",
          color: "white",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ marginBottom: "5px" }}>⏱ {timeScale}x</div>
        <input
          type="range"
          min={1}
          max={1000}
          step={1}
          value={timeScale}
          onChange={(e) => setTimeScale(Number(e.target.value))}
          style={{ width: "300px" }}
        />
      </div>
    </>
  );
};

export default Home;