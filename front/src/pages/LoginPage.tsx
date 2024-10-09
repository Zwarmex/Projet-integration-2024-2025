import { Box } from '@mui/material';
import { LoginForm } from '../Containers';

type LoginPageProps = {
	isSigningUp: boolean;
};

const LoginPage: React.FC<LoginPageProps> = ({ isSigningUp }) => {
	return (
		<Box className='h-full grid place-content-center'>
			<LoginForm isSigningUp={isSigningUp} />
		</Box>
	);
};

export default LoginPage;
