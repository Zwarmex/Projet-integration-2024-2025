import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SettingsIcon from "../Assets/Images/settings.svg";
import {
  ActionContainer,
  Header,
  Level,
  NotificationsContainer,
} from "../containers";
import { useUrl } from "../Context/UrlContext";

const HomePage: React.FC = () => {
  const { url } = useUrl();

  const socket = io(`${url}`, {
    reconnection: true,
    reconnectionAttempts: 5, // Nombre d'essais avant de renoncer
    reconnectionDelay: 2000, // Délai de 2 secondes entre chaque tentative
  });
  const [niveaux, setNiveaux] = useState({ croquettes: 0, eau: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Reconnexion automatique à Socket.IO dans le frontend
    socket.on("connect", () => {
      console.log("Connecté au serveur Socket.IO");
    });

    socket.on("disconnect", (reason) => {
      console.warn("Déconnecté de Socket.IO :", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Erreur de connexion Socket.IO :", error);
    });

    // Charger les données au montage du composant
    const fetchLevels = async () => {
      try {
        const response = await fetch(`${url}api/niveau`); // Appel API backend pour récuperer le niveau du stock
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

    // Déclencher une mesure du stock à chaque visite du site sur le Pico via le backend
    const triggerMesure = async () => {
      try {
        await fetch(`${url}api/mesure_stock`); // Appel API pour déclencher la mesure
      } catch (error) {
        console.error("Erreur lors du déclenchement de la mesure :", error);
      }
    };
    triggerMesure();

    // Écouter les mises à jour en temps réel via Socket.IO
    socket.on("niveauUpdate", (newData) => {
      setNiveaux(newData); // Mettre à jour l'état dès qu'une nouvelle donnée arrive
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("niveauUpdate");
    };
  }, []);

  return (
    <Box className="h-full bg-bg flex flex-col">
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
        <Box className="flex flex-col w-full p-3 sm:gap-1 gap-4 sm:flex-row">
          <ActionContainer />
          <NotificationsContainer />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
