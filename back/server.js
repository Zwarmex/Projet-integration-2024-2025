import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mqtt from "mqtt";
import { Server } from "socket.io";
import { enregisterParametres } from "./controllers/settingsController.js";
import { connectDB } from "./db/connection.js";
import { distributionMqttHandler } from "./mqtt/distributionMqttHandler.js";
import { friandiseMqttHandler } from "./mqtt/friandiseMqttHandler.js";
import { niveauMqttHandler } from "./mqtt/niveauMqttHandler.js";
import historiqueRoutes from "./routes/historique/index.js"; // Ajout de la route
import recordRoutes from "./routes/record.js"; // Ajout de la route

dotenv.config(); // Charger les variables d'environnement

const PORT = process.env.PORT || 5050;
const app = express();

// Id du distributeur, statique pour le moment mais dynamique une fois l'authentification implémentée
const distributeurId = "distributeurPrototype";

const options = {
	host: process.env.MQTT_HOST,
	port: Number(process.env.MQTT_PORT),
	protocol: "mqtts",
	username: process.env.MQTT_USERNAME,
	password: process.env.MQTT_PASSWORD,
	reconnectPeriod: 1000, // Tente de se reconnecter chaque seconde si la connexion est perdue
};

app.use(cors());

app.use((req, res, next) => {
	console.log(
		`${new Date().toUTCString()} - Requête reçue : ${req.method} ${req.url}`
	);
	next();
});

app.use(express.json());
app.use("/api/records", recordRoutes);
app.use("/api/historique", historiqueRoutes);

app.use((err, req, res, next) => {
	console.error("Erreur serveur :", err.stack);
	res.status(500).json({ message: "Erreur interne du serveur" });
});

let niveauxActuels = { croquettes: 0, eau: 0 }; // Stockage temporaire des données

// Configuration du serveur HTTP et Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.WEB_SOCKET, // Adresse du frontend
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

// Abonnement au topics smartpaws/niveau et smartpaws/historique
mqttClient.on("connect", () => {
	console.log("Connecté au broker MQTT");
	mqttClient.subscribe(`smartpaws/niveau/${distributeurId}`, (err) => {
		if (err) {
			console.error("Erreur d'abonnement au topic MQTT", err);
		} else {
			console.log(`Abonné au topic smartpaws/niveau/${distributeurId}`);
		}
	});
	mqttClient.subscribe(`smartpaws/historique/${distributeurId}`, (err) => {
		if (err) {
			console.error("Erreur d'abonnement au topic MQTT", err);
		} else {
			console.log(
				`Abonné au topic smartpaws/historique/${distributeurId}`
			);
		}
	});
});

mqttClient.on("error", (error) => {
	console.error("Erreur de connexion MQTT :", error);
});

// Réception des messages publiés sur le topic
mqttClient.on("message", (topic, message) => {
	if (topic === `smartpaws/niveau/${distributeurId}`) {
		niveauxActuels = JSON.parse(message.toString());
		niveauMqttHandler(topic, message);
		io.emit("niveauUpdate", niveauxActuels);
	}
	if (topic === `smartpaws/historique/${distributeurId}`) {
		let data = JSON.parse(message.toString());
		console.log(data);
		if (
			["limite_friandise_atteinte", "bouton_friandise_appuye"].includes(
				data.event
			)
		) {
			friandiseMqttHandler(topic, message);
			if (data.event === "limite_friandise_atteinte") {
				console.log("Notification :", data);
				io.emit("notification", {
					type: "limite_friandise",
					message: `Limite atteinte : ${data.compteur}/${data.limite} friandises distribuées aujourd'hui.`,
				});
			}
		}
		if (["petite", "moyenne", "grande"].includes(data.quantite)) {
			distributionMqttHandler(topic, message);
		}
	}
});

// Endpoint pour déclencher une mesure de niveau
app.get("/api/mesure_stock", (req, res) => {
	mqttClient.publish(
		`smartpaws/commandes/${distributeurId}`,
		"mesurer_stock"
	); // Envoie la commande au Raspberry Pi
	res.json({
		message: "Commande de mesure du stock envoyée au Raspberry Pi",
	});
});

// Endpoint pour déclencher une distribution de croquettes
app.get("/api/distribuer_croquettes", (req, res) => {
	mqttClient.publish(
		`smartpaws/commandes/${distributeurId}`,
		"distribuer_croquettes"
	); // Envoie la commande au Raspberry Pi
	res.json({
		message:
			"Commande de distribution de croquettes envoyée au Raspberry Pi",
	});
});

// Endpoint pour déclencher une distribution d'eau
app.get("/api/distribuer_eau", (req, res) => {
	mqttClient.publish(
		`smartpaws/commandes/${distributeurId}`,
		"distribuer_eau"
	); // Envoie la commande au Raspberry Pi
	res.json({
		message: "Commande de distribution d'eau envoyée au Raspberry Pi",
	});
});

// Endpoint pour déclencher une distribution de friandises
app.get("/api/distribuer_friandises", (req, res) => {
	mqttClient.publish(
		`smartpaws/commandes/${distributeurId}`,
		"distribuer_friandises"
	); // Envoie la commande au Raspberry Pi
	res.json({
		message:
			"Commande de distribution de friandises envoyée au Raspberry Pi",
	});
});

// Endpoint pour mettre à jour les paramètres
app.post("/api/update-params", (req, res) => {
	try {
		const topic = `smartpaws/commandes/${distributeurId}`;

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
		enregisterParametres(req.body, topic);
		// Publier sur le topic MQTT
		mqttClient.publish(topic, message, (err) => {
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
	connectDB(process.env.ATLAS_URI, "DB");
	console.log(`Server listening on port ${PORT}`);
});
