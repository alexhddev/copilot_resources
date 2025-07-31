import type { Event } from './types';

class DataStore {
  private events: Map<string, Event[]> = new Map();

  addEvent(event: Omit<Event, 'id'>): Event {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newEvent: Event = { ...event, id };
    
    const dateEvents = this.events.get(event.date) || [];
    dateEvents.push(newEvent);
    this.events.set(event.date, dateEvents);
    
    return newEvent;
  }

  getEventsForDate(date: string): Event[] {
    return this.events.get(date) || [];
  }

  updateEvent(eventId: string, updates: Partial<Omit<Event, 'id'>>): Event | null {
    for (const [, events] of this.events.entries()) {
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        const updatedEvent = { ...events[eventIndex], ...updates };
        events[eventIndex] = updatedEvent;
        return updatedEvent;
      }
    }
    return null;
  }

  deleteEvent(eventId: string): boolean {
    for (const [date, events] of this.events.entries()) {
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        events.splice(eventIndex, 1);
        if (events.length === 0) {
          this.events.delete(date);
        }
        return true;
      }
    }
    return false;
  }

  getAllEvents(): Event[] {
    const allEvents: Event[] = [];
    for (const events of this.events.values()) {
      allEvents.push(...events);
    }
    return allEvents;
  }

  hasEventsForDate(date: string): boolean {
    const events = this.events.get(date);
    return events !== undefined && events.length > 0;
  }
}

// Create a singleton instance
export const dataStore = new DataStore();
