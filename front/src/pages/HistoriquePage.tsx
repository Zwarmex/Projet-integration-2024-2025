import { Header, WaterAndFoodHistory } from "../Containers";

const HistoriquePage: React.FC = () => {
	return (
		<div className="h-full w-screen">
			<Header />
			<div className="p-5 bg-bg">
				{/* {isWater ? <WaterHistory /> : <FoodHistory />} */}
				<WaterAndFoodHistory />
			</div>
		</div>
	);
};

export default HistoriquePage;
