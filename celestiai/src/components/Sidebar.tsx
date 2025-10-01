import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { SatelliteElements } from "./Globe";
import OrbitForm from "./OrbitForm";
import type { CelestialBody } from "../constants/bodies";
import { BODIES } from "../constants/bodies";

type Props = {
  satellites: SatelliteElements[];
  setSatellites: React.Dispatch<React.SetStateAction<SatelliteElements[]>>;
  body: CelestialBody;
  setBody: React.Dispatch<React.SetStateAction<CelestialBody>>;
};

const Sidebar: React.FC<Props> = ({ satellites, setSatellites, body, setBody }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [orbitOpen, setOrbitOpen] = useState(false);

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

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
        bottom: "20px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "280px",
      }}
    >
      {/* Satellites */}
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.12)",
          color: "#fff",
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => toggleMenu("satellites")}
        >
          🛰️ Satellites
        </Typography>

        <Collapse
          in={openMenu === "satellites"}
          timeout="auto"
          unmountOnExit
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            mt: 1,
            maxHeight: "50vh",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
              mb: 1,
            }}
          >
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
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => setOrbitOpen(true)}
            >
              Add Satellite
            </Button>
          </Box>
        </Collapse>
      </Card>

      {/* Body */}
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.12)",
          color: "#fff",
          p: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => toggleMenu("body")}
        >
          🌏 Body
        </Typography>

        <Collapse in={openMenu === "body"} timeout="auto" unmountOnExit sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="body-select-label" sx={{ color: "#fff" }}>
              Select Body
            </InputLabel>
            <Select
              labelId="body-select-label"
              value={body.id}
              onChange={(e) => {
                const selected = BODIES.find((b) => b.id === e.target.value)!;
                setBody(selected);
              }}
              sx={{
                color: "#fff",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.6)",
                },
                "& .MuiSvgIcon-root": {
                  color: "#fff",
                },
              }}
            >
              {BODIES.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Collapse>
      </Card>

      {/* Settings */}
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.12)",
          color: "#fff",
          p: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => toggleMenu("settings")}
        >
          ⚙️ Settings
        </Typography>

        <Collapse in={openMenu === "settings"} timeout="auto" unmountOnExit sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Settings go here...
          </Typography>
        </Collapse>
      </Card>

      {/* Orbit Form */}
      <OrbitForm
        open={orbitOpen}
        onClose={() => setOrbitOpen(false)}
        onSubmit={handleAddSatellite}
      />
    </Box>
  );
};

export default Sidebar;
