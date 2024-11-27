const mongoose = require("mongoose");

// ToDo : CROQUETTE ??
const NiveauHistoriqueSchema = new mongoose.Schema({
	type: { type: String, enum: ["croquettes", "eau"], required: true },
	niveau: { type: Number, required: true },
	horodatage: { type: Date, default: Date.now },
});
// ToDo : EAU ??
const DistributionHistoriqueSchema = new mongoose.Schema({
	type: { type: String, enum: ["croquettes", "eau"], required: true },
	quantite: { type: Number, required: true },
	horodatage: { type: Date, default: Date.now },
	declencheur: {
		type: String,
		enum: ["automatique", "manuel"],
		required: true,
	},
});

const ComportementHistoriqueSchema = new mongoose.Schema({
	event: { type: String, required: true },
	horodatage: { type: Date, default: Date.now },
});

const DistributeurSchema = new mongoose.Schema(
	{
		proprietaireId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		parametres: {
			taillePortionCroquettes: { type: Number, default: 50 },
			taillePortionEau: { type: Number, default: 200 },
			friandisesMaxParJour: { type: Number, default: 5 },
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

module.exports = Distributeur;
