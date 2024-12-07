import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";
import { useUrl } from "../Context/UrlContext";

// Conteneur stylé
const NotificationContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#FAE3CB",
  border: "2px solid #A0522D",
  color: "#3D3D3D",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(2),
}));

// Notification améliorée
const NotificationItems: React.FC<{ message: string }> = ({ message }) => {
  return (
    <NotificationContainer>
      <WarningIcon fontSize="large" style={{ marginRight: "16px" }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Alerte de Niveau Bas
        </Typography>
        <Typography variant="body1">{message}</Typography>
      </Box>
    </NotificationContainer>
  );
};

const Distributeur = () => {
  const [niveaux, setNiveaux] = useState({ croquettes: 0, eau: 0 });
  const [showFoodNotification, setShowFoodNotification] = useState(false);
  const [showWaterNotification, setShowWaterNotification] = useState(false);
  const navigate = useNavigate();
  const { url } = useUrl();

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch(`${url}api/niveau`); // Appel API backend
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setNiveaux(data);

        // Vérifie si le niveau de croquettes est en dessous de 20%
        setShowFoodNotification(data.croquettes < 20);

        // Vérifie si le niveau d'eau est en dessous de 20%
        setShowWaterNotification(data.eau < 20);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchLevels(); // Charger les données au montage
    const interval = setInterval(fetchLevels, 5000); // Actualiser toutes les 5 secondes
    return () => clearInterval(interval); // Nettoyer l'intervalle à la destruction du composant
  }, []);

  // Fonction pour simuler l'ajout de nourriture
  const handleAddFood = () => {
    setNiveaux((prevNiveaux) => ({
      ...prevNiveaux,
      croquettes: 100, // Remet le niveau à 100% par exemple
    }));
    setShowFoodNotification(false); // Masque la notification après ajout
  };

  // Fonction pour simuler le remplissage d'eau
  const handleAddWater = () => {
    setNiveaux((prevNiveaux) => ({
      ...prevNiveaux,
      eau: 100, // Remet le niveau à 100% par exemple
    }));
    setShowWaterNotification(false); // Masque la notification après ajout
  };

  return (
    <Box>
      {showFoodNotification && (
        <NotificationItems message="Le niveau de croquettes est en dessous de 20% !" />
      )}
      {showWaterNotification && (
        <NotificationItems message="Le niveau d'eau est en dessous de 20% !" />
      )}
    </Box>
  );
};

export default Distributeur;
