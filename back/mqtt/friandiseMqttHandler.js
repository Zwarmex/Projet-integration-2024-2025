import Distributeur from "../models/distributeur.js";
import mongoose from "mongoose";

/**
 * Gère la réception des messages MQTT et met à jour la base de données MongoDB.
 * @param {String} topic - Le topic MQTT du message.
 * @param {Buffer} message - Le message reçu en MQTT.
 **/

export const friandiseMqttHandler = async (topic, message) => {
  try {
    if (!mongoose.connection.readyState) {
      console.error("La connexion MongoDB n'est pas prête !");
      return;
    }

    // Parse le message reçu
    const payload = JSON.parse(message.toString());
    const { event, compteur, limite } = payload;
    // Vérifie si l'événement est valide
    if (
      event === "limite_friandise_atteinte" ||
      event === "bouton_friandise_appuye"
    ) {
      const distributeurId = topic.split("/")[2]; // Exemple : topic = "smartpaws/historique/distributeur-12345"
      if (!distributeurId) {
        console.error("Identifiant de distributeur introuvable dans le topic.");
        return;
      }

      // Met à jour l'historiqueComportements dans MongoDB
      const result = await Distributeur.findOneAndUpdate(
        { _id: distributeurId }, // Filtre sur l'identifiant du distributeur
        {
          $push: {
            historiqueComportements: {
              event: event,
              compteur: compteur,
              limite: limite,
              horodatage: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), // Ajout de 1 heure pour UTC+1
            },
          },
        },
        { new: true, useFindAndModify: false } // Options pour retourner le document mis à jour
      );

      if (!result) {
        console.error(`Distributeur avec ID ${distributeurId} introuvable.`);
      } else {
        console.log(
          `Base de données mise à jour pour le distributeur ${distributeurId}`
        );
      }
    } else {
      console.log(`Événement non pris en charge : ${event}`);
    }
  } catch (error) {
    console.error("Erreur lors du traitement de l'événement MQTT :", error);
  }
};
