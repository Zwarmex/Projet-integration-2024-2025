import {
	FoodHistory,
	Header,
	SnacksHistory,
	WaterHistory,
} from "../containers";

const HistoriquePage: React.FC = () => {
	return (
		<div className="h-screen w-screen">
			<Header />
			<div className="p-5 bg-bg">
				<div className="w-full flex flex-col items-center">
					<div className="flex flex-col sm:flex-row">
						<FoodHistory />
						<WaterHistory />
					</div>
					<SnacksHistory />
				</div>
			</div>
		</div>
	);
};

export default HistoriquePage;
