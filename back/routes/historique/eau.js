import express from "express";

const router = express.Router();

import db from "../../db/connection.js"; // Importation de la connexion MongoDB

// Route pour récupérer l'historique des niveaux d'eau formaté
router.get("/historique/eau", async (req, res) => {
	try {
		const historiqueEau = await db
			.collection("distributeurs")
			.aggregate([
				{ $unwind: "$historiqueNiveaux" },
				{ $match: { "historiqueNiveaux.type": "eau" } },
				{ $sort: { "historiqueNiveaux.horodatage": 1 } },
				{
					$project: {
						_id: 0,
						date: {
							$dateToString: {
								format: "%Y-%m-%d",
								date: "$historiqueNiveaux.horodatage",
							},
						},
						heure: {
							$dateToString: {
								format: "%H:%M",
								date: "$historiqueNiveaux.horodatage",
							},
						},
						"quantité(mL)": "$historiqueNiveaux.niveau",
					},
				},
			])
			.toArray();

		res.status(200).json(historiqueEau);
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Erreur lors de la récupération des niveaux d'eau.",
		});
	}
});

export default router;
