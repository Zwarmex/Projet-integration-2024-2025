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

const SnacksHistory: React.FC = () => {
	const url = useUrl().url;
	const [snacksChartType, setSnacksChartType] = useState<string>("daily");
	const [currentDay, setCurrentDay] = useState(new Date());
	const [currentWeek, setCurrentWeek] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [currentYear, setCurrentYear] = useState(new Date());
	const [snacksLogs, setSnacksLogs] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const snacksData = await fetchSnacksData();
				if (snacksData.length === 0) {
					throw Error("No food data found");
				}
				setSnacksLogs(snacksData);
			} catch (error) {
				console.log("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const fetchSnacksData = async () => {
		try {
			const rawSnacks = await fetch(`${url}api/historique/friandises`);
			const snacks = await rawSnacks.json();
			return snacks;
		} catch (error) {
			console.log("Error fetching food data:", error);
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
		switch (snacksChartType) {
			case "daily":
				return {
					labels: snacksLogs.map((log) =>
						formatDate(log.date, log.heure)
					),
					datasets: [
						{
							label: "Nourriture (g)",
							data: snacksLogs.map((log) => log["quantité(g)"]),
							borderColor: "rgba(255, 99, 132, 1)",
							backgroundColor: "rgba(255, 99, 132, 0.2)",
						},
						{
							label: "Normal (5)",
							data: new Array(snacksLogs.length).fill(5),
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
						},
					],
				};
			case "weekly":
				const weeklyData = snacksLogs.reduce((acc, log) => {
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
						{
							label: "Normal (1400g)",
							data: new Array(
								Object.keys(weeklyData).length
							).fill(1400),
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
						},
					],
				};
			case "monthly":
				const monthlyData = snacksLogs.reduce((acc, log) => {
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
						{
							label: "Normal (5600g)",
							data: new Array(
								Object.keys(monthlyData).length
							).fill(5600),
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
						},
					],
				};
			case "yearly":
				const yearlyData = snacksLogs.reduce((acc, log) => {
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
						{
							label: "Normal (67200g)",
							data: new Array(
								Object.keys(yearlyData).length
							).fill(67200),
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
						},
					],
				};
			default:
				return {
					labels: [],
					datasets: [],
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
		scales: {
			y: {
				ticks: {
					// Retirer les nombres à virgules
					callback: function (tickValue: string | number) {
						return Number.isInteger(tickValue) ? tickValue : null;
					},
				},
				// Changer l'échelle du graph
				suggestedMin: 0, // Valeur minimale
				suggestedMax: 10, // Valeur maximale (ajustez selon vos besoins)
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
						onClick={() => setSnacksChartType("daily")}
						variant={
							snacksChartType === "daily" ? "contained" : "text"
						}>
						Journalier
					</Button>
					<Button
						onClick={() => setSnacksChartType("weekly")}
						variant={
							snacksChartType === "weekly" ? "contained" : "text"
						}>
						Hebdomadaire
					</Button>
					<Button
						onClick={() => setSnacksChartType("monthly")}
						variant={
							snacksChartType === "monthly" ? "contained" : "text"
						}>
						Mensuel
					</Button>
					<Button
						onClick={() => setSnacksChartType("yearly")}
						variant={
							snacksChartType === "yearly" ? "contained" : "text"
						}>
						Annuel
					</Button>
				</div>
				{snacksLogs.length > 0 ? (
					<Line
						data={getFoodChartData()}
						options={chartOptions("Consommation Nourriture")}
					/>
				) : (
					<p>Chargement des données...</p>
				)}
				{snacksChartType === "daily" && (
					<div>
						<Button onClick={handlePreviousDay}>
							Jour Précédent
						</Button>
						<span>{currentDay.toDateString()}</span>
						<Button onClick={handleNextDay}>Jour Suivant</Button>
					</div>
				)}
				{snacksChartType === "weekly" && (
					<div>
						<Button onClick={handlePreviousWeek}>
							Semaine Précédente
						</Button>
						<span>
							Semaine{" "}
							{getWeekRange(
								getWeek(currentWeek.toISOString()),
								currentWeek.getFullYear()
							)}
						</span>
						<Button onClick={handleNextWeek}>
							Semaine Suivante
						</Button>
					</div>
				)}
				{snacksChartType === "monthly" && (
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
				{snacksChartType === "yearly" && (
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

export default SnacksHistory;
