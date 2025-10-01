// components/SatelliteMenu.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { SatelliteElements } from "./Globe";
import OrbitForm from "./OrbitForm";

type Props = {
  satellites: SatelliteElements[];
  setSatellites: React.Dispatch<React.SetStateAction<SatelliteElements[]>>;
};

const SatelliteMenu: React.FC<Props> = ({ satellites, setSatellites }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddSatellite = (data: {
    name: string;
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    raan: number;
    argOfPerigee: number;
    trueAnomaly: number;
  }) => {
    const newId = satellites.length ? satellites[satellites.length - 1].id + 1 : 1;

    const newSat: SatelliteElements = {
      id: newId,
      name: data.name || `🛰️ NewSat-${newId}`,
      semiMajorAxisKm: data.semiMajorAxis,
      eccentricity: data.eccentricity,
      inclinationDeg: data.inclination,
      raanDeg: data.raan,
      argPerigeeDeg: data.argOfPerigee,
      trueAnomalyDeg: data.trueAnomaly,
      color: ["red", "blue", "orange", "green", "purple"][
        Math.floor(Math.random() * 5)
      ],
    };

    setSatellites((prev) => [...prev, newSat]);
  };

  const handleDeleteSatellite = (id: number) => {
    setSatellites((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "80px",
        left: "20px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "280px",
      }}
    >
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.12)",
          color: "#fff",
          p: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            🛰️ Satellites
          </Typography>

          {satellites.map((sat) => (
            <Box
              key={sat.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                p: 1,
                borderRadius: "12px",
                background: "rgba(255,255,255,0.1)",
                "&:hover": { background: "rgba(255,255,255,0.2)" },
              }}
            >
              <Typography variant="body1">{sat.name}</Typography>
              <Box>
                <IconButton size="small" sx={{ color: "lightgray" }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "lightcoral" }}
                  onClick={() => handleDeleteSatellite(sat.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleOpen}
          >
            Add Satellite
          </Button>
        </CardContent>
      </Card>

      {/* Orbit Form (shared design) */}
      <OrbitForm
        open={open}
        onClose={handleClose}
        onSubmit={handleAddSatellite}
      />
    </Box>
  );
};

export default SatelliteMenu;
