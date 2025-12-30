import React, { useState, useEffect } from 'react';
import { ROOMS } from '../constants.ts';
import { Reservation } from '../types.ts';
import { Users, User, Phone, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface ReservationFormProps {
  onAdd: (reservation: Omit<Reservation, 'id'>) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onAdd }) => {
  // Default date to today
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [time, setTime] = useState('');
  const [roomId, setRoomId] = useState('');
  const [guests, setGuests] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [period, setPeriod] = useState<'中餐' | '晚餐' | null>(null);

  // Auto-detect period based on time
  useEffect(() => {
    if (!time) {
      setPeriod(null);
      return;
    }
    const hour = parseInt(time.split(':')[0], 10);
    // Assuming Lunch is before 16:00 (4 PM)
    if (hour < 16) {
      setPeriod('中餐');
    } else {
      setPeriod('晚餐');
    }
  }, [time]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !roomId || !guests || !name || !period) {
      alert("⚠️ 请填写完整信息（日期、时间、包厢、人数、预订人）");
      return;
    }

    const selectedRoom = ROOMS.find(r => r.id === roomId);

    onAdd({
      date,
      time,
      period,
      roomId,
      roomName: selectedRoom ? selectedRoom.name : '未知包厢',
      guests,
      name,
      contact
    });

    // Reset form fields but keep date
    setTime('');
    setRoomId('');
    setGuests('');
    setName('');
    setContact('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Edit2Icon className="w-4 h-4" />
        新增预定
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Date & Time Row */}
        <div className="grid grid-cols-12 gap-4 mb-5">
          <div className="col-span-7">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">日期</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800 font-medium"
                required
              />
            </div>
          </div>
          <div className="col-span-5">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">时间</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Clock size={16} />
              </div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-9 pr-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800 font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Meal Period Indicator */}
        <div className="mb-6 flex justify-center">
             <div className={`
                px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5
                ${!period ? 'bg-gray-100 text-gray-400' : ''}
                ${period === '中餐' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200' : ''}
                ${period === '晚餐' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' : ''}
             `}>
                {period === '中餐' && '☀️ 中餐时段'}
                {period === '晚餐' && '🌙 晚餐时段'}
                {!period && '等待选择时间...'}
             </div>
        </div>

        {/* Room Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">选择包厢</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROOMS.map((room) => (
              <button
                type="button"
                key={room.id}
                onClick={() => setRoomId(room.id)}
                className={`
                  relative p-3 rounded-xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1
                  ${roomId === room.id 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }
                `}
              >
                {roomId === room.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={14} className="text-indigo-200" />
                  </div>
                )}
                <span>{room.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Guest & Name */}
        <div className="grid grid-cols-12 gap-4 mb-5">
          <div className="col-span-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">人数</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Users size={16} />
              </div>
              <input
                type="number"
                placeholder="8"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800"
                required
              />
            </div>
          </div>
          <div className="col-span-8">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">预订人</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={16} />
              </div>
              <input
                type="text"
                placeholder="张先生/女士"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">电话 / 备注</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Phone size={16} />
            </div>
            <input
              type="text"
              placeholder="手机号或微信号 (选填)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 transform active:scale-[0.98] flex justify-center items-center gap-2"
        >
          确认预定
        </button>
      </form>
    </div>
  );
};

// Helper component for icon
const Edit2Icon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export default ReservationForm;