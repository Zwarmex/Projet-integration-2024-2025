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
import foodData from "../Data/food-data.json"; // Assurez-vous que le chemin est correct

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const FoodHistory: React.FC = () => {
	const [feedingLogs, setFeedingLogs] = useState<any[]>([]);
	const [chartType, setChartType] = useState<string>("daily");

	useEffect(() => {
		// Charger les données du fichier JSON
		setFeedingLogs(foodData);
	}, []);

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
			const weeklyData = feedingLogs.reduce((acc, log) => {
				const week = getWeek(log.date);
				if (!acc[week]) {
					acc[week] = 0;
				}
				acc[week] += log["quantité(g)"];
				return acc;
			}, {});

			return {
				labels: Object.keys(weeklyData),
				datasets: [
					{
						label: "Nourriture (g)",
						data: Object.values(weeklyData),
						borderColor: "rgba(255, 99, 132, 1)",
						backgroundColor: "rgba(255, 99, 132, 0.2)",
					},
				],
			};
		} else {
			// Utiliser les données journalières
			return {
				labels: feedingLogs.map((log) => `${log.date} ${log.heure}`),
				datasets: [
					{
						label: "Nourriture (g)",
						data: feedingLogs.map((log) => log["quantité(g)"]),
						borderColor: "rgba(255, 99, 132, 1)",
						backgroundColor: "rgba(255, 99, 132, 0.2)",
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
				text: "Consommation de Nourriture",
			},
		},
	};

	return (
		<div>
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
			{feedingLogs.length > 0 ? (
				<Line data={getChartData()} options={chartOptions} />
			) : (
				<p>Chargement des données...</p>
			)}
		</div>
	);
};

export default FoodHistory;
