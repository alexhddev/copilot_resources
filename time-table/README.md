# Time Table

A modern, interactive calendar application built with React and TypeScript that allows you to manage your events and schedule efficiently.

## Features

- 📅 **Interactive Calendar** - Navigate through months and select dates
- 📝 **Event Management** - Create, edit, and delete events for any date
- 🎯 **Date Selection** - Click on any date to view and manage its events
- 💾 **Local Storage** - Your events are automatically saved in your browser
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds

## Prerequisites

Before running this project, make sure you have **Node.js** installed on your system:

- **Node.js** version 16.0 or higher
- **npm** (comes with Node.js) or **yarn**

You can download Node.js from [nodejs.org](https://nodejs.org/)

## Getting Started

### 1. Clone the repository (if applicable)
```bash
git clone <repository-url>
cd time-table
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## How to Use

1. **Navigate the Calendar**: Use the arrow buttons to navigate between months
2. **Select a Date**: Click on any date in the calendar to select it
3. **Add Events**: With a date selected, use the event manager on the right to add new events
4. **Manage Events**: Edit or delete existing events by clicking on them in the event list
5. **View Event Indicators**: Days with events will show visual indicators on the calendar

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **CSS** - Styling
- **Local Storage** - Data persistence

## Project Structure

```
src/
├── components/          # React components
│   ├── Calendar.tsx     # Main calendar component
│   ├── Calendar.css     # Calendar styles
│   ├── EventManager.tsx # Event management component
│   └── EventManager.css # Event manager styles
├── App.tsx             # Main application component
├── App.css             # Main application styles
├── dataStore.ts        # Data management and local storage
├── types.ts            # TypeScript type definitions
└── main.tsx            # Application entry point
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).