import { Box } from '@mui/material';
import SettingsIcon from '../Assets/Images/settings.svg';
import { Header, Level, NotificationsContainer } from '../Containers';

const HomePage: React.FC = () => {
	return (
		<Box className='h-screen bg-bg flex flex-col gap-16'>
			<Header />
			<Box className='p-3'>
				<Box className='pb-12'>
					<img src={SettingsIcon} className='size-12' alt='' />

					<Level label='Eau' progress={75} />
					{/* Pour changer la valeur de la bar il faut mettre le nombre en pourcentage */}
					<Level label='Nourriture' progress={50} />
					{/* Pour changer la valeur de la bar il faut mettre le nombre en pourcentage */}
				</Box>
				<Box className='flex w-full'>
					<Box className='w-1/2'>
						{' '}
						A voir quel container mettre ici
					</Box>
					<NotificationsContainer />
				</Box>
			</Box>
		</Box>
	);
};

export default HomePage;
