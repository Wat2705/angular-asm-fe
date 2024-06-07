import { ProjectService } from '@/app/pages/admin/project.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

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
    NzNotificationModule,
    CommonModule,
    NzUploadModule,
    NzIconModule,
    HttpClientModule
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})

export class EditProjectComponent {
  @Input() id = '';
  project: any;
  avatarUrl?: string = '';
  fileData?: any;
  imageChange: boolean = false;
  oldImageID: string = '';

  validateForm: FormGroup<{
    projectName: FormControl<string>;
    datePicker: FormControl<any>;
    teamSize: FormControl<number>;
    price: FormControl<string>;
    desc: FormControl<string>;
  }>;

  toDataURL(url: string, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  submitForm(): void {
    if (
      this.validateForm.value.projectName?.trim() != this.project.name ||
      dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD') != this.project.startDate ||
      this.validateForm.value.teamSize != this.project.teamSize ||
      this.validateForm.value.price != this.project.price ||
      this.imageChange
    ) {
      if (this.avatarUrl != '' && this.imageChange) {
        let formData = new FormData();
        formData.append('image', this.fileData)
        this.service.uploadImage(formData).subscribe((res: any) => {
          this.service.edit(
            this.id,
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
      } else if (this.avatarUrl == '' && this.imageChange) {
        this.service.edit(
          this.id,
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
      } else {
        this.service.edit(
          this.id,
          this.validateForm.value.projectName,
          dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD'),
          this.validateForm.value.teamSize,
          this.validateForm.value.price,
          this.validateForm.value.desc,
          this.oldImageID
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
    private router: Router,
    private notification: NzNotificationService,
    private service: ProjectService,
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
    this.service.getOne(this.id).subscribe((res: any) => {
      this.oldImageID = res?.image?._id
      this.project = res
      this.validateForm.get('projectName')?.setValue(res.name)
      this.validateForm.get('datePicker')?.setValue(new Date(res.startDate))
      this.validateForm.get('teamSize')?.setValue(res.teamSize)
      this.validateForm.get('price')?.setValue(res.price)
      this.validateForm.get('desc')?.setValue(res.description)
      if (res?.image?.path != undefined) {
        this.toDataURL(`http://localhost:3000/${res.image.path}`, (dataUrl: any) => {
          this.avatarUrl = dataUrl
        })
      }
    })
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
      this.imageChange = true
    });
    return false;
  };

  handleRemove = (): any => {
    this.avatarUrl = ''
    this.fileData = null
    this.imageChange = true
  }
}
