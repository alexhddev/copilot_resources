import React, { useState, useEffect } from 'react';
import type { Event } from '../types';
import { dataStore } from '../dataStore';
import './EventManager.css';

interface EventManagerProps {
  selectedDate: Date | null;
  onEventsChange: () => void;
}

export const EventManager: React.FC<EventManagerProps> = ({ selectedDate, onEventsChange }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (selectedDate) {
      const dateString = formatDate(selectedDate);
      const dayEvents = dataStore.getEventsForDate(dateString);
      setEvents(dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } else {
      setEvents([]);
    }
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    if (formData.title && formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        alert('End time must be after start time');
        return;
      }

      const newEvent = dataStore.addEvent({
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        date: formatDate(selectedDate)
      });

      setEvents(prev => [...prev, newEvent].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setFormData({ title: '', description: '', startTime: '', endTime: '' });
      setShowForm(false);
      onEventsChange();
    }
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      dataStore.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      onEventsChange();
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!selectedDate) {
    return (
      <div className="event-manager">
        <div className="no-date-selected">
          <p>Select a date to view and manage events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-manager">
      <div className="event-manager-header">
        <h3>{formatDateDisplay(selectedDate)}</h3>
        <button 
          className="add-event-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="time"
                id="startTime"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Event</button>
            <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="events-list">
        {events.length === 0 ? (
          <p className="no-events">No events scheduled for this day</p>
        ) : (
          <div className="events">
            {events.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-content">
                  <div className="event-header">
                    <h4 className="event-title">{event.title}</h4>
                    <div className="event-time">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  </div>
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(event.id)}
                  title="Delete event"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
