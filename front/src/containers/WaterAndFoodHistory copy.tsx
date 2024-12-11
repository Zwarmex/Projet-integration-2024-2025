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
import { useUrl } from "../Context/UrlContext";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const WaterAndFoodHistory: React.FC = () => {
	const [feedingLogs, setFeedingLogs] = useState<any[]>([]);
	const [waterLogs, setWaterLogs] = useState<any[]>([]);
	const [foodChartType, setFoodChartType] = useState<string>("daily");
	const [waterChartType, setWaterChartType] = useState<string>("daily");
	const [currentFoodWeek, setCurrentFoodWeek] = useState<number>(1);
	const [currentWaterWeek, setCurrentWaterWeek] = useState<number>(1);
	const url = useUrl().url;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const foodData = await fetchFoodData();
				const waterData = await fetchWaterData();
				if (foodData.length === 0) {
					throw Error("No food data found");
				}
				setFeedingLogs(foodData);
				if (waterData.length === 0) {
					throw Error("No water data found");
				}
				setWaterLogs(waterData);
			} catch (error) {
				console.log("Error fetching data:", error);
			}
		};
		console.log(url);
		fetchData();
	}, []);

	const fetchFoodData = async () => {
		try {
			const rawFood = await fetch(`${url}/api/historique/nourriture`);
			const food = await rawFood.json();
			return food;
		} catch (error) {
			console.log("Error fetching food data:", error);
			return [];
		}
	};
	const fetchWaterData = async () => {
		try {
			const rawWater = await fetch(`${url}/api/historique/eau`);
			const water = await rawWater.json();
			return water;
		} catch (error) {
			console.log("Error fetching water data:", error);
			return [];
		}
	};

	const getWeek = (dateString: string) => {
		const date = new Date(dateString);
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear =
			(date.getTime() - firstDayOfYear.getTime()) / 86400000;
		return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	};

	const getWeekRange = (week: number, year: number) => {
		const firstDayOfYear = new Date(year, 0, 1);
		const days = (week - 1) * 7;
		const startDate = new Date(
			firstDayOfYear.setDate(firstDayOfYear.getDate() + days)
		);
		const endDate = new Date(startDate);
		endDate.setDate(startDate.getDate() + 6);
		const format = (date: Date) =>
			`${date.getDate().toString().padStart(2, "0")}-${(
				date.getMonth() + 1
			)
				.toString()
				.padStart(2, "0")}`;
		return `${format(startDate)} au ${format(endDate)}`;
	};

	const formatDate = (dateString: string, timeString: string) => {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		return `${day}-${month}, ${timeString}`;
	};

	const getFoodChartData = () => {
		if (foodChartType === "weekly") {
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
				labels: Object.keys(weeklyData).map((week) =>
					getWeekRange(parseInt(week), new Date().getFullYear())
				),
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
				labels: feedingLogs.map((log) =>
					formatDate(log.date, log.heure)
				),
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

	const getWaterChartData = () => {
		if (waterChartType === "weekly") {
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
				labels: Object.keys(weeklyData).map((week) =>
					getWeekRange(parseInt(week), new Date().getFullYear())
				),
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
				labels: waterLogs.map((log) => formatDate(log.date, log.heure)),
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

	const chartOptions = (title: string) => ({
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: title,
			},
		},
	});

	const handlePreviousFoodWeek = () => {
		setCurrentFoodWeek((prevWeek) => Math.max(prevWeek - 1, 1));
	};

	const handleNextFoodWeek = () => {
		setCurrentFoodWeek((prevWeek) => prevWeek + 1);
	};

	const handlePreviousWaterWeek = () => {
		setCurrentWaterWeek((prevWeek) => Math.max(prevWeek - 1, 1));
	};

	const handleNextWaterWeek = () => {
		setCurrentWaterWeek((prevWeek) => prevWeek + 1);
	};

	return (
		<div className="flex justify-around sm:flex-row flex-col">
			{/* Food */}
			<div className="max-h-96 w-auto">
				<div>
					<Button
						onClick={() => setFoodChartType("daily")}
						variant={
							foodChartType === "daily" ? "contained" : "text"
						}>
						Journalier
					</Button>
					<Button
						onClick={() => setFoodChartType("weekly")}
						variant={
							foodChartType === "weekly" ? "contained" : "text"
						}>
						Hebdomadaire
					</Button>
				</div>
				{feedingLogs.length > 0 ? (
					<Line
						data={getFoodChartData()}
						options={chartOptions("Consommation Nourriture")}
					/>
				) : (
					<p>Chargement des données...</p>
				)}
				{foodChartType === "weekly" && (
					<div>
						<Button onClick={handlePreviousFoodWeek}>
							Semaine Précédente
						</Button>
						<span>
							Semaine{" "}
							{getWeekRange(
								currentFoodWeek,
								new Date().getFullYear()
							)}
						</span>
						<Button onClick={handleNextFoodWeek}>
							Semaine Suivante
						</Button>
					</div>
				)}
			</div>

			{/* Water */}
			<div className="max-h-96 w-auto">
				<div>
					<Button
						onClick={() => setWaterChartType("daily")}
						variant={
							waterChartType === "daily" ? "contained" : "text"
						}>
						Journalier
					</Button>
					<Button
						onClick={() => setWaterChartType("weekly")}
						variant={
							waterChartType === "weekly" ? "contained" : "text"
						}>
						Hebdomadaire
					</Button>
				</div>
				{waterLogs.length > 0 ? (
					<Line
						data={getWaterChartData()}
						options={chartOptions("Consommation Eau")}
					/>
				) : (
					<p>Chargement des données...</p>
				)}
				{waterChartType === "weekly" && (
					<div>
						<Button onClick={handlePreviousWaterWeek}>
							Semaine Précédente
						</Button>
						<span>
							Semaine{" "}
							{getWeekRange(
								currentWaterWeek,
								new Date().getFullYear()
							)}
						</span>
						<Button onClick={handleNextWaterWeek}>
							Semaine Suivante
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default WaterAndFoodHistory;
