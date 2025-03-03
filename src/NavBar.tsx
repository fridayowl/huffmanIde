import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Settings, Hexagon } from 'lucide-react';

interface IconButtonProps {
    children: ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ children }) => (
    <button
        className="group relative p-2 rounded-lg overflow-hidden transition-all duration-300
      hover:-translate-y-0.5"
    >
        {/* Hover background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 
      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 
      group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon container */}
        <div className="relative">
            {children}
        </div>
    </button>
);

const NavBarMinimal: React.FC = () => (
    <nav className="relative">
        {/* Background with enhanced gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />

        {/* Subtle glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5" />

        {/* Border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r 
      from-gray-800/50 via-indigo-500/20 to-gray-800/50" />

        <div className="relative container mx-auto flex justify-between items-center p-4">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center gap-3">
                <div className="group relative w-10 h-10">
                    {/* Logo background with glow */}
                    <div className="absolute inset-0 bg-indigo-600/20 rounded-xl backdrop-blur-xl 
            border border-indigo-500/20 group-hover:border-indigo-500/40 
            transition-all duration-300" />

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-indigo-500/20 blur-sm opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Logo icon */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 124 124" fill="none">
                            <rect width="124" height="124" rx="24" fill="#222556" />
                            <path d="M19.375 36.7818V100.625C19.375 102.834 21.1659 104.625 23.375 104.625H87.2181C90.7818 104.625 92.5664 100.316 90.0466 97.7966L26.2034 33.9534C23.6836 31.4336 19.375 33.2182 19.375 36.7818Z" fill="#5f68bf" />
                            <circle cx="63.2109" cy="37.5391" r="15.1641" fill="#5f68bf" />
                           
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-white font-medium hover:text-indigo-300 transition-colors duration-300">
                         Huffman
                    </span>
                    <span className="text-gray-400 text-sm"> Modern Development Platform</span>
                </div>
            </Link>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-2">
                <IconButton>
                    <Search className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 
            transition-colors duration-300" />
                </IconButton>

                <IconButton>
                    <Bell className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 
            transition-colors duration-300" />
                </IconButton>

                <IconButton>
                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 
            transition-colors duration-300" />
                </IconButton>

                <IconButton>
                    <User className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 
            transition-colors duration-300" />
                </IconButton>

                {/* Home button */}
                <Link
                    to="/"
                    className="group relative ml-2 px-4 py-2 rounded-full overflow-hidden
            transition-all duration-300 hover:-translate-y-0.5"
                >
                    {/* Button background with gradient */}
                    <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 
            transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-sm opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Button text */}
                    <span className="relative font-medium text-sm text-gray-900">
                        Home
                    </span>
                </Link>
            </div>
        </div>
    </nav>
);

export default NavBarMinimal;
