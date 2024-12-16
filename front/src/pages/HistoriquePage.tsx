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
					<div className="hidden sm:flex flex-col md:flex-row">
						<FoodHistory />
						<WaterHistory />
					</div>
					<div className="hidden sm:block">
						<SnacksHistory />
					</div>
					<div className="block sm:hidden">
						<p>Veuillez retourner votre téléphone</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HistoriquePage;
