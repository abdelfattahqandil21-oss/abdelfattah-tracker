# Health & Productivity Tracker

A comprehensive Angular application for tracking health metrics and daily productivity. This application is built with Angular 18, Tailwind CSS, and uses IndexedDB for local data persistence. It also supports Server-Side Rendering (SSR).

## Features

### 1. Dashboard (Overview)
- Provides a high-level summary of your daily activities.
- Displays quick stats for sugar levels, tasks, and evaluations.
- Visualizes trends and recent activity.

### 2. Sugar Tracker
- Track daily blood glucose levels.
- Record readings for Breakfast, Lunch, and Dinner (Before and After meals).
- View a 14-day history table with color-coded values (Low, Normal, High).
- Visual charts to analyze trends over time.

### 3. Task Manager
- Manage daily tasks with a Kanban board or List view.
- Categorize tasks by type (Work, Personal, Health, etc.).
- Track task status (Todo, In Progress, Done).
- Filter tasks by date and status.

### 4. Daily Evaluations
- Rate your day based on Productivity, Health, and Activity.
- View weekly history and averages.
- Navigate through previous weeks to see past performance.

### 5. Daily Notes
- Write and save daily notes.
- View notes history by date.
- Simple and efficient text editor.

## Technical Stack

- **Framework**: Angular 18 (Standalone Components, Signals)
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals
- **Persistence**: IndexedDB (via IDBService)
- **Rendering**: Server-Side Rendering (SSR) with Angular Universal / Express
- **Charts**: Chart.js

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Application

**Development Server:**
```bash
pnpm run serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

**SSR Development Server:**
```bash
pnpm run serve:ssr:tracker
```

### Building

**Build for Production:**
```bash
pnpm run build
```
The build artifacts will be stored in the `dist/` directory.

**Build for SSR:**
```bash
pnpm run build:ssr
```

## Project Structure

- `src/app/core`: Singleton services and core functionality (e.g., IDBService).
- `src/app/features`: Feature modules (Overview, Sugar Tracker, Tasks, Evaluations, Notes).
- `src/app/shared`: Shared components, models, and utilities.
- `src/server.ts`: Express server configuration for SSR.

## Key Services

- **IDBService**: Handles all interactions with IndexedDB for storing tasks, sugar readings, evaluations, and notes.
- **LoadingService**: Manages the global loading state and spinner.
- **SugarService, TasksService, EvaluationsService, NotesService**: Feature-specific services for business logic and state management.

## Notes

- The application uses local storage (IndexedDB), so your data is stored securely in your browser.
- SSR is enabled to improve initial load performance and SEO.
