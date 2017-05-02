import { Component, OnInit, OnDestroy, SimpleChange, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { Subscriber } from "rxjs/Subscriber";

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
    private taskForm: FormGroup;
    private tasks: Task[];
    private notificationMessage: string;
    private dataChangeSubscriber: any;
    private taskCreateSubscriber: any;
    private taskUpdateSubscriber: any;
    private taskDeleteSubscriber: any;

    constructor(
        private formBuilder: FormBuilder,
        private service: TaskService
    ) {
        this.createForm();
    }

    ngOnInit() {
        this.service.getAll().then((tasks: Task[]) => this.tasks = tasks);
        this.dataChangeSubscriber = this.service.getDataChangedEmitter().subscribe(tasks => this.tasks = tasks);
        this.taskCreateSubscriber = this.service.getTaskCreatedEmitter().subscribe(task => this.notificationMessage = `Task <b>${task.title}</b> successfully created.`);
        this.taskUpdateSubscriber = this.service.getTaskUpdatedEmitter().subscribe(task => this.notificationMessage = `Task <b>${task.title}</b> successfully updated.`);
        this.taskDeleteSubscriber = this.service.getTaskDeletedEmitter().subscribe(id => this.notificationMessage = `Task <b>#${id}</b> successfully deleted.`);
    }

    ngOnDestroy() {
        this.dataChangeSubscriber.unsubscribe();
        this.taskCreateSubscriber.unsubscribe();
        this.taskUpdateSubscriber.unsubscribe();
        this.taskDeleteSubscriber.unsubscribe();
    }

    onSubmit(e) {
        if (e) e.preventDefault()
        let task = this.taskForm.value;
        task['id'] = new Date().valueOf(); //Generate unique id (timestamp)

        this.service.add(new Task(this.taskForm.value));
        this.taskForm.reset();
    }

    onChange() {
        console.log('onChange');
        this.service.persist();
    }

    delete(task: Task) {
        this.service.delete(task.id);
    }

    private createForm() {
        this.taskForm = this.formBuilder.group({
            title: ['', Validators.required]
        });
    }
}
