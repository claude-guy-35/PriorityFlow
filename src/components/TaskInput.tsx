import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (
    name: string,
    deadline?: string,
    importance?: number,
    effort?: number
  ) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [importance, setImportance] = useState<number>(3);
  const [effort, setEffort] = useState<number>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = taskName.trim();
    if (!trimmed) return;
    onAddTask(trimmed, deadline || undefined, importance, effort);
    setTaskName('');
    setDeadline('');
    setImportance(3);
    setEffort(3);
  };

  return (
    <form
      id="task-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-stone-200 shadow-xs p-4 mb-6"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="task-name-input"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5"
          >
            Task Name
          </label>
          <input
            id="task-name-input"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter a task name..."
            autoFocus
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-colors"
          />
        </div>

        <div className="shrink-0">
          <label
            htmlFor="task-deadline-input"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5"
          >
            Deadline
          </label>
          <input
            id="task-deadline-input"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-colors cursor-pointer"
          />
        </div>

        <div className="shrink-0">
          <label
            htmlFor="task-importance-input"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5"
          >
            Importance
          </label>
          <select
            id="task-importance-input"
            value={importance}
            onChange={(e) => setImportance(Number(e.target.value))}
            className="w-full sm:w-auto px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-colors cursor-pointer"
          >
            <option value={1}>1 (Lowest)</option>
            <option value={2}>2 (Low)</option>
            <option value={3}>3 (Medium)</option>
            <option value={4}>4 (High)</option>
            <option value={5}>5 (Highest)</option>
          </select>
        </div>

        <div className="shrink-0">
          <label
            htmlFor="task-effort-input"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5"
          >
            Effort
          </label>
          <select
            id="task-effort-input"
            value={effort}
            onChange={(e) => setEffort(Number(e.target.value))}
            className="w-full sm:w-auto px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-colors cursor-pointer"
          >
            <option value={1}>1 (Lowest / Quick)</option>
            <option value={2}>2 (Low)</option>
            <option value={3}>3 (Medium)</option>
            <option value={4}>4 (High)</option>
            <option value={5}>5 (Highest / Heavy)</option>
          </select>
        </div>

        <button
          id="add-task-button"
          type="submit"
          disabled={!taskName.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </form>
  );
};
