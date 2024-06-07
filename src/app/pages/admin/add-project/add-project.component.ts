import { CommonModule } from '@angular/common';
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { ProjectService } from '@/app/project.service';

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
    NzNotificationModule,
    NzUploadModule,
    NzIconModule,
    CommonModule
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})

export class AddProjectComponent {
  avatarUrl?: string = '';
  fileData?: any;

  validateForm: FormGroup<{
    projectName: FormControl<string>;
    datePicker: FormControl<string>;
    teamSize: FormControl<number>;
    price: FormControl<string>;
    desc: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private service: ProjectService,
    private router: Router,
    private notification: NzNotificationService,
    private http: HttpClient
  ) {
    this.validateForm = this.fb.group({
      projectName: ['', [Validators.required]],
      datePicker: ['', [Validators.required]],
      teamSize: [1, [Validators.min(1), Validators.max(10)]],
      price: ['', [Validators.required]],
      desc: [''],
    });
  }

  submitForm(): void {
    if (this.avatarUrl != '') {
      let formData = new FormData();
      formData.append('image', this.fileData)
      this.http.post('http://localhost:3000/image', formData).subscribe((res: any) => {
        this.service.create(
          this.validateForm.value.projectName,
          dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD'),
          this.validateForm.value.teamSize,
          this.validateForm.value.price,
          this.validateForm.value.desc,
          res['id']
        ).subscribe(
          (res: any) => {
            if (res.message == 'ok') {
              this.notification.create('success', 'Tạo thành công!', '', { nzDuration: 1000 });
              this.router.navigate(['/admin/home'])
            }
          },
          (err: any) => {
            this.notification.create('error', err.error.message, '', { nzDuration: 1000 });
          }
        )
      })
    } else {
      this.service.create(
        this.validateForm.value.projectName,
        dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD'),
        this.validateForm.value.teamSize,
        this.validateForm.value.price,
        this.validateForm.value.desc,
        null
      ).subscribe(
        (res: any) => {
          if (res.message == 'ok') {
            this.notification.create('success', 'Tạo thành công!', '', { nzDuration: 1000 });
            this.router.navigate(['/admin/home'])
          }
        },
        (err: any) => {
          this.notification.create('error', err.error.message, '', { nzDuration: 1000 });
        }
      )
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  private getBase64(img: any, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.getBase64(file, (img: string) => {
      this.avatarUrl = img;
      this.fileData = file;
    });
    return false;
  };

  handleRemove = (): any => {
    this.avatarUrl = ''
    this.fileData = null
  }
}
