// sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Brain,
  BarChart3,
  History,
  Settings,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { name: 'EEG Input', path: '/dashboard/input', icon: Brain },
    { name: 'Statistics', path: '/dashboard/statistics', icon: BarChart3 },
    { name: 'History', path: '/dashboard/history', icon: History },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-900 to-indigo-800 p-4 shadow-lg">
      <div className="text-white font-bold text-2xl mb-10 flex items-center">
        <Brain className="mr-2" /> EEG Dashboard
      </div>
      <nav className="flex-1">
        <ul>
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;

            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center p-3 rounded-xl mb-2 transition duration-200 ease-in-out hover:bg-blue-700 hover:bg-opacity-30 hover:text-white
                  ${active ? 'bg-white bg-opacity-20 text-white' : 'text-gray-300'}`}
                >
                  <Icon className="mr-3" size={20} />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
