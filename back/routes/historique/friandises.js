import express from "express";

const router = express.Router();

import { db } from "../../db/connection.js"; // Importation de la connexion MongoDB

router.get("/", async (req, res) => {
	try {
		const historiqueFriandises = await db
			.collection("distributeurs")
			.aggregate([
				{ $unwind: "$historiqueComportements" }, // Décompose les tableaux en documents
				{ $sort: { "historiqueComportements.horodatage": 1 } }, // Trie par horodatage croissant
				{
					$project: {
						_id: 0,
						date: {
							$dateToString: {
								format: "%Y-%m-%d",
								date: "$historiqueComportements.horodatage",
							},
						},
						heure: {
							$dateToString: {
								format: "%H:%M",
								date: "$historiqueComportements.horodatage",
							},
						},
						quantité: "$historiqueComportements.compteur", // Quantité de friandise
					},
				},
			])
			.toArray();

		res.status(200).json(historiqueFriandises); // Renvoie les résultats
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Erreur lors de la récupération des friandises.",
		});
	}
});

export default router;
