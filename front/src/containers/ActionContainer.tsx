import { Box, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { useUrl } from "../Context/UrlContext";

const ActionContainer: React.FC = () => {
  const { url } = useUrl();

  const [loading, setLoading] = useState<string | null>(null); // Pour le bouton en cours de traitement
  const [error, setError] = useState<string | null>(null); // Pour les erreurs
  const [success, setSuccess] = useState<string | null>(null); // Pour les succès
  const [cooldown, setCooldown] = useState<{ [key: string]: boolean }>({
    Croquettes: false,
    Eau: false,
    Friandises: false,
  }); // Cooldown par bouton

  const COOLDOWN_DURATION = 3000; // Délai en millisecondes (3 secondes)

  // Fonction générique pour distribuer
  const handleDistribution = async (endpoint: string, action: string) => {
    setLoading(action);
    setError(null);
    setSuccess(null);

    setCooldown((prev) => ({ ...prev, [action]: true })); // Active le cooldown pour ce bouton

    try {
      const response = await fetch(`${url}api/${endpoint}`);
      if (!response.ok) throw new Error("Réponse du serveur non valide");
      const data = await response.json();
      setSuccess(data.message);
    } catch (error) {
      setError(`Erreur lors de l'appel à ${action} : ${error}`);
    } finally {
      setLoading(null);
      setTimeout(() => {
        setCooldown((prev) => ({ ...prev, [action]: false })); // Désactive le cooldown après 3 secondes
      }, COOLDOWN_DURATION);
    }
  };

  // Fonction pour déterminer le texte dynamique des boutons
  const getButtonText = (action: string, label: string) => {
    if (loading === action || cooldown[action]) return "Distribution en cours...";
    return label;
  };

  return (
    <Box className="border-solid border-2 border-black sm:gap-0 gap-3 rounded-lg sm:w-1/2 p-3 flex flex-col justify-around">
      <Button
        onClick={() => handleDistribution("distribuer_croquettes", "Croquettes")}
        variant="contained"
        disabled={loading === "Croquettes" || cooldown.Croquettes}
        sx={{ backgroundColor: "var(--main)", color: "white" }}
      >
        {loading === "Croquettes" ? <CircularProgress size={24} /> : getButtonText("Croquettes", "Remplir Nourriture")}
      </Button>

      <Button
        onClick={() => handleDistribution("distribuer_eau", "Eau")}
        variant="contained"
        disabled={loading === "Eau" || cooldown.Eau}
sx={{ backgroundColor: "var(--info)", color: "white" }}

      >
        {loading === "Eau" ? <CircularProgress size={24} /> : getButtonText("Eau", "Remplir Eau")}
      </Button>

      <Button
        onClick={() => handleDistribution("distribuer_friandises", "Friandises")}
        variant="contained"
        disabled={loading === "Friandises" || cooldown.Friandises}
sx={{ backgroundColor: "var(--muted)", color: "white" }}
      >
        {loading === "Friandises" ? <CircularProgress size={24} /> : getButtonText("Friandises", "Donner Friandise")}
      </Button>

      {/* Affichage des notifications */}
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