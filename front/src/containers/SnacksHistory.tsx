import { Button } from "@mui/material";
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useUrl } from "../Context/UrlContext";

const SnacksHistory: React.FC = () => {
	const url = useUrl().url;

	return <div>SnacksHistory</div>;
};

export default SnacksHistory;
