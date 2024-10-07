import { useState } from 'react';
import { LoginForm, RegisterForm } from '../containers';

const RegisterLoginPage = () => {
    const [havingAccount, setHavingAccount] = useState(true);
    return (
        <div>
            {havingAccount ? <LoginForm /> : <RegisterForm />}
            <button onClick={() => setHavingAccount(!havingAccount)}>
                {havingAccount
                    ? 'Create an account'
                    : 'Already have an account'}
            </button>
        </div>
    );
};

export default RegisterLoginPage;
