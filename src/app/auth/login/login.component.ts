import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService, HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  isLoading = false;
  mobile = '';
  otp = '';
  otpRequestLoading = false;
  isOTPRequestSend = false;
  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private authService: AuthService,
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }

  submitOtpForm(): void {
    this.otpRequestLoading = true;
    this.httpRequestService
        .request('post', 'auth/login-generate-otp', { mobile: '+91' + this.mobile })
        .subscribe(
          (success) => {
            const loginResponse = success.data;
            this.isOTPRequestSend = true;
            this.otpRequestLoading = false;
          },
          (error) => {
           this.otpRequestLoading = false;

          }
        );
  }

  submitLoginForm(): void {
    // if (!this.loginForm.valid) {
    //   this.markFormGroupTouched(this.loginForm);
    // } else {
      this.isLoading = true;
      this.authService
        .login(`+91${this.mobile}`, this.otp)
        .then((success) => {
          this.notificationService.success('Success', 'Successfully Logged In');
          this.isLoading = false;

        })
        .catch((error) => {
          this.notificationService.error('Error', error.error.message);
          this.isLoading = false;
        });
    // }
  }
  private markFormGroupTouched(formGroup: FormGroup): void {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
