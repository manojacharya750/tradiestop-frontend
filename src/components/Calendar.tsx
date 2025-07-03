import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [displayDate, setDisplayDate] = useState(selectedDate);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
  const endOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endOfMonth || dates.length % 7 !== 0) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
   if (dates.length % 7 !== 0) {
       let lastDate = dates[dates.length - 1];
       while (dates.length % 7 !== 0) {
           lastDate = new Date(lastDate);
           lastDate.setDate(lastDate.getDate() + 1);
           dates.push(lastDate);
       }
   }


  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => 
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

  return (
    <div className="w-full bg-white p-4 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-slate-100">
          <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
        </button>
        <div className="font-semibold text-slate-800">
          {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-slate-100">
          <ChevronRightIcon className="h-5 w-5 text-slate-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = date.getMonth() === displayDate.getMonth();
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={index}
              onClick={() => onDateChange(date)}
              className={`
                w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors
                ${isCurrentMonth ? 'text-slate-700' : 'text-slate-400'}
                ${!isSelected && isCurrentMonth ? 'hover:bg-slate-100' : ''}
                ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                ${isToday && !isSelected ? 'border border-blue-500' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
