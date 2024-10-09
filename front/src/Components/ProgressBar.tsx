import { Box } from '@mui/material';
import React from 'react';

interface ProgressBarProps {
	progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
	return (
		<Box className='relative w-full h-2'>
			<Box className='absolute w-full h-2 rounded-full bg-text'></Box>
			<Box
				className='absolute h-2 rounded-full bg-main'
				style={{ width: `${progress}%` }}></Box>
		</Box>
	);
};

export default ProgressBar;
