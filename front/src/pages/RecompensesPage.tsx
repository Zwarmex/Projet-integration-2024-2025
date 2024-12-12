import {Header} from "../containers";
import React, { useEffect, useState } from "react";
import rewardData from "../Data/reward-data.json"; // Assurez-vous que le chemin est correct
import './RecompensesPage.css';


const RecompensesPage: React.FC = () => {
	const [rewardLogs, setRewardLogs] = useState<any[]>([]);
	useEffect(() => {
		// Charger les données du fichier JSON
		setRewardLogs(rewardData);
	}, []);
	
	return (
		<div className="h-screen w-screen">
			<Header />
			<div className="p-5 bg-bg">
				<div className="w-full flex flex-col items-center">
					<div className="flex flex-col sm:flex-row">
                        <table>
							<tr>
								<th>Heure</th>
								<th>Nombre</th>
								<th></th>
							</tr>
							{rewardLogs.reverse().map((val, i, arr) => {
								let sep = <></>;
								if (i > 0){
									const previous = arr[i - 1];
									if (previous.date != val.date){
										sep =
										<tr className="sep">
											<td></td><td>{val.date}</td>
										</tr>
									}
								}
								else{
									sep =
									<tr className="sep">
										<td></td><td>{val.date}</td>
									</tr>
								}
								if (val.event === "bouton_friandise_appuye"){
									return ( <> {sep}
									<tr style={{border: "1px solid"}}>
										<td>{val.heure}</td>
										<td>{val.compteur}</td>
										<td>Récompense ✅</td>
									</tr>
									</>
								)}
								return ( <> {sep}
									<tr style={{color: "#666666", border: "1px solid"}}>
										<td>{val.heure}</td>
										<td>{val.compteur}</td>
										<td>Limite atteinte ❌</td>
									</tr>
									</>
								)
								
							})}
                        </table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecompensesPage;
