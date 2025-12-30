import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Camera, 
  Edit2, 
  CalendarDays, 
  Users, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Coffee 
} from 'lucide-react';

// --- Types ---
interface Reservation {
  id: number;
  date: string;
  time: string;
  period: '中餐' | '晚餐';
  roomId: string;
  roomName: string;
  guests: string;
  name: string;
  contact: string;
}

interface Room {
  id: string;
  name: string;
  capacity?: string;
}

// --- Constants ---
const ROOMS: Room[] = [
  { id: '1', name: '最幸福', capacity: '10-12人' },
  { id: '2', name: '最快乐', capacity: '8-10人' },
  { id: '3', name: '最开心', capacity: '12-16人' }
];

const STORAGE_KEY = 'mobile_reservations_v2';

// --- Helper Components ---

// 1. Header Component
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

// 2. Reservation Form Component
interface ReservationFormProps {
  onAdd: (reservation: Omit<Reservation, 'id'>) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onAdd }) => {
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [time, setTime] = useState('');
  const [roomId, setRoomId] = useState('');
  const [guests, setGuests] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [period, setPeriod] = useState<'中餐' | '晚餐' | null>(null);

  useEffect(() => {
    if (!time) {
      setPeriod(null);
      return;
    }
    const hour = parseInt(time.split(':')[0], 10);
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

    setTime('');
    setRoomId('');
    setGuests('');
    setName('');
    setContact('');
  };

  const Edit2Icon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Edit2Icon className="w-4 h-4" />
        新增预定
      </h2>
      
      <form onSubmit={handleSubmit}>
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

// 3. Reservation Card Component
interface ReservationCardProps {
  data: Reservation;
  onDelete: (id: number) => void;
  viewMode: boolean;
  hideDate?: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ data, onDelete, viewMode, hideDate }) => {
  const isLunch = data.period === '中餐';

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
      {!viewMode && (
        <button
          onClick={() => onDelete(data.id)}
          className="absolute top-3 right-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="删除"
        >
          <Trash2 size={18} />
        </button>
      )}

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
          {!hideDate && (
             <span className="opacity-75 mr-1">{formatDate(data.date)}</span>
          )}
          <span>{data.period}</span>
          <span className="opacity-50">|</span>
          <span>{data.time}</span>
        </div>
      </div>

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

// 4. Reservation List Component
interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: number) => void;
  viewMode: boolean;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations, onDelete, viewMode }) => {
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
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
                hideDate={true}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [viewMode, setViewMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reservations", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    }
  }, [reservations, isLoaded]);

  const addReservation = (data: Omit<Reservation, 'id'>) => {
    const newReservation: Reservation = {
      ...data,
      id: Date.now(),
    };
    setReservations((prev) => [...prev, newReservation]);
    
    // Optional: Scroll to list smoothly
    setTimeout(() => {
        const listElement = document.getElementById('reservation-list');
        if (listElement) {
            listElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const deleteReservation = (id: number) => {
    if (window.confirm("确定删除这条记录吗？")) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => !prev);
    if (!viewMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isLoaded) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${viewMode ? 'bg-white p-4' : 'bg-gray-100 p-4 pb-24'}`}>
      <div className="max-w-md mx-auto w-full">
        <Header viewMode={viewMode} toggleViewMode={toggleViewMode} />

        {!viewMode && (
          <div className="mb-6">
            <ReservationForm onAdd={addReservation} />
          </div>
        )}

        <div id="reservation-list">
            <ReservationList
            reservations={reservations}
            onDelete={deleteReservation}
            viewMode={viewMode}
            />
        </div>
        
        {viewMode && (
             <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
                生成的预定单 • {new Date().toLocaleDateString()}
             </div>
        )}
      </div>
    </div>
  );
};

// --- Mount ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);