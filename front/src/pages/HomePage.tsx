import { Box } from "@mui/material";
import SettingsIcon from "../Assets/Images/settings.svg";
import { Header, Level, NotificationsContainer } from "../Containers";
import React, { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const [niveaux, setNiveaux] = useState({ croquettes: 0 });

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/niveau"); // Appel API backend
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setNiveaux(data); // Met à jour l'état avec les données récupérées
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchLevels(); // Charger les données au montage
    const interval = setInterval(fetchLevels, 5000); // Actualiser toutes les 5 secondes
    return () => clearInterval(interval); // Nettoyer l'intervalle à la destruction du composant
  }, []);

  return (
    <Box className="h-auto bg-bg flex flex-col gap-9">
      <Header />
      <Box>
        <Box className="pb-12 p-3">
          <img src={SettingsIcon} className="size-12" alt="Icon paramètre" />

          <Level label="Eau" progress={60} />
          {/* Pour changer la valeur de la bar il faut mettre le nombre en pourcentage */}
          <Level label="Nourriture" progress={niveaux.croquettes} />
          {/* Pour changer la valeur de la bar il faut mettre le nombre en pourcentage */}
        </Box>
        <Box className="flex w-full p-3">
          <Box className="w-1/2">A voir quel container mettre ici</Box>
          <NotificationsContainer />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
