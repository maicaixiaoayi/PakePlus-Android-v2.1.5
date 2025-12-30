import React from 'react';
import { Reservation } from '../types.ts';
import { Trash2, Phone, Users } from 'lucide-react';

interface ReservationCardProps {
  data: Reservation;
  onDelete: (id: number) => void;
  viewMode: boolean;
  hideDate?: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ data, onDelete, viewMode, hideDate }) => {
  const isLunch = data.period === '中餐';

  // Format date slightly nicer: 2023-10-25 -> 10/25
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className={`
      relative bg-white rounded-xl p-4 transition-all duration-300
      border-l-4 
      ${isLunch ? 'border-l-orange-500' : 'border-l-blue-600'}
      ${viewMode ? 'shadow-none border border-gray-200' : 'shadow-sm hover:shadow-md'}
    `}>
      {/* Delete Button - Hidden in View Mode */}
      {!viewMode && (
        <button
          onClick={() => onDelete(data.id)}
          className="absolute top-3 right-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="删除"
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Header: Room Name + Time Badge */}
      <div className="flex justify-between items-start mb-3 pr-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {data.roomName}
          </h3>
        </div>
        <div className={`
          px-2.5 py-1 rounded-md text-xs font-bold tracking-wide shadow-sm flex items-center gap-1
          ${isLunch ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-800'}
        `}>
          {/* If hideDate is true (grouped view), don't show date here. Otherwise show it. */}
          {!hideDate && (
             <span className="opacity-75 mr-1">{formatDate(data.date)}</span>
          )}
          <span>{data.period}</span>
          <span className="opacity-50">|</span>
          <span>{data.time}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900 font-medium">
             <span className="text-base">{data.name}</span>
             <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                <Users size={12} />
                {data.guests}人
             </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Phone size={14} className="text-gray-400" />
            <span>{data.contact || '无联系方式'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;