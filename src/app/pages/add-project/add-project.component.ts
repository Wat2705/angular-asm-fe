import { HttpClient } from '@angular/common/http';
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
import dayjs from 'dayjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzInputNumberModule,
    FormsModule,
    NzNotificationModule
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})

export class AddProjectComponent {
  validateForm: FormGroup<{
    projectName: FormControl<string>;
    datePicker: FormControl<string>;
    teamSize: FormControl<number>;
    price: FormControl<string>;
    desc: FormControl<string>;
  }>;

  submitForm(): void {
    this.http.post('http://localhost:3000/project', {
      name: this.validateForm.value.projectName,
      startDate: dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD'),
      teamSize: this.validateForm.value.teamSize,
      price: this.validateForm.value.price,
      description: this.validateForm.value.desc
    }).subscribe(
      (res: any) => {
        if (res.message == 'ok') {
          this.notification.create('success', 'Tạo thành công!', '', { nzDuration: 1000 });
          this.router.navigate(['/home'])
        }
      },
      (err: any) => {
        this.notification.create('error', err.error.message, '', { nzDuration: 1000 });
      }
    )
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private http: HttpClient,
    private router: Router,
    private notification: NzNotificationService
  ) {
    this.validateForm = this.fb.group({
      projectName: ['', [Validators.required]],
      datePicker: ['', [Validators.required]],
      teamSize: [1, [Validators.min(1), Validators.max(10)]],
      price: ['', [Validators.required]],
      desc: ['']
    });
  }
}
