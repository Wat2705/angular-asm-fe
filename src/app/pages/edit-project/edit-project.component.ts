import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
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
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { ProjectService } from '../../project.service';


function resizeBase64Image(base64Image: any, type: any) {
  return new Promise((resolve, reject) => {
    const maxSizeInMB = 1;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const img = new Image();
    img.src = base64Image;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext('2d');
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;
      const newWidth = Math.sqrt(maxSizeInBytes * aspectRatio);
      const newHeight = Math.sqrt(maxSizeInBytes / aspectRatio);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      let quality = 0.8;
      let dataURL = canvas.toDataURL(type, quality);
      resolve(dataURL);
    };
  });
}

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
    NzIconModule
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})

export class EditProjectComponent {
  @Input() id = '';
  @ViewChild('uploadImage') uploadImage: any;
  project: any;
  imageUrl: any = '';
  fileList: NzUploadFile[] = [];
  previewImage: any = false;

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
      if (this.previewImage) {
        this.http.post('http://localhost:3000/image', {
          name: this.fileList[0].name,
          base64: this.imageUrl
        }).subscribe((res: any) => {
          this.service.edit(
            this.id,
            this.validateForm.value.projectName,
            dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD'),
            this.validateForm.value.price,
            this.validateForm.value.teamSize,
            this.validateForm.value.desc,
            res['id']
          ).subscribe(
            (res: any) => {
              if (res.message == 'ok') {
                this.notification.create('success', 'Sửa thành công!', '', { nzDuration: 1000 });
                this.router.navigate(['/home'])
              }
            },
            (err: any) => {
              this.notification.create('error', err.error.message, '', { nzDuration: 1000 });
            }
          )
        })
      } else {
        this.service.edit(
          this.id,
          this.validateForm.value.projectName,
          dayjs(this.validateForm.value.datePicker).format('YYYY-MM-DD'),
          this.validateForm.value.price,
          this.validateForm.value.teamSize,
          this.validateForm.value.desc,
        ).subscribe(
          (res: any) => {
            if (res.message == 'ok') {
              this.notification.create('success', 'Sửa thành công!', '', { nzDuration: 1000 });
              this.router.navigate(['/home'])
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
    private http: HttpClient,
    private router: Router,
    private notification: NzNotificationService,
    private service: ProjectService
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
      if (res?.image?.base64 != undefined) {
        setTimeout(() => {
          this.uploadImage.nativeElement.src = res.image.base64;
        }, 1)
        // this.fileList
        this.imageUrl = res.image.base64;
        this.previewImage = true;
      }
    })
  }

  private getBase64(img: any, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file]
    this.previewImage = true
    this.getBase64(file, (img: string) => {
      resizeBase64Image(img, file.type).then(data => {
        this.uploadImage.nativeElement.src = data;
        this.imageUrl = data
      })
    })
    return false;
  };

  handleRemove = (): any => {
    this.fileList = [];
    this.previewImage = false
  }
}
