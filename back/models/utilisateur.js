const mongoose = require("mongoose");

const SchemaUtilisateur = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    preferences: {
      activerNotifications: { type: Boolean, default: true },
      niveauDeNotifications: {
        type: String,
        enum: ["faible", "moyen", "élevé"],
        default: "faible",
      },
      distributionAutomatiqueEau: { type: Boolean, default: true },
      distributionAutomatiqueCroquettes: { type: Boolean, default: true },
      taillePortionEau: { type: Number, default: 200 },
      taillePortionCroquettes: { type: Number, default: 50 },
    },
    creeLe: { type: Date, default: Date.now },
    derniereConnexion: { type: Date },
  },
  { timestamps: true }
);

const utilisateur = mongoose.model("utilisateurs", SchemaUtilisateur);

module.exports = utilisateur;
