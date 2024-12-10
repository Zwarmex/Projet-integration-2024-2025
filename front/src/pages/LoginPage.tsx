import { Box } from "@mui/material";
import { LoginForm } from "../containers";
import { Header } from "../containers";

type LoginPageProps = {
  isSigningUp: boolean;
};

const LoginPage: React.FC<LoginPageProps> = ({ isSigningUp }) => {
  return (
    <Box className="min-h-screen flex flex-col">
      <Header />
      <Box className="flex-grow flex justify-center items-center">
        <LoginForm isSigningUp={isSigningUp} />
      </Box>
    </Box>
  );
};

export default LoginPage;
