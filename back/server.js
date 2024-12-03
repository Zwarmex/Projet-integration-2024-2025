import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mqtt from "mqtt";
import { Server } from "socket.io";
import historiqueEauRoutes from "./routes/historique/eau.js"; // Ajout de la route
import historiqueNourritureRoutes from "./routes/historique/nourriture.js"; // Ajout de la route
import recordRoutes from "./routes/record.js"; // Ajout de la route

dotenv.config(); // Charger les variables d'environnement

const PORT = process.env.PORT || 5050;
const app = express();

const options = {
  host: process.env.MQTT_HOST,
  port: Number(process.env.MQTT_PORT),
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000, // Tente de se reconnecter chaque seconde si la connexion est perdue
};

app.use(cors());
app.use(express.json());
app.use("/api/records", recordRoutes);
app.use("/api/historique-nourriture", historiqueNourritureRoutes);
app.use("/api/historique-eau", historiqueEauRoutes);

app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

let niveauxActuels = { croquettes: 0, eau: 0 }; // Stockage temporaire des données

// Configuration du serveur HTTP et Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adresse du frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Nouvelle connexion Socket.IO");

  socket.on("disconnect", (reason) => {
    console.log("Déconnexion Socket.IO:", reason);
  });

  socket.on("error", (error) => {
    console.error("Erreur Socket.IO:", error);
  });
});

// Configuration du client MQTT
const mqttClient = mqtt.connect(options); // Adresse du MQTT local

mqttClient.on("connect", () => {
  console.log("Connecté au broker MQTT");
  mqttClient.subscribe("smartpaws/niveau", (err) => {
    if (err) {
      console.error("Erreur d'abonnement au topic MQTT", err);
    }
  });
});

mqttClient.on("error", (error) => {
  console.error("Erreur de connexion MQTT :", error);
});

// Réception des messages publiés sur le topic
mqttClient.on("message", (topic, message) => {
  niveauxActuels = JSON.parse(message.toString());
  console.log("Nouveaux niveaux reçus :", niveauxActuels);
  io.emit("niveauUpdate", niveauxActuels);
});

// Endpoint pour déclencher une mesure de niveau
app.get("/api/mesure_stock", (req, res) => {
  mqttClient.publish("smartpaws/commandes", "mesurer_stock"); // Envoie la commande au Raspberry Pi
  res.json({
    message: "Commande de mesure du stock envoyée au Raspberry Pi",
  });
});

// Endpoint pour mettre à jour les paramètres
app.post("/api/update-params", (req, res) => {
  try {
    // Récupérer les paramètres depuis le frontend
    const {
      limite_friandise,
      quantite_croquettes,
      quantite_eau,
      seuil_eau,
      seuil_croquettes,
      distribution_auto_eau,
      distribution_auto_croquettes,
    } = req.body;

    // Format JSON à envoyer
    const payload = {
      limite_friandise,
      quantite_croquettes,
      quantite_eau,
      seuil_eau,
      seuil_croquettes,
      distribution_auto_eau: distribution_auto_eau ? "True" : "False",
      distribution_auto_croquettes: distribution_auto_croquettes
        ? "True"
        : "False",
    };

    // Convertir en string JSON
    const message = `update_params${JSON.stringify(payload)}`;

    // Publier sur le topic MQTT
    mqttClient.publish("smartpaws/commandes", message, (err) => {
      if (err) {
        console.error("Erreur lors de l'envoi du message MQTT:", err);
        return res.status(500).json({ error: "Erreur MQTT" });
      }
      console.log("Message publié avec succès :", message);
      return res.status(200).json({
        success: true,
        message: "Paramètres mis à jour avec succès !",
      });
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour des paramètres" });
  }
});
// API pour renvoyer les niveaux de croquette actuels
app.get("/api/niveau", (req, res) => {
  res.json(niveauxActuels);
});

// start the Express server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
