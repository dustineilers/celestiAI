// pages/index.tsx
import React, { useState, useEffect } from "react";
import type { SatelliteElements } from "../components/Globe";
import Globe from "../components/Globe";
import SatelliteMenu from "../components/SatelliteMenu";

const Home: React.FC = () => {
  // Example satellites
  const [satellites, setSatellites] = useState<SatelliteElements[]>([
    {
      id: 1,
      name: "Sat-1",
      semiMajorAxisKm: 7000,
      eccentricity: 0.001,
      inclinationDeg: 53,
      raanDeg: 120,
      argPerigeeDeg: 0,
      trueAnomalyDeg: 0,
      color: "red",
    },
    {
      id: 2,
      name: "Sat-2",
      semiMajorAxisKm: 10000,
      eccentricity: 0.05,
      inclinationDeg: 30,
      raanDeg: 45,
      argPerigeeDeg: 90,
      trueAnomalyDeg: 180,
      color: "yellow",
    },
  ]);

  const [simTime, setSimTime] = useState(0);

  // advance simTime every frame
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      setSimTime((now - start) / 1000); // seconds
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Globe satellites={satellites} simTime={simTime} />
      <SatelliteMenu satellites={satellites} setSatellites={setSatellites}/>
    </div>
  );
};

export default Home;