import React, { useState } from 'react';
import { TaskInput } from './components/TaskInput.tsx';
import { TaskList } from './components/TaskList.tsx';
import { Task, TaskFilter } from './types.ts';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('active');

  const handleAddTask = (
    name: string,
    deadline?: string,
    importance?: number,
    effort?: number
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      name,
      deadline,
      importance,
      effort,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div id="app-root" className="min-h-screen bg-stone-100/70 text-stone-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Work Task Prioritizer
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Enter task names below to build your task list.
          </p>
        </header>

        <TaskInput onAddTask={handleAddTask} />

        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}
