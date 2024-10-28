import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "../Assets/Images/settings.svg";
import { Header, Level, NotificationsContainer } from "../Containers";
import { io } from "socket.io-client";

const socket = io("http://localhost:5050");

const HomePage: React.FC = () => {
  const [niveaux, setNiveaux] = useState({ croquettes: 0, eau: 0 });
  const navigate = useNavigate();

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
    socket.on("niveauUpdate", (newData) => {
      setNiveaux(newData); // Mettre à jour l'état dès qu'une nouvelle donnée arrive
    });

    return () => {
      socket.off("niveauUpdate");
    };
  }, []);

  return (
    <Box className="h-auto bg-bg flex flex-col gap-9">
      <Header />
      <Box>
        <Box className="pb-12 p-3">
          <Button
            className="cursor-pointer"
            onClick={() => navigate("/settings")}
          >
            <img src={SettingsIcon} alt="Icon paramètre" className="size-12" />
          </Button>

          <Level label="Eau" progress={niveaux.eau} />
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
