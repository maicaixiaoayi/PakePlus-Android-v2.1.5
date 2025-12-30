import React from 'react';
import { Reservation } from '../types.ts';
import ReservationCard from './ReservationCard.tsx';
import { Coffee, CalendarDays } from 'lucide-react';

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: number) => void;
  viewMode: boolean;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations, onDelete, viewMode }) => {
  // Sort reservations by Date then Time
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Helper to get date label (Today, Tomorrow, etc.)
  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Fix timezone offset issue for pure date comparison by treating the input date as local midnight
    // We split YYYY-MM-DD and create date object locally
    const [y, m, d] = dateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[targetDate.getDay()];
    const dateText = `${m}月${d}日`;

    if (diffDays === 0) return `📅 今日 (${dateText})`;
    if (diffDays === 1) return `📅 明日 (${dateText})`;
    if (diffDays === 2) return `📅 后天 (${dateText})`;
    return `📅 ${dateText} ${weekDay}`;
  };

  // Group by date
  const groupedReservations = sortedReservations.reduce((groups, res) => {
    const date = res.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(res);
    return groups;
  }, {} as Record<string, Reservation[]>);

  const dates = Object.keys(groupedReservations);

  if (reservations.length === 0) {
    return (
      <div className="mt-4 text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
        <Coffee size={48} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">暂无预定，快去添加第一单吧</p>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ${viewMode ? 'mt-0' : 'mt-4'}`}>
      {!viewMode && (
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
             最近预定列表
          </h3>
          <span className="bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
            {reservations.length} 单
          </span>
        </div>
      )}

      {dates.map((date) => (
        <div key={date} className="mb-6">
          {/* Date Header - More prominent in viewMode, or always visible if grouping is preferred */}
          <div className={`
            flex items-center gap-2 mb-3 pb-2 border-b border-gray-200
            ${viewMode ? 'mt-6' : 'mt-2'}
          `}>
             <h3 className={`font-bold text-gray-800 ${viewMode ? 'text-xl' : 'text-base'}`}>
                {getDateLabel(date)}
             </h3>
          </div>

          <div className="space-y-3">
            {groupedReservations[date].map((res) => (
              <ReservationCard
                key={res.id}
                data={res}
                onDelete={onDelete}
                viewMode={viewMode}
                hideDate={true} // Since we have a header, we can simplify the card
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;