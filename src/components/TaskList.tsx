import React from 'react';
import { Task, TaskFilter } from '../types.ts';

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onToggleComplete: (id: string) => void;
}

function getDeadlineInfo(deadlineStr?: string) {
  if (!deadlineStr) return null;
  const parts = deadlineStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const deadlineDate = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formattedDate = deadlineDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: deadlineDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });

  let relativeText = '';
  let status: 'overdue' | 'today' | 'on-track' = 'on-track';

  if (diffDays < 0) {
    const overdue = Math.abs(diffDays);
    relativeText = `${overdue} ${overdue === 1 ? 'day' : 'days'} overdue`;
    status = 'overdue';
  } else if (diffDays === 0) {
    relativeText = 'Due today';
    status = 'today';
  } else {
    relativeText = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`;
    status = 'on-track';
  }

  return {
    formattedDate,
    relativeText,
    status,
  };
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onFilterChange,
  onToggleComplete,
}) => {
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const allCount = tasks.length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div id="task-list-section" className="space-y-3">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div id="filter-tabs" className="flex gap-1 p-0.5 bg-stone-200/70 rounded-lg text-xs font-medium">
          <button
            id="filter-tab-active"
            type="button"
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'active'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            id="filter-tab-completed"
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'completed'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            id="filter-tab-all"
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({allCount})
          </button>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Task List / Empty State */}
      {filteredTasks.length === 0 ? (
        <div
          id="empty-task-list"
          className="bg-white rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-500 text-sm"
        >
          {filter === 'active' && (
            <span>No active tasks. All tasks are completed or none have been added.</span>
          )}
          {filter === 'completed' && (
            <span>No completed tasks yet. Check a task's box to mark it as completed.</span>
          )}
          {filter === 'all' && (
            <span>No tasks added yet. Enter a task name above and click "Add Task".</span>
          )}
        </div>
      ) : (
        <ul id="task-list" className="space-y-2">
          {filteredTasks.map((task, index) => {
            const deadlineInfo = getDeadlineInfo(task.deadline);

            return (
              <li
                key={task.id}
                id={`task-item-${task.id}`}
                className={`flex items-center gap-3 p-3.5 bg-white rounded-xl border transition-colors shadow-xs text-sm ${
                  task.completed
                    ? 'border-stone-200/80 bg-stone-50/70 text-stone-400'
                    : 'border-stone-200 text-stone-900'
                }`}
              >
                <input
                  id={`task-checkbox-${task.id}`}
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 cursor-pointer shrink-0"
                  aria-label={`Mark "${task.name}" as ${task.completed ? 'active' : 'completed'}`}
                />
                <span className="text-xs font-mono text-stone-400 select-none w-5 text-right">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                  <span
                    id={`task-name-${task.id}`}
                    className={`font-medium break-words ${
                      task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {task.name}
                  </span>

                  {task.importance !== undefined && (
                    <span
                      id={`task-importance-${task.id}`}
                      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border font-medium ${
                        task.completed
                          ? 'bg-stone-50 text-stone-400 border-stone-200'
                          : task.importance >= 4
                          ? 'bg-orange-50 text-orange-800 border-orange-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      Importance: {task.importance}/5
                    </span>
                  )}

                  {task.effort !== undefined && (
                    <span
                      id={`task-effort-${task.id}`}
                      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border font-medium ${
                        task.completed
                          ? 'bg-stone-50 text-stone-400 border-stone-200'
                          : task.effort >= 4
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      Effort: {task.effort}/5
                    </span>
                  )}

                  {deadlineInfo && (
                    <span
                      id={`task-deadline-${task.id}`}
                      className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md border font-medium ${
                        task.completed
                          ? 'bg-stone-50 text-stone-400 border-stone-200'
                          : deadlineInfo.status === 'overdue'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                          : deadlineInfo.status === 'today'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                      }`}
                    >
                      <span
                        className={
                          task.completed
                            ? 'text-stone-400 font-normal'
                            : deadlineInfo.status === 'on-track'
                            ? 'text-emerald-700 font-normal'
                            : 'text-stone-500 font-normal'
                        }
                      >
                        Due {deadlineInfo.formattedDate}
                      </span>
                      <span>&bull;</span>
                      <span>{deadlineInfo.relativeText}</span>
                    </span>
                  )}
                </div>

                {task.completed && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-500 border border-stone-200/60 select-none shrink-0">
                    Completed
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
