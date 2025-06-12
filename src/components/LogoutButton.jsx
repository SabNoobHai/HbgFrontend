import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    //remove user data from localStorage
    localStorage.removeItem('user');
  };

  return (
    <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
      Logout
    </button>
  );
};

export default LogoutButton;
