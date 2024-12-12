import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackArrow from "../Assets/Images/backArrow.svg";
import HistoriqueIcon from "../Assets/Images/historique.svg";
import FriandiseIcon from "../Assets/Images/friandises.svg";
import Logo from "../Assets/Images/Logo.svg";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<Box className="bg-main text-text flex flex-col h-auto p-3">
			<Box className="flex flex-col items-center content-center">
				<Box className="flex flex-row items-center content-center ">
					<Button
						className="cursor-pointer"
						onClick={() => {
							navigate("/");
						}}>
						<img src={Logo} alt="" className="sm:size-20 size-14" />
					</Button>
					<div className="text-2xl sm:text-4xl font-bold">
						SmartPaws
					</div>
				</Box>
				<Typography className="text-sm sm:text-base text-center">
					Nourrir, hydrater et surveiller la santé de vos animaux.
				</Typography>
			</Box>
			<Box className="relative bottom-0">
				{/* Afficher la flèche retour si on est sur /historique */}
				{location.pathname === "/historique" ? (
					<Button
						className="cursor-pointer"
						onClick={() => navigate(-1)} // Retour à la page précédente
					>
						<img
							src={BackArrow}
							alt="Icône de retour"
							className="w-6 h-6"
						/>
					</Button>
				) : (
					<Button
						className="cursor-pointer"
						onClick={() => navigate("/historique")}>
						<img
							src={HistoriqueIcon}
							alt="Icône représentant l'historique"
							className="w-6 h-6"
						/>
					</Button>
				)}
			</Box>
			<Box className="relative left-12 bottom-9">
				{/* Afficher la flèche retour si on est sur /historique */}
				{location.pathname === "/recompenses" ? (
					<Button
						className="cursor-pointer"
						onClick={() => navigate(-1)} // Retour à la page précédente
					>
						<img
							src={BackArrow}
							alt="Icône de retour"
							className="w-6 h-6"
						/>
					</Button>
				) : (
					<Button
						className="cursor-pointer"
						onClick={() => navigate("/recompenses")}>
						<img
							src={FriandiseIcon}
							alt="Icône représentant l'historique"
							className="w-6 h-6"
						/>
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default Header;
