import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
    return null;
  }

  return isLogin ? (
    <Login onToggleMode={() => setIsLogin(false)} />
  ) : (
    <Signup onToggleMode={() => setIsLogin(true)} />
  );
};

export default LoginPage;