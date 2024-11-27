import { Box, Button } from "@mui/material";
import React from "react";

const ActionContainer: React.FC = () => {
	return (
		<Box className="border-solid border-2 border-black sm:gap-0 gap-3 rounded-lg sm:w-1/2 p-3 flex flex-col justify-around">
			<Button
				variant="contained"
				sx={{
					backgroundColor: "var(--main)", // Utiliser la couleur de Tailwind
					color: "white",
				}}>
				Donner Nourriture
			</Button>
			<Button variant="contained">Donner Eau</Button>
			<Button
				variant="contained"
				style={{ backgroundColor: "red", color: "white" }}>
				Donner Friandise
			</Button>
		</Box>
	);
};

export default ActionContainer;
