import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventManager } from './EventManager'
import { dataStore } from '../dataStore'
import type { Event } from '../types'

vi.mock('../dataStore', () => ({
  dataStore: {
    getEventsForDate: vi.fn(),
    addEvent: vi.fn(),
    deleteEvent: vi.fn(),
  },
}))

const mockGetEventsForDate = vi.mocked(dataStore.getEventsForDate)
const mockAddEvent = vi.mocked(dataStore.addEvent)
const mockDeleteEvent = vi.mocked(dataStore.deleteEvent)

const selectedDate = new Date('2026-04-27T12:00:00')

const sampleEvent: Event = {
  id: 'evt-1',
  title: 'Team Meeting',
  description: 'Weekly sync',
  startTime: '09:00',
  endTime: '10:00',
  date: '2026-04-27',
}

const sampleEventNoDesc: Event = {
  id: 'evt-2',
  title: 'Lunch',
  startTime: '12:00',
  endTime: '13:00',
  date: '2026-04-27',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetEventsForDate.mockReturnValue([])
})

describe('EventManager — no date selected', () => {
  it('renders the prompt to select a date', () => {
    render(<EventManager selectedDate={null} onEventsChange={vi.fn()} />)
    expect(screen.getByText('Select a date to view and manage events')).toBeInTheDocument()
  })

  it('does not render the Add Event button', () => {
    render(<EventManager selectedDate={null} onEventsChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /add event/i })).not.toBeInTheDocument()
  })
})

describe('EventManager — date selected, no events', () => {
  it('renders the formatted date header', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Monday, April 27, 2026')
  })

  it('shows the no-events message', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    expect(screen.getByText('No events scheduled for this day')).toBeInTheDocument()
  })

  it('renders the Add Event button', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Add Event' })).toBeInTheDocument()
  })

  it('does not show the form initially', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    expect(screen.queryByRole('textbox', { name: /event title/i })).not.toBeInTheDocument()
  })
})

describe('EventManager — date selected, with events', () => {
  beforeEach(() => {
    mockGetEventsForDate.mockReturnValue([sampleEvent, sampleEventNoDesc])
  })

  it('renders event titles', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    expect(screen.getByText('Team Meeting')).toBeInTheDocument()
    expect(screen.getByText('Lunch')).toBeInTheDocument()
  })

  it('renders formatted time range for events', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    expect(screen.getByText('9:00 AM - 10:00 AM')).toBeInTheDocument()
    expect(screen.getByText('12:00 PM - 1:00 PM')).toBeInTheDocument()
  })

  it('renders event description when present', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    expect(screen.getByText('Weekly sync')).toBeInTheDocument()
  })

  it('does not render description element when absent', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    const lunchItem = screen.getByText('Lunch').closest<HTMLElement>('.event-item')!
    expect(within(lunchItem).queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders a delete button per event', () => {
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    const deleteButtons = screen.getAllByTitle('Delete event')
    expect(deleteButtons).toHaveLength(2)
  })
})

describe('EventManager — Add Event form toggle', () => {
  it('shows the form when Add Event is clicked', async () => {
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    expect(screen.getByLabelText('Event Title *')).toBeInTheDocument()
  })

  it('changes button label to Cancel while form is open', async () => {
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    // Both the header toggle button and the form's Cancel button show "Cancel"
    expect(screen.getAllByRole('button', { name: 'Cancel' })).toHaveLength(2)
  })

  it('hides the form when the header Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    // Click the first Cancel button — the header toggle
    await user.click(screen.getAllByRole('button', { name: 'Cancel' })[0])
    expect(screen.queryByLabelText('Event Title *')).not.toBeInTheDocument()
  })

  it('hides the form when the form Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    // The form's own Cancel button
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' })
    await user.click(cancelButtons[cancelButtons.length - 1])
    expect(screen.queryByLabelText('Event Title *')).not.toBeInTheDocument()
  })
})

