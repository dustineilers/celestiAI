import React, { useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { SatelliteElements } from "./Globe"; // ✅ import correct type

type Props = {
  satellites: SatelliteElements[];
  setSatellites: React.Dispatch<React.SetStateAction<SatelliteElements[]>>;
};

const SatelliteMenu: React.FC<Props> = ({ satellites, setSatellites }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    semiMajorAxisKm: 7000,
    eccentricity: 0,
    inclinationDeg: 0,
    raanDeg: 0,
    argPerigeeDeg: 0,
    trueAnomalyDeg: 0,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? 0 : Number(value),
    }));
  };

  const handleSubmit = () => {
    const newId = satellites.length ? satellites[satellites.length - 1].id + 1 : 1;

    const newSat: SatelliteElements = {
      id: newId,
      name: form.name || `🛰️ NewSat-${newId}`,
      semiMajorAxisKm: form.semiMajorAxisKm,
      eccentricity: form.eccentricity,
      inclinationDeg: form.inclinationDeg,
      raanDeg: form.raanDeg,
      argPerigeeDeg: form.argPerigeeDeg,
      trueAnomalyDeg: form.trueAnomalyDeg,
      color: ["red", "blue", "orange", "green", "purple"][
        Math.floor(Math.random() * 5)
      ],
    };

    setSatellites((prev) => [...prev, newSat]);
    handleClose();
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

      {/* Modal for orbital elements */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Satellite</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Semi-major Axis (km)"
            name="semiMajorAxisKm"
            type="number"
            fullWidth
            value={form.semiMajorAxisKm}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Eccentricity"
            name="eccentricity"
            type="number"
            fullWidth
            inputProps={{ step: 0.01, min: 0, max: 1 }}
            value={form.eccentricity}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Inclination (deg)"
            name="inclinationDeg"
            type="number"
            fullWidth
            value={form.inclinationDeg}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="RAAN (deg)"
            name="raanDeg"
            type="number"
            fullWidth
            value={form.raanDeg}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Argument of Perigee (deg)"
            name="argPerigeeDeg"
            type="number"
            fullWidth
            value={form.argPerigeeDeg}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="True Anomaly (deg)"
            name="trueAnomalyDeg"
            type="number"
            fullWidth
            value={form.trueAnomalyDeg}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SatelliteMenu;