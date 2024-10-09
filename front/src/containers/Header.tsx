import { Box, Typography } from '@mui/material';
import React from 'react';
import historique from '../Assets/Images/historique.svg';

const Header: React.FC = () => {
	return (
		<Box className='bg-main text-text flex flex-col h-60 p-3'>
			<Box className='flex flex-col items-center content-center'>
				<Typography variant='h1'>SmartPaws</Typography>
				<Typography>
					Nourrir, hydrater et surveiller la santé de vos animaux.
				</Typography>
			</Box>
			<Box className='relative bottom-0'>
				<img src={historique} alt="Icone représentant l'historique" />
			</Box>
		</Box>
	);
};

export default Header;
