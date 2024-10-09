import { Box, Typography } from '@mui/material';
import React from 'react';
import { ProgressBar } from '../Components';

interface LevelProps {
	label: string;
	progress: number;
}

const Level: React.FC<LevelProps> = ({ label, progress }) => {
	return (
		<Box className='p-3 flex flex-col gap-3'>
			<Box className='flex flex-row-reverse'>
				<Typography>{progress}%</Typography>
			</Box>
			<Box className='flex flex-col items-center gap-3'>
				<ProgressBar progress={progress} />
				<Typography>{label}</Typography>
			</Box>
		</Box>
	);
};

export default Level;
