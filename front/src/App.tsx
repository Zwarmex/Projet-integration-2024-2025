import { useState } from 'react';
import { HomePage, RegisterLoginPage } from './pages';

const App = () => {
    const [isConnected, setIsConnected] = useState(false);
    return <div>{isConnected ? <HomePage /> : <RegisterLoginPage />}</div>;
};

export default App;
