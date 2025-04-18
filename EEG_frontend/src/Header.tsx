import React from 'react';
import { Sun, Moon, LogOut, Search } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, handleLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search EEG predictions..."
            className="px-4 py-2 rounded-xl border dark:border-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" size={20} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition duration-200"
        >
          <LogOut size={20} className="mr-2" /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
