import { HttpClient } from '@angular/common/http';
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
import dayjs from 'dayjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-edit-project',
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
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})

export class EditProjectComponent {
  @Input() id = ''
  project: any

  validateForm: FormGroup<{
    projectName: FormControl<string>;
    datePicker: FormControl<any>;
    teamSize: FormControl<number>;
    price: FormControl<string>;
    desc: FormControl<string>;
  }>;

  submitForm(): void {
    if (
      this.validateForm.value.projectName?.trim() != this.project.name ||
      dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD') != this.project.startDate ||
      this.validateForm.value.teamSize != this.project.teamSize ||
      this.validateForm.value.price != this.project.price
    ) {
      this.http.put(`http://localhost:3000/project/${this.id}`, {
        name: this.validateForm.value.projectName?.trim(),
        startDate: dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD'),
        teamSize: this.validateForm.value.teamSize,
        price: this.validateForm.value.price,
        description: this.validateForm.value.desc
      }).subscribe((res: any) => {
        if (res.message == 'ok') {
          this.notification.create('success', `Sửa thành công!`, '', { nzDuration: 1000 });
          this.router.navigate(['/home'])
        }
      })
    } else {
      this.notification.create('error', `Không có thông tin nào bị thay đổi!`, '', { nzDuration: 1000 });
    }
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

  ngOnInit(): void {
    this.http.get(`http://localhost:3000/project/${this.id}`).subscribe((res: any) => {
      this.project = res
      this.validateForm.get('projectName')?.setValue(res.name)
      this.validateForm.get('datePicker')?.setValue(new Date(res.startDate))
      this.validateForm.get('teamSize')?.setValue(res.teamSize)
      this.validateForm.get('price')?.setValue(res.price)
      this.validateForm.get('desc')?.setValue(res.description)
    })
  }
}
