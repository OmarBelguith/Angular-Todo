import { Injectable, EventEmitter } from '@angular/core';
import { Task } from './task.model';

const TASKS_STORAGE_KEY = 'tasks';

@Injectable()
export class TaskService {

    private tasks: Task[];
    private dataChanged: EventEmitter<Task[]> = new EventEmitter();
    private taskCreated: EventEmitter<Task> = new EventEmitter();
    private taskUpdated: EventEmitter<Task> = new EventEmitter();
    private taskDeleted: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.tasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
    }

    getAll() {
        return new Promise((resolve, reject) => {
            resolve(this.tasks);
        });
    }

    getOne(id: number) {
        this.tasks.forEach(task => {
            if (task.id === id) {
                return task;
            }
        });

        return null;
    }

    add(task: Task) {
        this.tasks.push(task);
        this.persist();

        this.dataChanged.emit(this.tasks);
        this.taskCreated.emit(task);
    }

    update(task: Task) {
        this.tasks.forEach(storedTask => {
            if (storedTask.id === task.id) {
                let index = this.tasks.indexOf(storedTask);
                delete this.tasks[index];

                this.tasks[index] = task;
                this.persist();
            }
        });

        this.dataChanged.emit(this.tasks);
        this.taskUpdated.emit(task);
    }

    delete(id: number) {
        this.tasks.forEach(task => {
            if (task.id === id) {
                let index = this.tasks.indexOf(task);
                this.tasks.splice(index, 1);
                this.persist();
            }
        });

        this.dataChanged.emit(this.tasks);
        this.taskDeleted.emit(id);
    }

    getDataChangedEmitter() {
        return this.dataChanged;
    }

    getTaskCreatedEmitter() {
        return this.taskCreated;
    }

    getTaskUpdatedEmitter() {
        return this.taskUpdated;
    }

    getTaskDeletedEmitter() {
        return this.taskDeleted;
    }

    persist(tasks?: Task[]) {
        tasks = tasks || this.tasks;
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
}
