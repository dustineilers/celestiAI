import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Satellite Orbit</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Satellite Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Semi-Major Axis (km)"
            type="number"
            value={semiMajorAxis}
            onChange={(e) => setSemiMajorAxis(Number(e.target.value))}
          />
          <TextField
            fullWidth
            label="Eccentricity (0-1)"
            type="number"
            value={eccentricity}
            onChange={(e) => setEccentricity(Number(e.target.value))}
            inputProps={{ step: 0.01, min: 0, max: 1 }}
          />
          <TextField
            fullWidth
            label="Inclination (°)"
            type="number"
            value={inclination}
            onChange={(e) => setInclination(Number(e.target.value))}
          />
          <TextField
            fullWidth
            label="RAAN (°)"
            type="number"
            value={raan}
            onChange={(e) => setRaan(Number(e.target.value))}
          />
          <TextField
            fullWidth
            label="Argument of Perigee (°)"
            type="number"
            value={argOfPerigee}
            onChange={(e) => setArgOfPerigee(Number(e.target.value))}
          />
          <TextField
            fullWidth
            label="True Anomaly (°)"
            type="number"
            value={trueAnomaly}
            onChange={(e) => setTrueAnomaly(Number(e.target.value))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrbitForm;
