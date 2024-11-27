import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FoodHistory, Header, WaterHistory } from "../Containers";

const HistoriquePage: React.FC = () => {
	const [isWater, setIsWater] = useState(true);
	const navigate = useNavigate();
	return (
		<div className="h-full w-screen">
			<Header />
			<div className="h-36 w-full flex items-center justify-center">
				<Button
					onClick={() => setIsWater(true)}
					variant={isWater ? "contained" : "text"}>
					Eau
				</Button>
				<Button
					onClick={() => setIsWater(false)}
					variant={!isWater ? "contained" : "text"}>
					Nourriture
				</Button>
			</div>
			<div className="p-5 bg-bg">
				{isWater ? <WaterHistory /> : <FoodHistory />}
			</div>
		</div>
	);
};

export default HistoriquePage;
