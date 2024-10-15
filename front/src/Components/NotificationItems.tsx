import { Box, Button, Typography } from "@mui/material";

const NotificationItems = () => {
	return (
		<Box className="border-solid border-2 border-muted flex mb-2 rounded-lg p-2 content-between">
			<Box className="w-1/3 flex items-center">Icone</Box>
			<Box className="flex flex-col w-2/3">
				<Typography>Réussite / Echec / Notification</Typography>
				<Typography>Explication</Typography>
				<Button>Si action il y a</Button>
			</Box>
		</Box>
	);
};

export default NotificationItems;
