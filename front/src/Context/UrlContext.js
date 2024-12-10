import { createContext, useContext, useState } from "react";

const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
	const [url, setUrl] = useState("http://localhost:5050"); // Remplacez par votre URL par défaut.

	return (
		<UrlContext.Provider value={{ url, setUrl }}>
			{children}
		</UrlContext.Provider>
	);
};

export const useUrl = () => {
	const context = useContext(UrlContext);
	if (!context) {
		throw new Error("useUrl doit être utilisé dans un UrlProvider");
	}
	return context;
};
