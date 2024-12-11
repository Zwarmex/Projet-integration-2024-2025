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
}

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
}) => {
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
				<Button
					onClick={
						handlePrevious
					}>{`Précédent ${periodLabel}`}</Button>
				<span>{currentPeriod}</span>
				<Button onClick={handleNext}>{`Suivant ${periodLabel}`}</Button>
			</div>
		</div>
	);
};

export default ChartComponent;
