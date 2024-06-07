import { AuthService } from '@/app/auth/auth.service';
import { ProjectService } from '@/app/project.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzInputNumberModule,
    FormsModule,
    NzNotificationModule,
    NzUploadModule,
    NzIconModule,
    NzSelectModule,
    CommonModule
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  listProject?: any = [];
  listDev?: any = [];

  validateForm: FormGroup<{
    taskName: FormControl<string>;
    desc: FormControl<string>;
    projectID: FormControl<string>;
    assign: FormControl<string>;
    priority: FormControl<string>;
    status: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private project: ProjectService,
    private auth: AuthService,
    private task: TaskService,
    private router: Router,
    private notification: NzNotificationService,
  ) {
    this.validateForm = this.fb.group({
      taskName: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      projectID: ['', [Validators.required]],
      assign: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: [{ disabled: true, value: "Holding" }]
    });
  }

  ngOnInit(): void {
    this.project.getAll().subscribe(res => {
      this.listProject = res;
    })
    this.auth.getAllDev().subscribe(res => {
      this.listDev = res
    })
  }

  submitForm(): void {
    this.task.create(this.validateForm.value).subscribe(
      (res: any) => {
        if (res.message == 'ok') {
          this.notification.create('success', 'Tạo thành công!', '', { nzDuration: 1000 });
          this.router.navigate(['/staff/home'])
        }
      }
    )
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

}