import { AuthService } from '@/app/auth/auth.service';
import { ProjectService } from '@/app/project.service';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  selector: 'app-edit-task',
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
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent {
  listProject?: any = [];
  listDev?: any = [];
  oldTask: any;
  @Input() id = ''

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
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.project.getAll().subscribe(res => {
      this.listProject = res;
    })
    this.auth.getAllDev().subscribe(res => {
      this.listDev = res
    })
    this.task.getOne(this.id).subscribe(
      (res: any) => {
        this.oldTask = res
        this.validateForm.get('taskName')?.setValue(res.name);
        this.validateForm.get('desc')?.setValue(res.description);
        this.validateForm.get('projectID')?.setValue(res.project._id);
        this.validateForm.get('assign')?.setValue(res.assign._id);
        this.validateForm.get('priority')?.setValue(res.priority);
        this.validateForm.get('status')?.setValue(res.status);
      }
    )
  }

  submitForm(): void {
    if (
      this.validateForm.value.taskName?.trim() != this.oldTask.name ||
      this.validateForm.value.desc?.trim() != this.oldTask.description ||
      this.validateForm.value.projectID != this.oldTask.project._id ||
      this.validateForm.value.assign != this.oldTask.assign._id ||
      this.validateForm.value.priority != this.oldTask.priority ||
      this.validateForm.value.status != this.oldTask.status
    ) {
      this.task.edit(this.id, this.validateForm.value).subscribe(
        (res: any) => {
          if (res.message == 'ok') {
            this.notification.create('success', 'Thành công!', 'Sửa thành công!', { nzDuration: 1000 });
            this.router.navigate(['/staff/home'])
          }
        }
      )
    } else {
      this.notification.create('error', `Không có thông tin nào bị thay đổi!`, '', { nzDuration: 1000 });
    }

  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

}
