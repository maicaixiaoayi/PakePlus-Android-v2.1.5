import React from 'react';
import { Camera, Edit2, CalendarDays } from 'lucide-react';

interface HeaderProps {
  viewMode: boolean;
  toggleViewMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, toggleViewMode }) => {
  return (
    <header className={`flex justify-between items-center mb-6 transition-all duration-300 ${viewMode ? 'px-2' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">包厢预定簿</h1>
      </div>
      
      <button 
        onClick={toggleViewMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
          ${viewMode 
            ? 'bg-gray-600 text-white hover:bg-gray-700' 
            : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
      >
        {viewMode ? (
          <>
            <Edit2 size={16} />
            <span>返回编辑</span>
          </>
        ) : (
          <>
            <Camera size={16} />
            <span>截图模式</span>
          </>
        )}
      </button>
    </header>
  );
};

export default Header;