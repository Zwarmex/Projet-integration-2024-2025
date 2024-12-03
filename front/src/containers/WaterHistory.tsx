import { Button } from "@mui/material";
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
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import waterData from "../Data/water-data.json"; // Assurez-vous que le chemin est correct

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const WaterHistory: React.FC = () => {
	const [waterLogs, setWaterLogs] = useState<any[]>([]);
	const [chartType, setChartType] = useState<string>("daily");

	useEffect(() => {
		// Charger les données du fichier JSON
		console.log("Chargement des données du fichier JSON...");
		setWaterLogs(waterData);
	}, []);

	useEffect(() => {
		// Vérifiez que les données sont bien chargées
		console.log("Données chargées :", waterLogs);
	}, [waterLogs]);

	const getWeek = (dateString: string) => {
		const date = new Date(dateString);
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear =
			(date.getTime() - firstDayOfYear.getTime()) / 86400000;
		return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	};

	const getChartData = () => {
		if (chartType === "weekly") {
			// Regrouper les données par semaine
			const weeklyData = waterLogs.reduce((acc, log) => {
				const week = getWeek(log.date);
				if (!acc[week]) {
					acc[week] = 0;
				}
				acc[week] += log["quantité(mL)"];
				return acc;
			}, {});

			return {
				labels: Object.keys(weeklyData),
				datasets: [
					{
						label: "Eau (mL)",
						data: Object.values(weeklyData),
						borderColor: "rgba(54, 162, 235, 1)",
						backgroundColor: "rgba(54, 162, 235, 0.2)",
					},
				],
			};
		} else {
			// Utiliser les données journalières
			return {
				labels: waterLogs.map((log) => `${log.date} ${log.heure}`),
				datasets: [
					{
						label: "Eau (mL)",
						data: waterLogs.map((log) => log["quantité(mL)"]),
						borderColor: "rgba(54, 162, 235, 1)",
						backgroundColor: "rgba(54, 162, 235, 0.2)",
					},
				],
			};
		}
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Consommation d'Eau",
			},
		},
	};

	return (
		<div className="max-h-96 w-auto">
			<div>
				<Button
					onClick={() => setChartType("daily")}
					variant={chartType === "daily" ? "contained" : "text"}>
					Journalier
				</Button>
				<Button
					onClick={() => setChartType("weekly")}
					variant={chartType === "weekly" ? "contained" : "text"}>
					Hebdomadaire
				</Button>
			</div>
			{waterLogs.length > 0 ? (
				<Line data={getChartData()} options={chartOptions} />
			) : (
				<p>Chargement des données...</p>
			)}
		</div>
	);
};

export default WaterHistory;
