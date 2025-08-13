
import React from 'react';
import { User } from '../types';
import { MicIcon, UserCircleIcon } from './icons';

interface HeaderProps {
  user: User | null;
  onSignInClick: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignInClick, onSignOut }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="text-blue-400">
                <MicIcon className="w-8 h-8"/>
            </div>
            <h1 className="text-2xl font-orbitron text-white tracking-wider">
              Tha Mobile Lab
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name || 'User'} className="w-10 h-10 rounded-full border-2 border-blue-400" />
                ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-blue-400 bg-gray-700 flex items-center justify-center">
                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    </div>
                )}
                <button
                  onClick={onSignOut}
                  className="px-4 py-2 text-sm font-bold text-gray-300 bg-gray-800 rounded-md hover:bg-red-500/80 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onSignInClick}
                className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};