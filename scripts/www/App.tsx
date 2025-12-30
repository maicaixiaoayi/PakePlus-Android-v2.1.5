import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import ReservationForm from './components/ReservationForm.tsx';
import ReservationList from './components/ReservationList.tsx';
import { Reservation } from './types.ts';
import { STORAGE_KEY } from './constants.ts';

const App: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [viewMode, setViewMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
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

  // Save to LocalStorage whenever reservations change
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
    const listElement = document.getElementById('reservation-list');
    if (listElement) {
        listElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const deleteReservation = (id: number) => {
    if (window.confirm("确定删除这条记录吗？")) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => !prev);
    // When entering view mode, scroll to top
    if (!viewMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isLoaded) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${viewMode ? 'bg-white p-4' : 'bg-gray-100 p-4 pb-24'}`}>
      <div className="max-w-md mx-auto w-full">
        <Header viewMode={viewMode} toggleViewMode={toggleViewMode} />

        {/* Input Section - Hidden in View Mode */}
        {!viewMode && (
          <div className="mb-6">
            <ReservationForm onAdd={addReservation} />
          </div>
        )}

        {/* List Section */}
        <div id="reservation-list">
            <ReservationList
            reservations={reservations}
            onDelete={deleteReservation}
            viewMode={viewMode}
            />
        </div>
        
        {/* Footer info for Screenshot mode */}
        {viewMode && (
             <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
                生成的预定单 • {new Date().toLocaleDateString()}
             </div>
        )}
      </div>
    </div>
  );
};

export default App;