import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API_URL = 'http://localhost:3000/api';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/tasks`).pipe(
      tap((tasks) => this.tasksSubject.next(tasks))
    );
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/tasks`, task).pipe(
      tap((newTask) => {
        const current = this.tasksSubject.value;
        this.tasksSubject.next([...current, newTask]);
      })
    );
  }

  updateTask(id: string, updates: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/tasks/${id}`, updates).pipe(
      tap((updatedTask) => {
        const current = this.tasksSubject.value;
        const index = current.findIndex((t) => t.id === id);
        if (index !== -1) {
          current[index] = updatedTask;
          this.tasksSubject.next([...current]);
        }
      })
    );
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/tasks/${id}`).pipe(
      tap(() => {
        const current = this.tasksSubject.value;
        this.tasksSubject.next(current.filter((t) => t.id !== id));
      })
    );
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }
}
