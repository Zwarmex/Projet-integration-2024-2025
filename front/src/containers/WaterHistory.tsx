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
import ChartComponent from "../Components/chartComponent";
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
	const [waterChartType, setWaterChartType] = useState<string>("daily");
	const [currentDay, setCurrentDay] = useState(new Date());
	const [currentWeek, setCurrentWeek] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [currentYear, setCurrentYear] = useState(new Date());
	const url = useUrl().url;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const waterData = await fetchWaterData();

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

	const fetchWaterData = async () => {
		try {
			const rawWater = await fetch(`${url}api/historique/eau`);
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
						{
							label: "Normal (200mL)",
							data: new Array(waterLogs.length).fill(200),
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
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
						{
							label: "Normal (1400mL)",
							data: new Array(
								Object.keys(weeklyData).length
							).fill(1400),
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
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
						{
							label: "Normal (5600mL)",
							data: new Array(
								Object.keys(monthlyData).length
							).fill(5600),
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
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
						{
							label: "Normal (67200mL)",
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
	});

	const getCurrentPeriod = (chartType: string) => {
		switch (chartType) {
			case "daily":
				return currentDay.toDateString();
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

	const handlePreviousMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
		);
	};

	const handleNextWeek = () => {
		setCurrentWeek(
			new Date(currentWeek.setDate(currentWeek.getDate() + 7))
		);
	};

	const handlePreviousYear = () => {
		setCurrentYear(
			new Date(currentYear.setFullYear(currentYear.getFullYear() - 1))
		);
	};

	const handleNextMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
		);
	};

	const handleNextYear = () => {
		setCurrentYear(
			new Date(currentYear.setFullYear(currentYear.getFullYear() + 1))
		);
	};

	const handlePreviousPeriod = (chartType: string) => {
		switch (chartType) {
			case "daily":
				return handlePreviousDay;
			case "weekly":
				return handlePreviousWeek;
			case "monthly":
				return handlePreviousMonth;
			case "yearly":
				return handlePreviousYear;
			default:
				return () => {};
		}
	};

	const handleNextPeriod = (chartType: string) => {
		switch (chartType) {
			case "daily":
				return handleNextDay;
			case "weekly":
				return handleNextWeek;
			case "monthly":
				return handleNextMonth;
			case "yearly":
				return handleNextYear;
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

	return (
		<div className="flex justify-around sm:flex-row flex-col">
			{/* Water */}
			<ChartComponent
				chartType={waterChartType}
				setChartType={setWaterChartType}
				data={getWaterChartData()}
				options={chartOptions("Consommation Eau")}
				logsLength={waterLogs.length}
				currentPeriod={getCurrentPeriod(waterChartType)}
				handlePrevious={handlePreviousPeriod(waterChartType)}
				handleNext={handleNextPeriod(waterChartType)}
				periodLabel={getPeriodLabel(waterChartType)}
			/>
		</div>
	);
};

export default WaterHistory;
