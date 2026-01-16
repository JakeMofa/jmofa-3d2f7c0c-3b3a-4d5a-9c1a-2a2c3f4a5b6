import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { AuthService, User } from '../services/auth.service';
import { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentUser: User | null = null;
  
  // Modal state
  showModal = false;
  editingTask: Task | null = null;
  modalTitle = '';
  modalDescription = '';
  modalCategory = 'general';
  modalStatus: TaskStatus = TaskStatus.TODO;
  
  // Filter/sort state
  filterCategory = '';
  filterStatus = '';
  sortBy: 'createdAt' | 'orderIndex' | 'title' = 'orderIndex';
  
  categories = ['general', 'work', 'personal', 'urgent'];
  statuses = Object.values(TaskStatus);
  
  // Group tasks by status
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  
  TaskStatus = TaskStatus;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.loadTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (err) => console.error('Error loading tasks:', err),
    });
  }

  applyFilters(): void {
    let filtered = [...this.tasks];
    
    // Filter by category
    if (this.filterCategory) {
      filtered = filtered.filter(t => t.category === this.filterCategory);
    }
    
    // Filter by status
    if (this.filterStatus) {
      filtered = filtered.filter(t => t.status === this.filterStatus);
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (this.sortBy === 'orderIndex') {
        return a.orderIndex - b.orderIndex;
      } else if (this.sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    
    this.filteredTasks = filtered;
    this.groupTasksByStatus();
  }

  groupTasksByStatus(): void {
    this.todoTasks = this.filteredTasks.filter(t => t.status === TaskStatus.TODO);
    this.inProgressTasks = this.filteredTasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
    this.doneTasks = this.filteredTasks.filter(t => t.status === TaskStatus.DONE);
  }

  openCreateModal(): void {
    this.editingTask = null;
    this.modalTitle = '';
    this.modalDescription = '';
    this.modalCategory = 'general';
    this.modalStatus = TaskStatus.TODO;
    this.showModal = true;
  }

  openEditModal(task: Task): void {
    this.editingTask = task;
    this.modalTitle = task.title;
    this.modalDescription = task.description || '';
    this.modalCategory = task.category;
    this.modalStatus = task.status;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingTask = null;
  }

  saveTask(): void {
    if (!this.modalTitle.trim()) {
      return;
    }

    if (this.editingTask) {
      // Update existing task
      const updates: UpdateTaskDto = {
        title: this.modalTitle,
        description: this.modalDescription,
        category: this.modalCategory,
        status: this.modalStatus,
      };
      
      this.taskService.updateTask(this.editingTask.id, updates).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => console.error('Error updating task:', err),
      });
    } else {
      // Create new task
      const newTask: CreateTaskDto = {
        title: this.modalTitle,
        description: this.modalDescription,
        category: this.modalCategory,
        status: this.modalStatus,
      };
      
      this.taskService.createTask(newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => console.error('Error creating task:', err),
      });
    }
  }

  deleteTask(task: Task): void {
    if (confirm(`Delete task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Error deleting task:', err),
      });
    }
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    const task = event.item.data;
    
    if (event.previousContainer === event.container) {
      // Reorder within same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move to different column - update status
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update task status on backend
      this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
        next: () => this.loadTasks(),
        error: (err) => {
          console.error('Error updating task status:', err);
          this.loadTasks(); // Reload to revert UI
        },
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusLabel(status: TaskStatus): string {
    return status.replace('_', ' ').toUpperCase();
  }
}
