
import React from 'react';
import { GoldIcon } from './icons/GoldIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-center sm:justify-start">
        <GoldIcon className="w-8 h-8 mr-3 text-yellow-400" />
        <h1 className="text-xl font-bold text-white tracking-wider">
          Sudan GoldMapper
        </h1>
      </div>
    </header>
  );
};
