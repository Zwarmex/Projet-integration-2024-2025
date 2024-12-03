import express from "express";

const router = express.Router();

import db from "../../db/connection.js"; // Importation de la connexion MongoDB

// Route pour récupérer l'historique des distributions formaté
router.get("/historique/nourriture", async (req, res) => {
	try {
		const historiqueNourriture = await db
			.collection("distributeurs")
			.aggregate([
				{ $unwind: "$historiqueDistributions" },
				{ $sort: { "historiqueDistributions.horodatage": 1 } },
				{
					$project: {
						_id: 0,
						date: {
							$dateToString: {
								format: "%Y-%m-%d",
								date: "$historiqueDistributions.horodatage",
							},
						},
						heure: {
							$dateToString: {
								format: "%H:%M",
								date: "$historiqueDistributions.horodatage",
							},
						},
						"quantité(g)": "$historiqueDistributions.quantite",
					},
				},
			])
			.toArray();

		res.status(200).json(historiqueNourriture);
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Erreur lors de la récupération des distributions.",
		});
	}
});

export default router;
