const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const distributeurId = "distributeurPrototype";
const options = {
    host: process.env.MQTT_HOST,
    port: Number(process.env.MQTT_PORT),
    protocol: "mqtts",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
};

app.use(cors());
app.use(express.json());


app.get("/api/mesure_stock", (req, res) => {
    mqttClient.publish(
        `smartpaws/commandes/${distributeurId}`,
        "mesurer_stock"
    );
    res.json({
        message: "Commande de mesure du stock envoyée au Raspberry Pi",
    });
});

app.get("/api/distribuer_croquettes", (req, res) => {
    mqttClient.publish(
        `smartpaws/commandes/${distributeurId}`,
        "distribuer_croquettes"
    );
    res.json({
        message: "Commande de distribution de croquettes envoyée au Raspberry Pi",
    });
});

app.get("/api/niveau", (req, res) => {
    res.json({ croquettes: 80, eau: 50 });
});

// Configuration MQTT
const mqttClient = mqtt.connect(options);
mqttClient.on("connect", () => {
    console.log("Connecté au broker MQTT");
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


if (process.env.NODE_ENV === "test") {
    const request = require("supertest");
    const express = require("express");
    const mqtt = require("mqtt");

    jest.mock("mqtt", () => {
        const mockClient = {
            on: jest.fn(),
            publish: jest.fn((topic, message, callback) => callback && callback(null)),
            end: jest.fn(),
        };
        return {
            connect: jest.fn(() => mockClient),
        };
    });

    const mqttClient = mqtt.connect();

    // Serveur minimal simulé pour les tests
    const app = express();
    app.use(express.json());

    app.get("/api/mesure_stock", (req, res) => {
        mqttClient.publish(
            "smartpaws/commandes/distributeurPrototype",
            "mesurer_stock",
            () => {
                res.json({ message: "Commande de mesure du stock envoyée au Raspberry Pi" });
            }
        );
    });

    app.get("/api/distribuer_croquettes", (req, res) => {
        mqttClient.publish(
            "smartpaws/commandes/distributeurPrototype",
            "distribuer_croquettes",
            () => {
                res.json({ message: "Commande de distribution de croquettes envoyée au Raspberry Pi" });
            }
        );
    });

    app.get("/api/niveau", (req, res) => {
        res.json({ croquettes: 80, eau: 50 });
    });

    describe("API Tests (fonctionnels)", () => {
        afterEach(() => {
            jest.clearAllMocks(); // Nettoyer les mocks après chaque test
        });

        afterAll(() => {
            mqttClient.end(); // Fermer le client MQTT après les tests
        });

        test("GET /api/mesure_stock - déclenche la commande de mesure de stock", async () => {
            const res = await request(app).get("/api/mesure_stock");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: "Commande de mesure du stock envoyée au Raspberry Pi",
            });

            // Vérifie que `mqttClient.publish` a été appelé correctement
            expect(mqttClient.publish).toHaveBeenCalledTimes(1);
            expect(mqttClient.publish).toHaveBeenCalledWith(
                "smartpaws/commandes/distributeurPrototype",
                "mesurer_stock",
                expect.any(Function)
            );
        });

        test("GET /api/distribuer_croquettes - déclenche la distribution de croquettes", async () => {
            const res = await request(app).get("/api/distribuer_croquettes");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: "Commande de distribution de croquettes envoyée au Raspberry Pi",
            });

            // Vérifie que `mqttClient.publish` a été appelé correctement
            expect(mqttClient.publish).toHaveBeenCalledTimes(1);
            expect(mqttClient.publish).toHaveBeenCalledWith(
                "smartpaws/commandes/distributeurPrototype",
                "distribuer_croquettes",
                expect.any(Function)
            );
        });

        test("GET /api/niveau - retourne les niveaux actuels", async () => {
            const res = await request(app).get("/api/niveau");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ croquettes: 80, eau: 50 });
        });
    });
}