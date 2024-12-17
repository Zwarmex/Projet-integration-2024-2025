import { Box, Button, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { useUrl } from "../Context/UrlContext";

const ActionContainer: React.FC = () => {
  const { url } = useUrl();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDistribution = async (endpoint: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${url}api/${endpoint}`);
      if (!response.ok) throw new Error("Erreur lors de l'appel Ã l'API");
      const data = await response.json();
      setSuccess(data.message);
    } catch (err) {
      setError("Une erreur est survenue");
    }
  };

  return (
    <Box className="border-solid border-2 border-black rounded-lg sm:w-1/2 p-3 flex flex-col gap-3">
      <Button
        onClick={() => handleDistribution("distribuer_croquettes")}
        variant="contained"
      >
        Remplir Nourriture
      </Button>
      <Button
        onClick={() => handleDistribution("distribuer_eau")}
        variant="contained"
      >
        Remplir Eau
      </Button>
      <Button
        onClick={() => handleDistribution("distribuer_friandises")}
        variant="contained"
        style={{ backgroundColor: "red", color: "white" }}
      >
        Donner Friandise
      </Button>

      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ActionContainer;