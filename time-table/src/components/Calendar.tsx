import React from 'react';
import type { CalendarDay } from '../types';
import { dataStore } from '../dataStore';
import './Calendar.css';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = React.useState(currentDate.getFullYear());

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (month: number, year: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Add previous month's days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(prevYear, prevMonth, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        events: dataStore.getEventsForDate(formatDate(date))
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        events: dataStore.getEventsForDate(formatDate(date))
      });
    }

    // Add next month's days to fill the grid
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remainingDays = 42 - days.length; // 6 weeks × 7 days = 42
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextYear, nextMonth, day);
      days.push({
        date,
        isCurrentMonth: false,
        events: dataStore.getEventsForDate(formatDate(date))
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth, currentYear);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth('prev')}>&lt;</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={() => navigateMonth('next')}>&gt;</button>
      </div>
      
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {days.map((calendarDay, index) => (
          <div
            key={index}
            className={`calendar-day ${
              !calendarDay.isCurrentMonth ? 'other-month' : ''
            } ${isToday(calendarDay.date) ? 'today' : ''} ${
              isSelected(calendarDay.date) ? 'selected' : ''
            } ${calendarDay.events.length > 0 ? 'has-events' : ''}`}
            onClick={() => onDateSelect(calendarDay.date)}
          >
            <span className="day-number">{calendarDay.date.getDate()}</span>
            {calendarDay.events.length > 0 && (
              <div className="event-indicator">
                <span className="event-count">{calendarDay.events.length}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
