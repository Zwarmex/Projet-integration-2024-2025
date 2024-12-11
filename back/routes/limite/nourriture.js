import express from "express";

const router = express.Router();

import { db } from "../../db/connection.js"; // Importation de la connexion MongoDB

router.get("/", async (req, res) => {
	try {
		const seuilNourriture = await db
			.collection("utilisateurs")
			.find(
				{},
				{
					projection: {
						_id: 0,
						"preferences.seuilNourriture": 1, // Projeter uniquement seuilNourriture
					},
				}
			)
			.toArray();

		const resultat = seuilNourriture.map(
			(doc) => doc.preferences.seuilNourriture
		);

		res.status(200).json(resultat[0]); // Renvoie les résultats
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Erreur lors de la récupération de la limite de l'eau.",
		});
	}
});

export default router;
