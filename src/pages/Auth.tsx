import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return isLogin ? (
    <LoginForm onToggleMode={toggleMode} />
  ) : (
    <RegisterForm onToggleMode={toggleMode} />
  );
};