describe('EventManager — form submission', () => {
  const newEvent: Event = {
    id: 'evt-new',
    title: 'Stand-up',
    description: '',
    startTime: '08:00',
    endTime: '08:30',
    date: '2026-04-27',
  }

  it('calls dataStore.addEvent with correct data on valid submit', async () => {
    mockAddEvent.mockReturnValue(newEvent)
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    await user.type(screen.getByLabelText('Event Title *'), 'Stand-up')
    await user.type(screen.getByLabelText('Start Time *'), '08:00')
    await user.type(screen.getByLabelText('End Time *'), '08:30')
    await user.click(screen.getByRole('button', { name: 'Add Event', hidden: false }))

    expect(mockAddEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Stand-up',
        startTime: '08:00',
        endTime: '08:30',
        date: '2026-04-27',
      })
    )
  })

  it('calls onEventsChange after adding an event', async () => {
    mockAddEvent.mockReturnValue(newEvent)
    const onEventsChange = vi.fn()
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={onEventsChange} />)

    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    await user.type(screen.getByLabelText('Event Title *'), 'Stand-up')
    await user.type(screen.getByLabelText('Start Time *'), '08:00')
    await user.type(screen.getByLabelText('End Time *'), '08:30')
    await user.click(screen.getByRole('button', { name: 'Add Event', hidden: false }))

    expect(onEventsChange).toHaveBeenCalledOnce()
  })

  it('closes the form after a successful submission', async () => {
    mockAddEvent.mockReturnValue(newEvent)
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    await user.type(screen.getByLabelText('Event Title *'), 'Stand-up')
    await user.type(screen.getByLabelText('Start Time *'), '08:00')
    await user.type(screen.getByLabelText('End Time *'), '08:30')
    await user.click(screen.getByRole('button', { name: 'Add Event', hidden: false }))

    expect(screen.queryByLabelText('Event Title *')).not.toBeInTheDocument()
  })

  it('shows an alert when end time is not after start time', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    await user.type(screen.getByLabelText('Event Title *'), 'Bad Event')
    await user.type(screen.getByLabelText('Start Time *'), '10:00')
    await user.type(screen.getByLabelText('End Time *'), '09:00')
    await user.click(screen.getByRole('button', { name: 'Add Event', hidden: false }))

    expect(alertSpy).toHaveBeenCalledWith('End time must be after start time')
    expect(mockAddEvent).not.toHaveBeenCalled()

    alertSpy.mockRestore()
  })

  it('does not submit when title is missing', async () => {
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Add Event' }))
    await user.type(screen.getByLabelText('Start Time *'), '08:00')
    await user.type(screen.getByLabelText('End Time *'), '08:30')
    await user.click(screen.getByRole('button', { name: 'Add Event', hidden: false }))

    expect(mockAddEvent).not.toHaveBeenCalled()
  })
})

describe('EventManager — delete event', () => {
  beforeEach(() => {
    mockGetEventsForDate.mockReturnValue([sampleEvent])
  })

  it('calls dataStore.deleteEvent with the event id when confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockDeleteEvent.mockReturnValue(true)
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)

    await user.click(screen.getByTitle('Delete event'))

    expect(mockDeleteEvent).toHaveBeenCalledWith('evt-1')
  })

  it('calls onEventsChange after deletion', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockDeleteEvent.mockReturnValue(true)
    const onEventsChange = vi.fn()
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={onEventsChange} />)

    await user.click(screen.getByTitle('Delete event'))

    expect(onEventsChange).toHaveBeenCalledOnce()
  })

  it('removes the event from the list after deletion', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockDeleteEvent.mockReturnValue(true)
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)

    await user.click(screen.getByTitle('Delete event'))

    expect(screen.queryByText('Team Meeting')).not.toBeInTheDocument()
  })

  it('does not delete when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    render(<EventManager selectedDate={selectedDate} onEventsChange={vi.fn()} />)

    await user.click(screen.getByTitle('Delete event'))

    expect(mockDeleteEvent).not.toHaveBeenCalled()
    expect(screen.getByText('Team Meeting')).toBeInTheDocument()
  })
})
