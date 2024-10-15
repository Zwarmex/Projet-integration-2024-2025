import { Box } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HistoriquePage, HomePage, LoginPage } from "./Pages";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <HomePage />,
		},
		{
			path: "/sign_up",
			element: <LoginPage isSigningUp={true} />,
		},
		{ path: "/login", element: <LoginPage isSigningUp={false} /> },
		{ path: "/historique", element: <HistoriquePage /> },
	]);
	return (
		<Box className="h-screen bg-bg">
			<RouterProvider router={router} />
		</Box>
	);
};

export default App;
