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

	useEffect(() => {
		// Charger les données du fichier JSON
		setFeedingLogs(foodData);
	}, []);

	const chartData = {
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
			{feedingLogs.length > 0 && (
				<Line data={chartData} options={chartOptions} />
			)}
		</div>
	);
};

export default FoodHistory;
