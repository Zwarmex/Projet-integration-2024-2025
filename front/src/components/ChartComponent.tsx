import ArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Button } from "@mui/material";
import React from "react";
import { Line } from "react-chartjs-2";

interface ChartComponentProps {
	chartType: string;
	setChartType: (type: string) => void;
	data: any;
	options: any;
	logsLength: number;
	currentPeriod: string;
	handlePrevious: () => void;
	handleNext: () => void;
	periodLabel: string;
	handleToday: () => void;
}

export const getWeek = (dateString: string) => {
	const date = new Date(dateString);
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear =
		(date.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getWeekRange = (week: number, year: number) => {
	const firstDayOfYear = new Date(year, 0, 1);
	const days = (week - 1) * 7;
	const startDate = new Date(
		firstDayOfYear.setDate(firstDayOfYear.getDate() + days)
	);
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6);
	const format = (date: Date) =>
		`${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, "0")}`;
	return `${format(startDate)} au ${format(endDate)}`;
};

export const formatDate = (dateString: string, timeString: string) => {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	return `${day}-${month}, ${timeString}`;
};

export const handlePreviousDay = (
	currentDay: Date,
	setCurrentDay: (date: Date) => void
) => {
	setCurrentDay(new Date(currentDay.setDate(currentDay.getDate() - 1)));
};

export const handleNextDay = (
	currentDay: Date,
	setCurrentDay: (date: Date) => void
) => {
	setCurrentDay(new Date(currentDay.setDate(currentDay.getDate() + 1)));
};

export const handlePreviousWeek = (
	currentWeek: Date,
	setCurrentWeek: (date: Date) => void
) => {
	setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
};

export const handleNextWeek = (
	currentWeek: Date,
	setCurrentWeek: (date: Date) => void
) => {
	setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
};

export const handlePreviousMonth = (
	currentMonth: Date,
	setCurrentMonth: (date: Date) => void
) => {
	setCurrentMonth(
		new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
	);
};

export const handleNextMonth = (
	currentMonth: Date,
	setCurrentMonth: (date: Date) => void
) => {
	setCurrentMonth(
		new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
	);
};

export const handlePreviousYear = (
	currentYear: Date,
	setCurrentYear: (date: Date) => void
) => {
	setCurrentYear(
		new Date(currentYear.setFullYear(currentYear.getFullYear() - 1))
	);
};

export const handleNextYear = (
	currentYear: Date,
	setCurrentYear: (date: Date) => void
) => {
	setCurrentYear(
		new Date(currentYear.setFullYear(currentYear.getFullYear() + 1))
	);
};

const ChartComponent: React.FC<ChartComponentProps> = ({
	chartType,
	setChartType,
	data,
	options,
	logsLength,
	currentPeriod,
	handlePrevious,
	handleNext,
	periodLabel,
	handleToday,
}) => {
	return (
		<div className="p-10">
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
				<Button
					onClick={() => setChartType("monthly")}
					variant={chartType === "monthly" ? "contained" : "text"}>
					Mensuel
				</Button>
				<Button
					onClick={() => setChartType("yearly")}
					variant={chartType === "yearly" ? "contained" : "text"}>
					Annuel
				</Button>
			</div>
			{logsLength > 0 ? (
				<Line data={data} options={options} />
			) : (
				<p>Chargement des données...</p>
			)}
			<div>
				<Button onClick={handlePrevious}>
					<ArrowLeftIcon />
				</Button>
				<span>{currentPeriod}</span>
				<Button onClick={handleNext}>
					<ArrowRightIcon />
				</Button>
				{chartType === "daily" && (
					<Button onClick={handleToday}>Aujourd'hui</Button>
				)}
			</div>
		</div>
	);
};

export default ChartComponent;
