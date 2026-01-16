export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: TaskStatus;
  orderIndex: number;
  orgId: string;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  category?: string;
  status?: TaskStatus;
  orderIndex?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  category?: string;
  status?: TaskStatus;
  orderIndex?: number;
}
