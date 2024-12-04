const mongoose = require("mongoose");

const SchemaUtilisateur = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    preferences: {
      distributionAutomatiqueEau: { type: Boolean, default: true },
      seuilNourriture: { type: Number, default: 20 },
      seuilEau: { type: Number, default: 20 },
      distributionAutomatiqueCroquettes: { type: Boolean, default: true },
      taillePortionEau: {
        type: String,
        enum: ["petite", "moyenne", "grande"],
        default: "petite",
      },
      taillePortionCroquettes: {
        type: String,
        enum: ["petite", "moyenne", "grande"],
        default: "petite",
      },
      limiteFriandises: { type: Number, default: 5 },
    },
    creeLe: { type: Date, default: Date.now },
    derniereConnexion: { type: Date },
  },
  { timestamps: true }
);

const utilisateur = mongoose.model("utilisateurs", SchemaUtilisateur);

module.exports = utilisateur;
