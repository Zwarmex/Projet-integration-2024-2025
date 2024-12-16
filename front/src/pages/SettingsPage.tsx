import {
	Alert,
	Box,
	Button,
	FormControlLabel,
	Grid,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Snackbar,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Header } from "../containers";
import { useUrl } from "../Context/UrlContext";

const SettingsPage: React.FC = () => {
	const { url } = useUrl();
	const [foodLimit, setFoodLimit] = useState<number>(0);
	const [limiteFriandise, setLimiteFriandise] = useState<number>(0);
	const [waterLimit, setWaterLimit] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const foodLimitData = await fetchFoodLimit();
				const limiteFriandiseData = await fetchSnacksLimite();
				const waterLimitData = await fetchWaterLimit();

				setFoodLimit(foodLimitData);
				setLimiteFriandise(limiteFriandiseData);
				setWaterLimit(waterLimitData);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching data:", error);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Met à jour les valeurs dans settings lorsque les limites sont récupérées
	useEffect(() => {
		if (!loading) {
			setSettings((prevSettings) => ({
				...prevSettings,
				feedThreshold: foodLimit, // Met à jour le seuil de nourriture
				waterThreshold: waterLimit, // Met à jour le seuil d'eau
				dailyTreatLimit: limiteFriandise, // Met à jour la limite de friandises
			}));
		}
	}, [foodLimit, waterLimit, limiteFriandise, loading]);

	const fetchFoodLimit = async () => {
		try {
			const rawFoodLimit = await fetch(`${url}api/limite/nourriture`);
			const foodLimitData = await rawFoodLimit.json();
			return foodLimitData;
		} catch (error) {
			console.log("Error fetching food limit:", error);
			return [];
		}
	};
	const fetchSnacksLimite = async () => {
		try {
			const rawLimiteFriandise = await fetch(
				`${url}api/limite/friandises`
			);
			const limiteFriandiseData = await rawLimiteFriandise.json();
			return limiteFriandiseData;
		} catch (error) {
			console.log("Error fetching snacks limit:", error);
			return [];
		}
	};
	const fetchWaterLimit = async () => {
		try {
			const rawWaterLimit = await fetch(`${url}api/limite/eau`);
			const waterLimitData = await rawWaterLimit.json();
			return waterLimitData;
		} catch (error) {
			console.log("Error fetching snacks limit:", error);
			return [];
		}
	};

	// Centralisation de l'état
	const [settings, setSettings] = useState({
		autoFeedEnabled: true,
		autoWaterEnabled: true,
		feedThreshold: foodLimit, // Seuil pour la nourriture (en grammes)
		waterThreshold: waterLimit, // Seuil pour l'eau (en millilitres)
		feedQuantity: "Petite", // Quantité de distribution de nourriture
		waterQuantity: "Petite", // Quantité de distribution d'eau
		dailyTreatLimit: limiteFriandise, // Limite quotidienne de friandises
	});
	console.log(foodLimit);
	const [openSnackbar, setOpenSnackbar] = useState(false); // État pour gérer le toast
	const [error, setError] = useState<string | null>(null); // Gestion des erreurs

	// Gestion des changements d'état pour les Switches
	const handleToggle = (key: keyof typeof settings) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			[key]: !prevSettings[key],
		}));
	};

	// Gestion des champs de saisie ou de sélection
	const handleInputChange = (
		key: keyof typeof settings,
		value: string | number
	) => {
		// Validation des entrées pour empêcher des valeurs négatives
		if (
			(key === "feedThreshold" || key === "waterThreshold") &&
			Number(value) < 0
		) {
			setError("Les seuils doivent être des valeurs positives.");
			return;
		}
		if (key === "dailyTreatLimit" && Number(value) < 1) {
			setError(
				"La limite quotidienne de friandises doit être au moins de 1."
			);
			return;
		}
		setError(null); // Réinitialiser l'erreur si tout est correct
		setSettings((prevSettings) => ({
			...prevSettings,
			[key]: value,
		}));
	};

	const handleSave = async () => {
		try {
			// Format des données à envoyer
			const payload = {
				limite_friandise: settings.dailyTreatLimit,
				quantite_croquettes: settings.feedQuantity.toLowerCase(),
				quantite_eau: settings.waterQuantity.toLowerCase(),
				seuil_eau: settings.autoWaterEnabled
					? settings.waterThreshold
					: -100,
				seuil_croquettes: settings.autoFeedEnabled
					? settings.feedThreshold
					: -100,
				distribution_auto_eau: settings.autoWaterEnabled,
				distribution_auto_croquettes: settings.autoFeedEnabled,
			};

			// Appel API pour envoyer les paramètres au backend
			const response = await fetch(`${url}api/update-params`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				console.log("Paramètres envoyés avec succès !");
				setOpenSnackbar(true); // Afficher le toast de confirmation
			} else {
				console.error("Erreur lors de l'envoi des paramètres.");
			}
		} catch (error) {
			console.error("Erreur réseau :", error);
		}
	};

	if (loading) {
		return <p>Chargement des données...</p>;
	}

	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: "#D7C4A3",
			}}>
			<Header />

			<Paper
				elevation={3}
				sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
				<Grid container spacing={3}>
					{/* Distribution Automatique de Nourriture */}
					<Grid item xs={12}>
						<Typography variant="h6">
							Distribution Automatique de Nourriture
						</Typography>
						<FormControlLabel
							control={
								<Switch
									checked={settings.autoFeedEnabled}
									onChange={() =>
										handleToggle("autoFeedEnabled")
									}
								/>
							}
							label="Activer la Distribution Automatique"
						/>
						{/* Champs de seuil affichés uniquement si autoFeedEnabled */}
						{settings.autoFeedEnabled && (
							<Box sx={{ marginTop: 2 }}>
								<Typography variant="subtitle1">
									Seuil de Nourriture (en grammes)
								</Typography>
								<TextField
									type="number"
									value={settings.feedThreshold}
									onChange={(e) =>
										handleInputChange(
											"feedThreshold",
											Number(e.target.value)
										)
									}
									sx={{ width: 150 }}
								/>
							</Box>
						)}
					</Grid>

					{/* Distribution Automatique d'Eau */}
					<Grid item xs={12}>
						<Typography variant="h6">
							Distribution Automatique d'Eau
						</Typography>
						<FormControlLabel
							control={
								<Switch
									checked={settings.autoWaterEnabled}
									onChange={() =>
										handleToggle("autoWaterEnabled")
									}
								/>
							}
							label="Activer la Distribution Automatique"
						/>
						{/* Champs de seuil affichés uniquement si autoWaterEnabled */}
						{settings.autoWaterEnabled && (
							<Box sx={{ marginTop: 2 }}>
								<Typography variant="subtitle1">
									Seuil d'Eau (en millilitres)
								</Typography>
								<TextField
									type="number"
									value={settings.waterThreshold}
									onChange={(e) =>
										handleInputChange(
											"waterThreshold",
											Number(e.target.value)
										)
									}
									sx={{ width: 150 }}
								/>
							</Box>
						)}
					</Grid>

					{/* Quantité de distribution d'eau et nourriture */}
					<Grid item xs={12}>
						<Typography variant="h6">
							Quantité de Distribution d'Eau et de Croquettes
						</Typography>
						<Box sx={{ marginTop: 2 }}>
							<Select
								value={settings.feedQuantity}
								onChange={(e: SelectChangeEvent<string>) =>
									handleInputChange(
										"feedQuantity",
										e.target.value
									)
								}
								sx={{ minWidth: 150 }}>
								<MenuItem value="Petite">Petite</MenuItem>
								<MenuItem value="Moyenne">Moyenne</MenuItem>
								<MenuItem value="Grande">Grande</MenuItem>
							</Select>
						</Box>
						<Box sx={{ marginTop: 2 }}>
							<Select
								value={settings.waterQuantity}
								onChange={(e: SelectChangeEvent<string>) =>
									handleInputChange(
										"waterQuantity",
										e.target.value
									)
								}
								sx={{ minWidth: 150 }}>
								<MenuItem value="Petite">Petite</MenuItem>
								<MenuItem value="Moyenne">Moyenne</MenuItem>
								<MenuItem value="Grande">Grande</MenuItem>
							</Select>
						</Box>
					</Grid>
					{/* Limite Quotidienne de Friandises */}
					<Grid item xs={12}>
						<Typography variant="h6">
							Limite Quotidienne de Friandises
						</Typography>
						<TextField
							type="number"
							value={settings.dailyTreatLimit}
							onChange={(e) =>
								handleInputChange(
									"dailyTreatLimit",
									Number(e.target.value)
								)
							}
							sx={{ width: 150 }}
							InputProps={{
								inputProps: { min: 1 }, // Limite minimale de 1
							}}
						/>
					</Grid>

					{/* Bouton Enregistrer */}
					<Grid item xs={12} textAlign="center">
						<Button
							variant="contained"
							color="primary"
							onClick={handleSave}
							disabled={!!error} // Désactiver si une erreur est présente
						>
							Enregistrer les Paramètres
						</Button>
					</Grid>
				</Grid>
			</Paper>

			{/* Message de confirmation */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}>
				<Alert
					onClose={() => setOpenSnackbar(false)}
					severity="success"
					sx={{ width: "100%" }}>
					Paramètres enregistrés avec succès !
				</Alert>
			</Snackbar>

			{/* Gestion des erreurs */}
			{error && (
				<Snackbar
					open={!!error}
					autoHideDuration={10000} // Affichage prolongé à 10 secondes
					onClose={() => setError(null)}>
					<Alert
						severity="error"
						onClose={() => setError(null)} // Permet à l'utilisateur de fermer l'erreur
						sx={{ width: "100%" }}>
						{error}
					</Alert>
				</Snackbar>
			)}
		</Box>
	);
};

export default SettingsPage;
