import { Box, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { useUrl } from "../Context/UrlContext";

const ActionContainer: React.FC = () => {
  const { url } = useUrl();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDistribution = async (endpoint: string, action: string) => {
    setLoading(action);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${url}api/${endpoint}`);
      if (!response.ok) throw new Error("Erreur lors de l'appel Ã l'API");
      const data = await response.json();
      setSuccess(data.message);
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Box className="border-solid border-2 border-black rounded-lg sm:w-1/2 p-3 flex flex-col gap-3">
      <Button
        onClick={() => handleDistribution("distribuer_croquettes", "Croquettes")}
        variant="contained"
        disabled={loading === "Croquettes"}
      >
        {loading === "Croquettes" ? <CircularProgress size={24} /> : "Remplir Nourriture"}
      </Button>
      <Button
        onClick={() => handleDistribution("distribuer_eau", "Eau")}
        variant="contained"
        disabled={loading === "Eau"}
      >
        {loading === "Eau" ? <CircularProgress size={24} /> : "Remplir Eau"}
      </Button>
      <Button
        onClick={() => handleDistribution("distribuer_friandises", "Friandises")}
        variant="contained"
        disabled={loading === "Friandises"}
        style={{ backgroundColor: "red", color: "white" }}
      >
        {loading === "Friandises" ? <CircularProgress size={24} /> : "Donner Friandise"}
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