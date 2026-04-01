import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
        AI Resume Builder
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 dark:text-gray-200 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <UserIcon size={16} />
              <span>{user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 dark:text-gray-200 hover:text-blue-600 font-medium">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
