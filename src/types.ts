export type TaskFilter = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  name: string;
  deadline?: string;
  importance?: number;
  effort?: number;
  completed: boolean;
}

