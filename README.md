# Threadr - Task Management Application

Threadr is a modern, responsive task management application built with React, TypeScript, and Vite. It helps you organize your tasks into different categories (Work, Personal, Other) and manage them efficiently with drag-and-drop functionality.

## Screenshots

<a href="https://ibb.co/DH4G4CVJ"><img src="https://i.ibb.co/ksK3K8H7/image.png" alt="image" border="0"></a>

<a href="https://ibb.co/mrdQkHPY"><img src="https://i.ibb.co/spcLnFXD/image.png" alt="image" border="0"></a>

<a href="https://ibb.co/FkVGttgL"><img src="https://i.ibb.co/5XFqVVBg/image.png" alt="image" border="0"></a>



## Features

- Create, edit, and delete tasks
- Categorize tasks into Work, Personal, or Other categories
- Set task priorities (Low, Medium, High, Critical)
- Track task status (Pending/Completed)
- Intuitive drag-and-drop interface
- Filter tasks by status (All, Pending, Completed)
- Auto-saves to local storage
- Light and dark theme support
- Fully responsive design

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- HeroIcons
- DnD Kit (Drag and Drop)

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Git (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KingRain/threadr.git
   cd threadr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── types/         # TypeScript type definitions
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## Additional Features

### Local Storage
- All tasks and board title are automatically saved to the browser's local storage
- No account or backend required
- Data persists between sessions

### Theme Toggle
- Switch between light and dark themes
- Theme preference is saved to local storage
- System theme detection
- Smooth transitions between themes

## Assumptions

1. **Data Persistence**: The app uses localStorage for simplicity.
2. **Authentication**: No authentication is implemented.
3. **Offline First**: The app is designed to work offline-first with localStorage.
