import { Button } from "@mui/material";
import React, { useState } from "react";
import { FoodHistory, Header, WaterHistory } from "../Containers";

const HistoriquePage: React.FC = () => {
	const [isWater, setIsWater] = useState(true);
	return (
		<div className="h-screen w-screen">
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
			<div className="p-3">
				{isWater ? <WaterHistory /> : <FoodHistory />}
			</div>
		</div>
	);
};

export default HistoriquePage;
