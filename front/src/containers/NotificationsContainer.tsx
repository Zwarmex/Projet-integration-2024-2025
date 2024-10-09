import { Box } from '@mui/material';
import React from 'react';
import { NotificationItems } from '../Components';

const NotificationsContainer: React.FC = () => {
	return (
		<Box className='border-solid border-2 border-black rounded-lg w-1/2 h-full p-3'>
			<NotificationItems />
			<NotificationItems />
			<NotificationItems />
		</Box>
	);
};

export default NotificationsContainer;
