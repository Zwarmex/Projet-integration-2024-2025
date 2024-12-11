import {
	FoodHistory,
	Header,
	SnacksHistory,
	WaterHistory,
} from "../containers";

const HistoriquePage: React.FC = () => {
	return (
		<div className="h-full w-screen overflow-y-scroll">
			<Header />
			<div className="p-5 bg-bg">
				<div className="flex flex-col">
					<WaterHistory />
					<FoodHistory />
				</div>
				<SnacksHistory />
			</div>
		</div>
	);
};

export default HistoriquePage;
