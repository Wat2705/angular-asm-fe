import { jwtDecode } from 'jwt-decode';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzNotificationModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  passwordVisible = false;
  password?: string;

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.auth.logIn(this.validateForm.value).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token)
          this.notification.create('success', 'Thành công!', res.message, { nzDuration: 1000 });
          let token: any = localStorage.getItem('token')
          let decoded: any = jwtDecode(token)
          if (decoded['role'] == 'nhanvien') {
            this.router.navigate(['/staff/home'])
          } else if (decoded['role'] == 'leader') {
            this.router.navigate(['/admin/home'])
          }
        },
        (err) => {
          this.notification.create('error', 'Lỗi!', err.error.message, { nzDuration: 1000 });
        }
      )
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private notification: NzNotificationService,
    private router: Router
  ) { }
}
