import Distributeur from "../models/distributeur.js";
import mongoose from "mongoose";

/**
 * Gère la réception des messages MQTT et met à jour la base de données MongoDB.
 * @param {String} topic - Le topic MQTT du message.
 * @param {Buffer} message - Le message reçu en MQTT.
 **/

export const distributionMqttHandler = async (topic, message) => {
  try {
    if (!mongoose.connection.readyState) {
      console.error("La connexion MongoDB n'est pas prête !");
      return;
    }
    // Parse le message reçu
    const payload = JSON.parse(message.toString());
    const { quantite, type, declencheur } = payload;
    console.log("Distribution :", payload);
    const distributeurId = topic.split("/")[2];
    if (!distributeurId) {
      console.error("Identifiant de distributeur introuvable dans le topic.");
      return;
    }
    const result = await Distributeur.findOneAndUpdate(
      { _id: distributeurId }, // Filtre sur l'identifiant du distributeur
      {
        $push: {
          historiqueDistributions: {
            quantite: quantite,
            type: type,
            declencheur: declencheur,
            horodatage: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
          },
        },
      }
    );
    if (!result) {
      console.error(`Distributeur avec ID ${distributeurId} introuvable.`);
    } else {
      console.log(
        `historiqueDistributions mis à jour pour le distributeur ${distributeurId}`
      );
    }
  } catch (error) {
    console.error("Erreur lors du traitement de l'événement MQTT :", error);
  }
};
