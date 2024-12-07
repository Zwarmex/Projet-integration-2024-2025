import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
	Paper,
	Grid,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm: React.FC<{ isSigningUp: boolean }> = ({ isSigningUp }) => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);

	const navigate = useNavigate();

	const handleSubmitForm = () => {
		navigate('/');
	};

	return (
		<Box
			sx={{
				
				backgroundColor: '#D7C4A3',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
				<Grid container spacing={3}>
					{/* Titre du formulaire */}
					<Grid item xs={12}>
						<Typography variant="h5" textAlign="center" fontWeight="bold">
							{isSigningUp ? "Créer un compte" : "Connexion"}
						</Typography>
					</Grid>

					{/* Champ Email */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							id="email"
							label="Email"
							variant="outlined"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Grid>

					{/* Champ Mot de passe */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							id="password"
							label="Mot de passe"
							variant="outlined"
							type={isPasswordShowing ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												setIsPasswordShowing(!isPasswordShowing)
											}
											edge="end">
											{isPasswordShowing ? (
												<Visibility />
											) : (
												<VisibilityOff />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
							required
						/>
					</Grid>

					{/* Lien et Bouton de soumission */}
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							onClick={handleSubmitForm}>
							{isSigningUp ? "S'inscrire" : 'Se connecter'}
						</Button>
					</Grid>

					{/* Lien vers la page d'inscription ou de connexion */}
					<Grid item xs={12} textAlign="center">
						<Link to={isSigningUp ? '/login' : '/sign_up'}>
							<Typography variant="body2" color="primary">
								{isSigningUp
									? 'Déjà inscrit ? Connexion'
									: "Pas encore inscrit ? Créer un compte"}
							</Typography>
						</Link>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
};

export default LoginForm;
