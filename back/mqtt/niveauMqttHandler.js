import Distributeur from "../models/distributeur.js";
import mongoose from "mongoose";

/**
 * Gère la réception des messages MQTT et met à jour la base de données MongoDB.
 * @param {String} topic - Le topic MQTT du message.
 * @param {Buffer} message - Le message reçu en MQTT.
 **/

export const niveauMqttHandler = async (topic, message) => {
  try {
    if (!mongoose.connection.readyState) {
      console.error("La connexion MongoDB n'est pas prête !");
      return;
    }

    const payload = JSON.parse(message);
    const { croquettes, eau } = payload;
    const distributeurId = topic.split("/")[2];
    const result = await Distributeur.findOneAndUpdate(
      { _id: distributeurId },
      {
        niveauxReservoirs: {
          niveauCroquettes: croquettes,
          niveauEau: eau,
          misAJourLe: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
        },
        $push: {
          historiqueNiveaux: {
            eau: eau,
            croquettes: croquettes,
          },
          horodatage: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
        },
      },
      { new: true, useFindAndModify: false } // Options pour retourner le document mis à jour
    );
    if (!result) {
      console.error(`Distributeur avec ID ${distributeurId} introuvable.`);
    } else {
      console.log(
        `niveauxReservoirs et historiqueNiveaux mis à jour pour le distributeur ${distributeurId}`
      );
    }
  } catch (error) {
    console.error("Erreur lors du traitement de l'événement MQTT :", error);
  }
};
