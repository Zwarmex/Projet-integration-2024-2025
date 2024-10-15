import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "../Assets/Images/settings.svg";
import { Header, Level, NotificationsContainer } from "../Containers";

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	return (
		<Box className="h-auto bg-bg flex flex-col gap-9">
			<Header />
			<Box>
				<Box className="pb-12 p-3">
					<Button
						className="cursor-pointer"
						onClick={() => {
							navigate("/settings");
						}}>
						<img
							src={SettingsIcon}
							className="size-12"
							alt="Icon paramètre"
						/>
					</Button>

					<Level label="Eau" progress={75} />
					{/* Pour changer la valeur de la bar il faut mettre le nombre en pourcentage */}
					<Level label="Nourriture" progress={50} />
					{/* Pour changer la valeur de la bar il faut mettre le nombre en pourcentage */}
				</Box>
				<Box className="flex w-full p-3">
					<Box className="w-1/2">
						A voir quel container mettre ici
					</Box>
					<NotificationsContainer />
				</Box>
			</Box>
		</Box>
	);
};

export default HomePage;
