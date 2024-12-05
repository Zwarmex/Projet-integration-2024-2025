import mongoose from "mongoose";

// ToDo : CROQUETTE ??
const NiveauHistoriqueSchema = new mongoose.Schema({
  niveau: [
    {
      eau: { type: Number, required: true },
      croquettes: { type: Number, required: true },
    },
  ],
  horodatage: { type: Date, default: Date.now },
});
// ToDo : EAU ??
const DistributionHistoriqueSchema = new mongoose.Schema({
  type: { type: String, enum: ["croquettes", "eau"], required: true },
  quantite: {
    type: String,
    enum: ["petite", "moyenne", "grande"],
    required: true,
  },
  horodatage: { type: Date, default: Date.now },
  declencheur: {
    type: String,
    enum: ["automatique", "manuel"],
    required: true,
  },
});

const ComportementHistoriqueSchema = new mongoose.Schema({
  event: { type: String, required: true },
  compteur: { type: Number, required: true },
  limite: { type: Number, required: true },
  horodatage: { type: Date, default: Date.now },
});

const DistributeurSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    proprietaireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    niveauxReservoirs: {
      niveauCroquettes: { type: Number, required: true },
      niveauEau: { type: Number, required: true },
      misAJourLe: { type: Date, default: Date.now },
    },
    historiqueNiveaux: [NiveauHistoriqueSchema],
    historiqueDistributions: [DistributionHistoriqueSchema],
    historiqueComportements: [ComportementHistoriqueSchema],
  },
  { timestamps: true }
);

const Distributeur = mongoose.model("distributeurs", DistributeurSchema);

export default Distributeur; // Export ES6
