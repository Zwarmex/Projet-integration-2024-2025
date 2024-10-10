import { Box, Typography } from '@mui/material';
import React from 'react';
import HistoriqueIcon from '../Assets/Images/historique.svg';
import Logo from '../Assets/Images/Logo.svg';

const Header: React.FC = () => {
	return (
		<Box className='bg-main text-text flex flex-col h-auto p-3'>
			<Box className='flex flex-col items-center content-center'>
				<img src={Logo} alt='' className='size-24' />
				<Typography variant='h1'>SmartPaws</Typography>
				<Typography>
					Nourrir, hydrater et surveiller la santé de vos animaux.
				</Typography>
			</Box>
			<Box className='relative bottom-0'>
				<img
					src={HistoriqueIcon}
					alt="Icone représentant l'historique"
				/>
			</Box>
		</Box>
	);
};

export default Header;
