// components/OrbitForm.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

type OrbitFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (satellite: {
    name: string;
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    raan: number;
    argOfPerigee: number;
    trueAnomaly: number;
  }) => void;
};

const OrbitForm: React.FC<OrbitFormProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [semiMajorAxis, setSemiMajorAxis] = useState(7000);
  const [eccentricity, setEccentricity] = useState(0);
  const [inclination, setInclination] = useState(0);
  const [raan, setRaan] = useState(0);
  const [argOfPerigee, setArgOfPerigee] = useState(0);
  const [trueAnomaly, setTrueAnomaly] = useState(0);

  const handleSubmit = () => {
    onSubmit({
      name,
      semiMajorAxis,
      eccentricity,
      inclination,
      raan,
      argOfPerigee,
      trueAnomaly,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.12)",
          color: "#fff",
        },
      }}
    >
      <DialogTitle>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontFamily: "SF Pro Display, Helvetica, Arial, sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          ➕ Add Satellite Orbit
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Satellite Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: "#ddd" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="Semi-Major Axis (km)"
            type="number"
            value={semiMajorAxis}
            onChange={(e) => setSemiMajorAxis(Number(e.target.value))}
            InputLabelProps={{ style: { color: "#ddd" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="Eccentricity (0-1)"
            type="number"
            value={eccentricity}
            onChange={(e) => setEccentricity(Number(e.target.value))}
            inputProps={{ step: 0.01, min: 0, max: 1 }}
            InputLabelProps={{ style: { color: "#ddd" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="Inclination (°)"
            type="number"
            value={inclination}
            onChange={(e) => setInclination(Number(e.target.value))}
            InputLabelProps={{ style: { color: "#ddd" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="RAAN (°)"
            type="number"
            value={raan}
            onChange={(e) => setRaan(Number(e.target.value))}
            InputLabelProps={{ style: { color: "#ddd" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="Argument of Perigee (°)"
            type="number"
            value={argOfPerigee}
            onChange={(e) => setArgOfPerigee(Number(e.target.value))}
            InputLabelProps={{ style: { color: "#ddd" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="True Anomaly (°)"
            type="number"
            value={trueAnomaly}
            onChange={(e) => setTrueAnomaly(Number(e.target.value))}
            InputLabelProps={{ style: { color: "#ddd" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#bbb" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(135deg, #007aff, #4a90e2)",
            "&:hover": {
              background: "linear-gradient(135deg, #0051a8, #357abd)",
            },
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrbitForm;