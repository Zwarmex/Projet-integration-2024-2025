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

	useEffect(() => {
		// Charger les données du fichier JSON
		console.log("Chargement des données du fichier JSON...");
		setWaterLogs(waterData);
	}, []);

	useEffect(() => {
		// Vérifiez que les données sont bien chargées
		console.log("Données chargées :", waterLogs);
	}, [waterLogs]);

	const chartData = {
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
		<div>
			{waterLogs.length > 0 ? (
				<Line data={chartData} options={chartOptions} />
			) : (
				<p>Chargement des données...</p>
			)}
		</div>
	);
};

export default WaterHistory;
