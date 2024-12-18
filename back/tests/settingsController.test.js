const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

dotenv.config(); // Charge les variables d'environnement

const uri = process.env.ATLAS_URI || "";

let db; // Variable pour stocker la base de données

const connectDB = async () => {
    try {
        const client = new MongoClient(uri, {});
        await client.connect();
        db = client.db("DB");
        console.log("Connected to Database");
        await mongoose.connect(uri, {
            dbName: "DB",
        });
    } catch (err) {
        console.error("Please connect Database: " + err);
    }
};

/**
 * Enregistre ou met à jour les paramètres utilisateur dans la base de données.
 * @param {Object} param - paramètres.
 * @param {String} topic - Le topic MQTT du message.
 */
const enregisterParametres = async (param, topic) => {
    try {
        if (!mongoose.connection.readyState) {
            console.error("La connexion MongoDb n'est pas prête");
            return;
        }
        const distributeurId = topic.split("/")[2];
        if (!distributeurId) {
            console.error("Identifiant de distributeur introuvable dans le topic.");
            return;
        }
        const {
            limite_friandise,
            quantite_croquettes,
            quantite_eau,
            seuil_eau,
            seuil_croquettes,
            distribution_auto_eau,
            distribution_auto_croquettes,
        } = param;

        let proprietaireId;

        const distributeur = await Distributeur.find({ _id: distributeurId });

        if (!distributeur) {
            console.error(`Distributeur avec ID ${distributeurId} introuvable.`);
        } else {
            proprietaireId = distributeur[0].proprietaireId;
        }

        if (!proprietaireId) {
            console.error(
                `Erreur : Aucun propriétaire associé au distributeur avec ID ${distributeurId}.`
            );
            return;
        }
        const result = await Utilisateur.findOneAndUpdate(
            { _id: proprietaireId },
            {
                preferences: {
                    distributionAutomatiqueEau: distribution_auto_eau,
                    seuilNourriture: seuil_croquettes,
                    seuilEau: seuil_eau,
                    distributionAutomatiqueCroquettes: distribution_auto_croquettes,
                    taillePortionEau: quantite_eau,
                    taillePortionCroquettes: quantite_croquettes,
                    limiteFriandises: limite_friandise,
                },
            }
        );
        if (!result) {
            console.error(
                `Erreur : Utilisateur avec ID ${proprietaireId} introuvable dans la base de données.`
            );
            return;
        } else {
            console.log("Paramètres utilisateur enregistrés avec succès ");
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des paramètres :", error);
    }
};

// Mocks pour les tests
jest.mock("mongoose", () => ({
    connection: { readyState: 0 }, // Simule une connexion MongoDB inactive par défaut
}));

jest.mock("../models/Distributeur", () => ({
    find: jest.fn(),
}));

jest.mock("../models/Utilisateur", () => ({
    findOneAndUpdate: jest.fn(),
}));

const Distributeur = require("../models/Distributeur");
const Utilisateur = require("../models/Utilisateur");

// Tests
describe("Tests pour enregisterParametres", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Nettoie les mocks après chaque test
    });

    test("Retourne une erreur si la connexion MongoDB n'est pas prête", async () => {
        mongoose.connection.readyState = 0; // Simule une connexion MongoDB inactive
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        await enregisterParametres({}, "smartpaws/commandes/distributeurId");

        expect(consoleErrorSpy).toHaveBeenCalledWith("La connexion MongoDb n'est pas prête");
        consoleErrorSpy.mockRestore();
    });

    test("Retourne une erreur si le topic est invalide", async () => {
        mongoose.connection.readyState = 1; // Simule une connexion MongoDB active
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        await enregisterParametres({}, "smartpaws/commandes");

        expect(consoleErrorSpy).toHaveBeenCalledWith("Identifiant de distributeur introuvable dans le topic.");
        consoleErrorSpy.mockRestore();
    });

   

    test("Retourne une erreur si l'utilisateur n'est pas trouvé", async () => {
        mongoose.connection.readyState = 1; // Simule une connexion MongoDB active
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        Distributeur.find.mockResolvedValue([{ proprietaireId: "proprietaireId" }]);
        Utilisateur.findOneAndUpdate.mockResolvedValue(null); // Simule un utilisateur introuvable

        await enregisterParametres({}, "smartpaws/commandes/distributeurId");

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Erreur : Utilisateur avec ID proprietaireId introuvable dans la base de données."
        );
        consoleErrorSpy.mockRestore();
    });

    test("Enregistre correctement les paramètres utilisateur", async () => {
        mongoose.connection.readyState = 1; // Simule une connexion MongoDB active
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        Distributeur.find.mockResolvedValue([{ proprietaireId: "proprietaireId" }]);
        Utilisateur.findOneAndUpdate.mockResolvedValue(true); // Simule un utilisateur mis à jour

        await enregisterParametres(
            {
                limite_friandise: 10,
                quantite_croquettes: 20,
                quantite_eau: 30,
                seuil_eau: 5,
                seuil_croquettes: 4,
                distribution_auto_eau: true,
                distribution_auto_croquettes: false,
            },
            "smartpaws/commandes/distributeurId"
        );

        expect(consoleLogSpy).toHaveBeenCalledWith("Paramètres utilisateur enregistrés avec succès ");
        consoleLogSpy.mockRestore();
    });
});