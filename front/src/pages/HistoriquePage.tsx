import { Header, SnacksHistory, WaterAndFoodHistory } from "../containers";

const HistoriquePage: React.FC = () => {
	return (
		<div className="h-full w-screen overflow-y-scroll">
			<Header />
			<div className="p-5 bg-bg">
				<WaterAndFoodHistory />
				<SnacksHistory />
			</div>
		</div>
	);
};

export default HistoriquePage;
