# TaskFlow - Premium Task Dashboard

TaskFlow is a highly polished, professional-grade productivity application built with React and TypeScript. It features a modern, full-screen dashboard designed with a hyper-premium, light-mode aesthetic inspired by top-tier SaaS applications like Linear.

## ✨ Features

- **Edge-to-Edge Premium UI**: A beautiful, minimalist interface leveraging glassmorphism, soft drop shadows, and fluid background gradients.
- **Bento-Box Analytics**: A gorgeous dashboard top-section featuring an animated circular progress ring to visualize your completion stats in real-time.
- **Kanban Board & List Views**: Seamlessly toggle between a traditional list view and a powerful drag-and-drop Kanban board (To Do, In Progress, Completed).
- **Rich Task Details Panel**: Clicking a task slides out a beautiful side-panel containing:
  - Inline Title Editing
  - Premium Priority Switcher
  - Rich Text Description
  - Subtask Management (add, toggle, delete)
  - Built-in Pomodoro/Stopwatch Time Tracker
- **Keyboard Navigation**: Use `Cmd+K` (or `Ctrl+K`) to instantly focus the global search bar.
- **Persistent Storage**: All your tasks, subtasks, and tracked time are automatically saved securely to your local storage.

## 🛠 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Drag and Drop**: [@dnd-kit](https://docs.dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd ToDoList
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` to view the dashboard!

### Building for Production
To generate a production-ready build:
```bash
npm run build
```
The optimized files will be placed in the `dist` folder.

## 🎨 Design System

TaskFlow utilizes a custom design system mapped via CSS Variables (found in `index.css`). It prioritizes:
- **Vibrant yet soft colors** (purple and indigo accents)
- **High-contrast typography** (Inter font family)
- **Micro-animations** for every interaction to ensure the app feels responsive and alive.
