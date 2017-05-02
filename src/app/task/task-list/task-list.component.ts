import { Component, OnInit, OnDestroy, SimpleChange, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

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
    private dataChangeSubscriber: any;
    private taskCreateSubscriber: any;
    private taskDeleteSubscriber: any;

    constructor(
        private formBuilder: FormBuilder,
        private service: TaskService,
        private snackBar: MdSnackBar
    ) {
        this.createForm();
    }

    ngOnInit() {
        this.service.getAll().then((tasks: Task[]) => this.tasks = tasks);
        this.dataChangeSubscriber = this.service.getDataChangedEmitter().subscribe(tasks => this.tasks = tasks);
        this.taskCreateSubscriber = this.service.getTaskCreatedEmitter().subscribe(task => this.openSnackBar('Task successfully created.'));
        this.taskDeleteSubscriber = this.service.getTaskDeletedEmitter().subscribe(id => this.openSnackBar('Task successfully deleted.'));
    }

    ngOnDestroy() {
        this.dataChangeSubscriber.unsubscribe();
        this.taskCreateSubscriber.unsubscribe();
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

    private openSnackBar(message: string, action?: string) {
        this.snackBar.open(message, action, {
            duration: 4000,
        });
    }
}
