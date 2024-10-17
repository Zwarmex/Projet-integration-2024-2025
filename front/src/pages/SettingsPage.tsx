import {
	Box,
	Button,
	FormControlLabel,
	Grid,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Header } from "../Containers";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const SettingsPage: React.FC = () => {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [notificationLevel, setNotificationLevel] = useState("moyen");
	const [autoFeedEnabled, setAutoFeedEnabled] = useState(true);
	const [autoWaterEnabled, setAutoWaterEnabled] = useState(true);
	const [feedTime, setFeedTime] = useState("08:00");
	const [waterTime, setWaterTime] = useState("09:00");

	const [reportPeriod, setReportPeriod] = useState("journalier");
	const [feedingLogs, setFeedingLogs] = useState<any[]>([]);

	const handleNotificationToggle = () => {
		setNotificationsEnabled(!notificationsEnabled);
	};

	const handleNotificationLevelChange = (
		event: SelectChangeEvent<string>
	) => {
		setNotificationLevel(event.target.value as string);
	};

	const handleAutoFeedToggle = () => {
		setAutoFeedEnabled(!autoFeedEnabled);
	};

	const handleAutoWaterToggle = () => {
		setAutoWaterEnabled(!autoWaterEnabled);
	};

	const handleFeedTimeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setFeedTime(event.target.value);
	};

	const handleWaterTimeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setWaterTime(event.target.value);
	};

	const handleReportPeriodChange = (event: SelectChangeEvent<string>) => {
		setReportPeriod(event.target.value);
		simulateFeedingLogs(event.target.value);
	};

	const getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const simulateFeedingLogs = (period: string) => {
		let logs: { date: string; foodAmount: number; waterAmount: number }[] =
			[];
		const currentDate = new Date();

		if (period === "journalier") {
			logs = [
				{
					date: currentDate.toLocaleDateString(),
					foodAmount: getRandomNumber(80, 120), // Génère un nombre aléatoire entre 80g et 120g
					waterAmount: getRandomNumber(150, 250), // Génère un nombre aléatoire entre 150ml et 250ml
				},
			];
		} else if (period === "hebdomadaire") {
			logs = Array.from({ length: 7 }, (_, i) => ({
				date: new Date(
					currentDate.setDate(currentDate.getDate() - i)
				).toLocaleDateString(),
				foodAmount: getRandomNumber(80, 120), // Génère un nombre aléatoire entre 80g et 120g
				waterAmount: getRandomNumber(150, 250), // Génère un nombre aléatoire entre 150ml et 250ml
			}));
		} else if (period === "mensuel") {
			logs = Array.from({ length: 30 }, (_, i) => ({
				date: new Date(
					currentDate.setDate(currentDate.getDate() - i)
				).toLocaleDateString(),
				foodAmount: getRandomNumber(80, 120), // Génère un nombre aléatoire entre 80g et 120g
				waterAmount: getRandomNumber(150, 250), // Génère un nombre aléatoire entre 150ml et 250ml
			}));
		}

		setFeedingLogs(logs);
	};

	const chartData = {
		labels: feedingLogs.map((log) => log.date),
		datasets: [
			{
				label: "Nourriture (g)",
				data: feedingLogs.map((log) => log.foodAmount),
				borderColor: "rgba(255, 99, 132, 1)",
				backgroundColor: "rgba(255, 99, 132, 0.2)",
			},
			{
				label: "Eau (ml)",
				data: feedingLogs.map((log) => log.waterAmount),
				borderColor: "rgba(54, 162, 235, 1)",
				backgroundColor: "rgba(54, 162, 235, 0.2)",
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Consommation de Nourriture et d'Eau",
			},
		},
	};

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
					{/* Notifications */}
					<Grid item xs={12}>
						<Typography variant="h6">Notifications</Typography>
						<FormControlLabel
							control={
								<Switch
									checked={notificationsEnabled}
									onChange={handleNotificationToggle}
								/>
							}
							label="Activer les Notifications"
						/>
						{notificationsEnabled && (
							<Box sx={{ marginTop: 2 }}>
								<Typography>Niveau de Notifications</Typography>
								<Select
									value={notificationLevel}
									onChange={handleNotificationLevelChange}
									displayEmpty
									sx={{ minWidth: 200 }}>
									<MenuItem value="faible">Faible</MenuItem>
									<MenuItem value="moyen">Moyen</MenuItem>
									<MenuItem value="élevé">Élevé</MenuItem>
								</Select>
							</Box>
						)}
					</Grid>

					{/* Distribution Automatique de Nourriture */}
					<Grid item xs={12}>
						<Typography variant="h6">
							Distribution Automatique de Nourriture
						</Typography>
						<FormControlLabel
							control={
								<Switch
									checked={autoFeedEnabled}
									onChange={handleAutoFeedToggle}
								/>
							}
							label="Activer la Distribution Automatique"
						/>
						{autoFeedEnabled && (
							<Box sx={{ marginTop: 2 }}>
								<Typography>Heure de Distribution</Typography>
								<TextField
									type="time"
									value={feedTime}
									onChange={handleFeedTimeChange}
									sx={{ width: 150 }}
									InputLabelProps={{ shrink: true }}
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
									checked={autoWaterEnabled}
									onChange={handleAutoWaterToggle}
								/>
							}
							label="Activer la Distribution Automatique"
						/>
						{autoWaterEnabled && (
							<Box sx={{ marginTop: 2 }}>
								<Typography>Heure de Distribution</Typography>
								<TextField
									type="time"
									value={waterTime}
									onChange={handleWaterTimeChange}
									sx={{ width: 150 }}
									InputLabelProps={{ shrink: true }}
								/>
							</Box>
						)}
					</Grid>

					{/* Sélection de la période des relevés */}
					<Grid item xs={12}>
						<Typography variant="h6">
							Relevés des Habitudes Alimentaires
						</Typography>
						<Select
							value={reportPeriod}
							onChange={handleReportPeriodChange}
							sx={{ minWidth: 200 }}>
							<MenuItem value="journalier">Journalier</MenuItem>
							<MenuItem value="hebdomadaire">
								Hebdomadaire
							</MenuItem>
							<MenuItem value="mensuel">Mensuel</MenuItem>
						</Select>
					</Grid>

					{/* Tableau des relevés */}
					{feedingLogs.length > 0 && (
						<Grid item xs={12}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>
											Quantité de Nourriture
										</TableCell>
										<TableCell>Quantité d'Eau</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{feedingLogs.map((log, index) => (
										<TableRow key={index}>
											<TableCell>{log.date}</TableCell>
											<TableCell>
												{log.foodAmount} g
											</TableCell>
											<TableCell>
												{log.waterAmount} ml
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Grid>
					)}

					{/* Graphique */}
					<Grid item xs={12}>
						{feedingLogs.length > 0 && (
							<Line data={chartData} options={chartOptions} />
						)}
					</Grid>

					{/* Bouton Enregistrer */}
					<Grid item xs={12} textAlign="center">
						<Button variant="contained" color="primary">
							Enregistrer les Paramètres
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
};

export default SettingsPage;
