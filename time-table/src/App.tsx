
import { useState } from 'react';
import { Calendar } from './components/Calendar';
import { EventManager } from './components/EventManager';
import './App.css';

/**
 * The main application component for the Time Table app.
 *
 * Renders the header, calendar, and event manager sections.
 * Manages the selected date and triggers refreshes when events change.
 *
 * @component
 */
function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventsChange = () => {
    // Force refresh of calendar to update event indicators
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Time Table</h1>
        <p>Select a date to view and manage your events</p>
      </header>
      
      <main className="app-main">
        <div className="calendar-section">
          <Calendar 
            key={refreshKey}
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect} 
          />
        </div>
        
        <div className="events-section">
          <EventManager 
            selectedDate={selectedDate} 
            onEventsChange={handleEventsChange}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
