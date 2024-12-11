import express from "express";

const router = express.Router();

import { db } from "../../db/connection.js"; // Importation de la connexion MongoDB

// Route pour récupérer l'historique des distributions formaté
router.get("/", async (req, res) => {
	try {
		const historiqueNourriture = await db
			.collection("distributeurs")
			.aggregate([
				{ $unwind: "$historiqueNiveaux" }, // Décompose les tableaux en documents
				{ $sort: { "historiqueNiveaux.horodatage": 1 } }, // Trie par horodatage croissant
				{
					$project: {
						_id: 0, // Exclut l'ID
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
						quantité: "$historiqueNiveaux.croquettes", // Quantité d'eau
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
