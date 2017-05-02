import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { TaskListComponent } from './task-list/task-list.component';
import { TaskService } from './task.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [TaskListComponent],
    exports: [TaskListComponent],
    providers: [TaskService]
})
export class TaskModule { }
