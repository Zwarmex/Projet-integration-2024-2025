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
	const [currentDay, setCurrentDay] = useState(new Date());
	const [currentWeek, setCurrentWeek] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [currentYear, setCurrentYear] = useState(new Date());
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
		switch (foodChartType) {
			case "daily":
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
			case "weekly":
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
			case "monthly":
				const monthlyData = feedingLogs.reduce((acc, log) => {
					const month = new Date(log.date).getMonth();
					if (!acc[month]) {
						acc[month] = 0;
					}
					acc[month] += log["quantité(g)"];
					return acc;
				}, {});

				return {
					labels: Object.keys(monthlyData).map((month) =>
						new Date(0, parseInt(month)).toLocaleString("default", {
							month: "long",
						})
					),
					datasets: [
						{
							label: "Nourriture (g)",
							data: Object.values(monthlyData),
							borderColor: "rgba(255, 99, 132, 1)",
							backgroundColor: "rgba(255, 99, 132, 0.2)",
						},
					],
				};
			case "yearly":
				const yearlyData = feedingLogs.reduce((acc, log) => {
					const year = new Date(log.date).getFullYear();
					if (!acc[year]) {
						acc[year] = 0;
					}
					acc[year] += log["quantité(g)"];
					return acc;
				}, {});

				return {
					labels: Object.keys(yearlyData),
					datasets: [
						{
							label: "Nourriture (g)",
							data: Object.values(yearlyData),
							borderColor: "rgba(255, 99, 132, 1)",
							backgroundColor: "rgba(255, 99, 132, 0.2)",
						},
					],
				};
			default:
				return {};
		}
	};

	const getWaterChartData = () => {
		switch (waterChartType) {
			case "daily":
				return {
					labels: waterLogs.map((log) =>
						formatDate(log.date, log.heure)
					),
					datasets: [
						{
							label: "Eau (mL)",
							data: waterLogs.map((log) => log["quantité(mL)"]),
							borderColor: "rgba(54, 162, 235, 1)",
							backgroundColor: "rgba(54, 162, 235, 0.2)",
						},
					],
				};
			case "weekly":
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
			case "monthly":
				const monthlyData = waterLogs.reduce((acc, log) => {
					const month = new Date(log.date).getMonth();
					if (!acc[month]) {
						acc[month] = 0;
					}
					acc[month] += log["quantité(mL)"];
					return acc;
				}, {});

				return {
					labels: Object.keys(monthlyData).map((month) =>
						new Date(0, parseInt(month)).toLocaleString("default", {
							month: "long",
						})
					),
					datasets: [
						{
							label: "Eau (mL)",
							data: Object.values(monthlyData),
							borderColor: "rgba(54, 162, 235, 1)",
							backgroundColor: "rgba(54, 162, 235, 0.2)",
						},
					],
				};
			case "yearly":
				const yearlyData = waterLogs.reduce((acc, log) => {
					const year = new Date(log.date).getFullYear();
					if (!acc[year]) {
						acc[year] = 0;
					}
					acc[year] += log["quantité(mL)"];
					return acc;
				}, {});

				return {
					labels: Object.keys(yearlyData),
					datasets: [
						{
							label: "Eau (mL)",
							data: Object.values(yearlyData),
							borderColor: "rgba(54, 162, 235, 1)",
							backgroundColor: "rgba(54, 162, 235, 0.2)",
						},
					],
				};
			default:
				return {};
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

	const handlePreviousDay = () => {
		setCurrentDay(new Date(currentDay.setDate(currentDay.getDate() - 1)));
	};

	const handleNextDay = () => {
		setCurrentDay(new Date(currentDay.setDate(currentDay.getDate() + 1)));
	};

	const handlePreviousWeek = () => {
		setCurrentWeek(
			new Date(currentWeek.setDate(currentWeek.getDate() - 7))
		);
	};

	const handleNextWeek = () => {
		setCurrentWeek(
			new Date(currentWeek.setDate(currentWeek.getDate() + 7))
		);
	};

	const handlePreviousMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
		);
	};

	const handleNextMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
		);
	};

	const handlePreviousYear = () => {
		setCurrentYear(
			new Date(currentYear.setFullYear(currentYear.getFullYear() - 1))
		);
	};

	const handleNextYear = () => {
		setCurrentYear(
			new Date(currentYear.setFullYear(currentYear.getFullYear() + 1))
		);
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
					<Button
						onClick={() => setFoodChartType("monthly")}
						variant={
							foodChartType === "monthly" ? "contained" : "text"
						}>
						Mensuel
					</Button>
					<Button
						onClick={() => setFoodChartType("yearly")}
						variant={
							foodChartType === "yearly" ? "contained" : "text"
						}>
						Annuel
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
				{foodChartType === "daily" && (
					<div>
						<Button onClick={handlePreviousDay}>
							Jour Précédent
						</Button>
						<span>{currentDay.toDateString()}</span>
						<Button onClick={handleNextDay}>Jour Suivant</Button>
					</div>
				)}
				{foodChartType === "weekly" && (
					<div>
						<Button onClick={handlePreviousWeek}>
							Semaine Précédente
						</Button>
						<span>
							Semaine{" "}
							{getWeekRange(
								currentWeek,
								new Date().getFullYear()
							)}
						</span>
						<Button onClick={handleNextWeek}>
							Semaine Suivante
						</Button>
					</div>
				)}
				{foodChartType === "monthly" && (
					<div>
						<Button onClick={handlePreviousMonth}>
							Mois Précédent
						</Button>
						<span>
							{currentMonth.toLocaleString("default", {
								month: "long",
							})}{" "}
							{currentMonth.getFullYear()}
						</span>
						<Button onClick={handleNextMonth}>Mois Suivant</Button>
					</div>
				)}
				{foodChartType === "yearly" && (
					<div>
						<Button onClick={handlePreviousYear}>
							Année Précédente
						</Button>
						<span>{currentYear.getFullYear()}</span>
						<Button onClick={handleNextYear}>Année Suivante</Button>
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
					<Button
						onClick={() => setWaterChartType("monthly")}
						variant={
							waterChartType === "monthly" ? "contained" : "text"
						}>
						Mensuel
					</Button>
					<Button
						onClick={() => setWaterChartType("yearly")}
						variant={
							waterChartType === "yearly" ? "contained" : "text"
						}>
						Annuel
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
				{waterChartType === "daily" && (
					<div>
						<Button onClick={handlePreviousDay}>
							Jour Précédent
						</Button>
						<span>{currentDay.toDateString()}</span>
						<Button onClick={handleNextDay}>Jour Suivant</Button>
					</div>
				)}
				{waterChartType === "weekly" && (
					<div>
						<Button onClick={handlePreviousWeek}>
							Semaine Précédente
						</Button>
						<span>
							Semaine{" "}
							{getWeekRange(
								currentWeek,
								new Date().getFullYear()
							)}
						</span>
						<Button onClick={handleNextWeek}>
							Semaine Suivante
						</Button>
					</div>
				)}
				{waterChartType === "monthly" && (
					<div>
						<Button onClick={handlePreviousMonth}>
							Mois Précédent
						</Button>
						<span>
							{currentMonth.toLocaleString("default", {
								month: "long",
							})}{" "}
							{currentMonth.getFullYear()}
						</span>
						<Button onClick={handleNextMonth}>Mois Suivant</Button>
					</div>
				)}
				{waterChartType === "yearly" && (
					<div>
						<Button onClick={handlePreviousYear}>
							Année Précédente
						</Button>
						<span>{currentYear.getFullYear()}</span>
						<Button onClick={handleNextYear}>Année Suivante</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default WaterAndFoodHistory;
