import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzNotificationModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  passwordVisible = false;
  password?: string;

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.rePassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  validateForm: FormGroup<{
    userName: FormControl<string>;
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    rePassword: FormControl<string>;
    role: FormControl<any>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rePassword: ['', [Validators.required, this.confirmationValidator]],
    role: [null, [Validators.required]]
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.auth.register(this.validateForm.value).subscribe((res: any) => {
        this.notification.create('success', res.message, 'Tài khoản của bạn đã được đăng ký thành công! Vui lòng đăng nhập!');
        this.router.navigate(['/auth/login'])
      }, (err) => {
        this.notification.create('error', 'Lỗi', err.error.message);
      })
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
