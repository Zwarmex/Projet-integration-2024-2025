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
import { useUrl } from "../Context/UrlContext";
import ChartComponent, {
	getWeek,
	getWeekRange,
	handleNextDay,
	handleNextMonth,
	handleNextWeek,
	handleNextYear,
	handlePreviousDay,
	handlePreviousMonth,
	handlePreviousWeek,
	handlePreviousYear,
} from "../components/ChartComponent";

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
	const [snacksLogs, setSnacksLogs] = useState<any[]>([]);
	const [snacksChartType, setSnacksChartType] = useState<string>("daily");
	const [currentDay, setCurrentDay] = useState(new Date());
	const [currentWeek, setCurrentWeek] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [currentYear, setCurrentYear] = useState(new Date());
	const [limiteFriandise, setLimiteFriandise] = useState<number>(0);
	const url = useUrl().url;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const snacksData = await fetchSnacksData();
				const limiteFriandiseData = await fetchSnacksLimite();

				if (snacksData.length === 0) {
					throw Error("No snacks data found");
				}
				setLimiteFriandise(limiteFriandiseData);
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
			console.log("Error fetching snacks data:", error);
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
				beginAtZero: true,
				ticks: {
					callback: function (value: any) {
						return Number(value).toFixed(0); // Enlever les valeurs à virgule
					},
				},
				min: 0,
				max: snacksChartType === "yearly" ? 200 : 25,
				stepSize: snacksChartType === "yearly" ? 10 : 1,
			},
		},
	});

	const getCurrentPeriod = (chartType: string) => {
		switch (chartType) {
			case "daily":
				return currentDay.toLocaleDateString("fr-FR", {
					weekday: "short",
					day: "2-digit",
					month: "short",
					year: "numeric",
				});
			case "weekly":
				return `Semaine ${getWeekRange(
					getWeek(currentWeek.toISOString()),
					currentWeek.getFullYear()
				)}`;
			case "monthly":
				return `${currentMonth.toLocaleString("default", {
					month: "long",
				})} ${currentMonth.getFullYear()}`;
			case "yearly":
				return currentYear.getFullYear().toString();
			default:
				return "";
		}
	};

	const handlePreviousPeriod = (chartType: string) => {
		switch (chartType) {
			case "daily":
				return () => handlePreviousDay(currentDay, setCurrentDay);
			case "weekly":
				return () => handlePreviousWeek(currentWeek, setCurrentWeek);
			case "monthly":
				return () => handlePreviousMonth(currentMonth, setCurrentMonth);
			case "yearly":
				return () => handlePreviousYear(currentYear, setCurrentYear);
			default:
				return () => {};
		}
	};

	const handleNextPeriod = (chartType: string) => {
		switch (chartType) {
			case "daily":
				return () => handleNextDay(currentDay, setCurrentDay);
			case "weekly":
				return () => handleNextWeek(currentWeek, setCurrentWeek);
			case "monthly":
				return () => handleNextMonth(currentMonth, setCurrentMonth);
			case "yearly":
				return () => handleNextYear(currentYear, setCurrentYear);
			default:
				return () => {};
		}
	};

	const getPeriodLabel = (chartType: string) => {
		switch (chartType) {
			case "daily":
				return "Jour";
			case "weekly":
				return "Semaine";
			case "monthly":
				return "Mois";
			case "yearly":
				return "Année";
			default:
				return "";
		}
	};

	const getSnacksChartData = () => {
		switch (snacksChartType) {
			case "daily":
				return {
					labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
					datasets: [
						{
							label: "Friandises",
							data: Array.from({ length: 24 }, (_, i) =>
								snacksLogs
									.filter(
										(log) =>
											new Date(
												log.date
											).toDateString() ===
												currentDay.toDateString() &&
											parseInt(
												log.heure.split(":")[0],
												10
											) === i
									)
									.reduce(
										(acc, log) => acc + log["quantité"],
										0
									)
							),
							borderColor: "rgba(255, 99, 132, 1)",
							backgroundColor: "rgba(255, 99, 132, 0.2)",
						},
						{
							label: "Limite",
							data: new Array(24).fill(limiteFriandise), // Exemple de limite journalière
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
							pointRadius: 0,
							fill: false,
							borderDash: [10, 5],
						},
					],
				};
			case "weekly":
				const startOfWeek = new Date(currentWeek);
				startOfWeek.setDate(
					startOfWeek.getDate() - startOfWeek.getDay() + 1
				); // Définir le lundi de la semaine actuelle

				return {
					labels: Array.from({ length: 7 }, (_, i) => {
						const day = new Date(startOfWeek);
						day.setDate(startOfWeek.getDate() + i);
						return day.toLocaleDateString("fr-FR", {
							weekday: "short",
							day: "2-digit",
							month: "short",
						});
					}),
					datasets: [
						{
							label: "Friandises",
							data: Array.from({ length: 7 }, (_, i) => {
								const day = new Date(startOfWeek);
								day.setDate(startOfWeek.getDate() + i);
								return snacksLogs
									.filter(
										(log) =>
											new Date(
												log.date
											).toDateString() ===
											day.toDateString()
									)
									.reduce(
										(acc, log) => acc + log["quantité"],
										0
									);
							}),
							borderColor: "rgba(255, 99, 132, 1)",
							backgroundColor: "rgba(255, 99, 132, 0.2)",
						},
						{
							label: "Limite",
							data: new Array(7).fill(limiteFriandise), // Exemple de limite hebdomadaire
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
							pointRadius: 0,
							fill: false,
							borderDash: [10, 5],
						},
					],
				};
			case "monthly":
				const daysInMonth = new Date(
					currentMonth.getFullYear(),
					currentMonth.getMonth() + 1,
					0
				).getDate();
				return {
					labels: Array.from(
						{ length: daysInMonth },
						(_, i) => `${i + 1}`
					),
					datasets: [
						{
							label: "Friandises",
							data: Array.from(
								{ length: daysInMonth },
								(_, i) => {
									const day = i + 1;
									return snacksLogs
										.filter(
											(log) =>
												new Date(log.date).getDate() ===
													day &&
												new Date(
													log.date
												).getMonth() ===
													currentMonth.getMonth() &&
												new Date(
													log.date
												).getFullYear() ===
													currentMonth.getFullYear()
										)
										.reduce(
											(acc, log) => acc + log["quantité"],
											0
										);
								}
							),
							borderColor: "rgba(255, 99, 132, 1)",
							backgroundColor: "rgba(255, 99, 132, 0.2)",
						},
						{
							label: "Limite",
							data: new Array(daysInMonth).fill(limiteFriandise), // Exemple de limite mensuelle
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
							pointRadius: 0,
							fill: false,
							borderDash: [10, 5],
						},
					],
				};
			case "yearly":
				return {
					labels: Array.from({ length: 12 }, (_, i) =>
						new Date(0, i).toLocaleString("fr-FR", {
							month: "short",
						})
					),
					datasets: [
						{
							label: "Friandises",
							data: Array.from({ length: 12 }, (_, i) => {
								return snacksLogs
									.filter(
										(log) =>
											new Date(log.date).getMonth() ===
												i &&
											new Date(log.date).getFullYear() ===
												currentYear.getFullYear()
									)
									.reduce(
										(acc, log) => acc + log["quantité"],
										0
									);
							}),
							borderColor: "rgba(255, 99, 132, 1)",
							backgroundColor: "rgba(255, 99, 132, 0.2)",
						},
						{
							label: "Limite",
							data: new Array(12).fill(limiteFriandise * 30), // Exemple de limite annuelle
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
							pointRadius: 0,
							fill: false,
							borderDash: [10, 5],
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
	const handleToday = () => {
		setCurrentDay(new Date());
	};

	return (
		<div>
			{/* Snacks */}
			<ChartComponent
				chartType={snacksChartType}
				setChartType={setSnacksChartType}
				data={getSnacksChartData()}
				options={chartOptions("Consommation Friandises")}
				logsLength={snacksLogs.length}
				currentPeriod={getCurrentPeriod(snacksChartType)}
				handlePrevious={handlePreviousPeriod(snacksChartType)}
				handleNext={handleNextPeriod(snacksChartType)}
				periodLabel={getPeriodLabel(snacksChartType)}
				handleToday={handleToday} // Ajoutez cette ligne
			/>
		</div>
	);
};

export default SnacksHistory;
