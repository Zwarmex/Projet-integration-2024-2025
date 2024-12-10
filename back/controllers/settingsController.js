import Utilisateur from "../models/utilisateur.js";
import Distributeur from "../models/distributeur.js";
import mongoose from "mongoose";

/**
 * Enregistre ou met à jour les paramètres utilisateur dans la base de données.
 * @param {Object} param - paramètres.
 * @param {String} topic - Le topic MQTT du message.
 */
export const enregisterParametres = async (param, topic) => {
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
