export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string; // YYYY-MM-DD format
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: Event[];
}
