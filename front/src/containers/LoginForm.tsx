import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	Divider,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoGoogle from '../Assets/Images/google.svg';

type LoginFormProps = {
	isSigningUp: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({ isSigningUp }) => {
	const [name, setName] = useState<string>('');
	const [nameError, setNameError] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [emailError, setEmailError] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordError, setPasswordError] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const [passwordConfirmError, setPasswordConfirmError] =
		useState<string>('');
	const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);

	const navigate = useNavigate();

	const handleSubmitForm = () => {
		navigate('/');
	};

	const handleSubmitGoogle = () => {
		navigate('/');
	};
	console.log(name, password, email, passwordConfirm);

	return (
		<Box className='h-screen flex items-center content-center'>
			<Box className='border rounded border-black p-6 space-y-5'>
				{isSigningUp ? (
					<TextField
						className='w-full'
						id='name'
						label='Nom'
						variant='outlined'
						type='text'
						error={!!nameError}
						helperText={nameError}
						onChange={(e) => {
							setName(e.target.value);
							setNameError('');
						}}
						required
					/>
				) : null}
				<TextField
					className='w-full'
					id='email'
					label='Email'
					variant='outlined'
					type='email'
					error={!!emailError}
					helperText={emailError}
					onChange={(e) => {
						setEmail(e.target.value);
						setEmailError('');
					}}
					required
				/>
				<TextField
					className='w-full'
					id='password'
					label='Mot de passe'
					variant='outlined'
					type={isPasswordShowing ? 'text' : 'password'}
					error={!!passwordError}
					helperText={passwordError}
					onChange={(e) => {
						setPassword(e.target.value);
						setPasswordError('');
					}}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										onClick={() => {
											setIsPasswordShowing(
												!isPasswordShowing
											);
										}}
										edge='end'>
										{isPasswordShowing ? (
											<Visibility />
										) : (
											<VisibilityOff />
										)}
									</IconButton>
								</InputAdornment>
							),
						},
					}}
					required
				/>
				{isSigningUp ? (
					<TextField
						className='w-full'
						id='password_confirmed'
						label='Confirmez mot de passe'
						variant='outlined'
						type={isPasswordShowing ? 'text' : 'password'}
						error={!!passwordConfirmError}
						helperText={passwordConfirmError}
						onChange={(e) => {
							setPasswordConfirm(e.target.value);
							setPasswordConfirmError('');
						}}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											onClick={() => {
												setIsPasswordShowing(
													!isPasswordShowing
												);
											}}
											edge='end'>
											{isPasswordShowing ? (
												<Visibility />
											) : (
												<VisibilityOff />
											)}
										</IconButton>
									</InputAdornment>
								),
							},
						}}
						required
					/>
				) : null}
				<Box className='w-full flex place-content-between'>
					<Link to={isSigningUp ? '/login' : '/sign_up'}>
						<Typography className='underline text-blue-400 cursor-pointer'>
							{isSigningUp
								? 'Déjà inscrit ?'
								: "Par ici l'inscription"}
						</Typography>
					</Link>
					<Button
						variant='contained'
						onClick={() => {
							handleSubmitForm();
						}}>
						<Typography>
							{isSigningUp ? "S'inscrire" : 'Se connecter'}
						</Typography>
					</Button>
				</Box>
				<Divider />
				<Box className='grid place-content-center'>
					<Button
						variant='contained'
						className='w-20 h-20 !bg-white !p-0'
						onClick={() => {
							handleSubmitGoogle();
						}}>
						<img
							className='w-full h-full'
							src={logoGoogle}
							alt='Logo Google'
						/>
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default LoginForm;
