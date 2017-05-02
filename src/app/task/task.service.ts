import { Injectable, EventEmitter } from '@angular/core';
import { Task } from './task.model';

const TASKS_STORAGE_KEY = 'tasks';

@Injectable()
export class TaskService {

    private tasks: Task[];
    private dataChanged: EventEmitter<Task[]> = new EventEmitter();
    private taskCreated: EventEmitter<Task> = new EventEmitter();
    private taskDeleted: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.tasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY));

        if (!this.tasks) { //Init tasks lists when 'never' used before
            this.tasks = [
                new Task({ id: 1, title: 'Create a module' }),
                new Task({ id: 2, title: 'Create a component' }),
                new Task({ id: 3, title: 'Create a service' }),
                new Task({ id: 4, title: 'Make all the things work together' }),
                new Task({ id: 5, title: 'Enjoy :)' }),
            ];

            this.persist();
        }
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

    getTaskDeletedEmitter() {
        return this.taskDeleted;
    }

    persist(tasks?: Task[]) {
        tasks = tasks || this.tasks;
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
}
