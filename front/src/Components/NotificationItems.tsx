import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning"; // Icone Material-UI
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";

// Conteneur stylé
const NotificationContainer = styled(Box)(({ theme }) => ({
	backgroundColor: "#FAE3CB",
	border: "2px solid #A0522D",
	color: "#3D3D3D",
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(2),
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
	marginBottom: theme.spacing(2),
}));

// Notification améliorée
const NotificationItems: React.FC<{ message: string; onAddFood: () => void }> = ({
	message,
	onAddFood,
}) => {
	return (
		<NotificationContainer>
			<WarningIcon fontSize="large" style={{ marginRight: "16px" }} />
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h6" sx={{ fontWeight: "bold" }}>
					Alerte de Niveau Bas
				</Typography>
				<Typography variant="body1">{message}</Typography>
			</Box>
			<Button
				variant="contained"
				color="primary"
				startIcon={<AddCircleOutlineIcon />}
				onClick={onAddFood} // Action pour ajouter de la nourriture
			>
				Remplir Nourriture
			</Button>
		</NotificationContainer>
	);
};

const Distributeur = () => {
	const [niveaux, setNiveaux] = useState({ croquettes: 0 });
	const [showNotification, setShowNotification] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLevels = async () => {
			try {
				const response = await fetch("http://localhost:5050/api/niveau"); // Appel API backend
				if (!response.ok) {
					throw new Error("Erreur lors de la récupération des données");
				}
				const data = await response.json();
				setNiveaux(data); // Met à jour l'état avec les données récupérées

				// Vérifie si le niveau de croquettes est en dessous de 20%
				if (data.croquettes < 20) {
					setShowNotification(true); // Affiche la notification
				} else {
					setShowNotification(false); // Masque la notification
				}
			} catch (error) {
				console.error("Erreur :", error);
			}
		};

		fetchLevels(); // Charger les données au montage
		const interval = setInterval(fetchLevels, 5000); // Actualiser toutes les 5 secondes
		return () => clearInterval(interval); // Nettoyer l'intervalle à la destruction du composant
	}, []);

	// Fonction pour simuler l'ajout de nourriture
	const handleAddFood = () => {
		setNiveaux((prevNiveaux) => ({
			...prevNiveaux,
			croquettes: 100, // Remet le niveau à 100% par exemple
		}));
		setShowNotification(false); // Masque la notification après ajout
	};

	return (
		<Box>
			{showNotification && (
				<NotificationItems
					message="Le niveau de croquettes est en dessous de 20% !"
					onAddFood={handleAddFood}
				/>
			)}
			{/* Autres éléments du distributeur */}
			
		</Box>
	);
};

export default Distributeur;
