import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import HistoriqueIcon from "../Assets/Images/historique.svg";
import Logo from "../Assets/Images/Logo.svg";

const Header: React.FC = () => {
	const navigate = useNavigate();
	return (
		<Box className="bg-main text-text flex flex-col h-auto p-3">
			<Box className="flex flex-col items-center content-center">
				<Button
					className="cursor-pointer"
					onClick={() => {
						navigate("/");
					}}>
					<img src={Logo} alt="" className="size-24" />
				</Button>
				<Typography variant="h1">SmartPaws</Typography>
				<Typography>
					Nourrir, hydrater et surveiller la santé de vos animaux.
				</Typography>
			</Box>
			<Box className="relative bottom-0">
				<Button
					className="cursor-pointer"
					onClick={() => navigate("/historique")}>
					<img
						src={HistoriqueIcon}
						alt="Icone représentant l'historique"
					/>
				</Button>
			</Box>
		</Box>
	);
};

export default Header;
