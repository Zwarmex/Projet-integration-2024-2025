import { Box, Button } from "@mui/material";
import React from "react";

const ActionContainer: React.FC = () => {
	const distribuerCroquettes = async () => {
		try {
		  const response = await fetch(
			"http://localhost:5050/api/distribuer_croquettes"
		  );
		  const data = await response.json();
		  console.log(data.message); // Affiche la réponse dans la console
		} catch (error) {
		  console.error(
			"Erreur lors de l'appel à l'API distribuer_croquettes :",
			error
		  );
		}
	  };
	
	  const distribuerEau = async () => {
		try {
		  const response = await fetch("http://localhost:5050/api/distribuer_eau");
		  const data = await response.json();
		  console.log(data.message); // Affiche la réponse dans la console
		} catch (error) {
		  console.error("Erreur lors de l'appel à l'API distribuer_eau :", error);
		}
	  };
	
	  const distribuerFriandises = async () => {
		try {
		  const response = await fetch(
			"http://localhost:5050/api/distribuer_friandises"
		  );
		  const data = await response.json();
		  console.log(data.message); // Affiche la réponse dans la console
		} catch (error) {
		  console.error(
			"Erreur lors de l'appel à l'API distribuer_friandises :",
			error
		  );
		}
	  };
	return (
		<Box className="border-solid border-2 border-black sm:gap-0 gap-3 rounded-lg sm:w-1/2 p-3 flex flex-col justify-around">
			<Button
			onClick={distribuerCroquettes} 
				variant="contained"
				sx={{
					backgroundColor: "var(--main)", // Utiliser la couleur de Tailwind
					color: "white",
				}}>
				Donner Nourriture
			</Button>
			<Button
			onClick={distribuerEau}
			variant="contained">Donner Eau</Button>
			<Button
			onClick={distribuerFriandises} 
				variant="contained"
				style={{ backgroundColor: "red", color: "white" }}>
				Donner Friandise
			</Button>
		</Box>
	);
};

export default ActionContainer;
