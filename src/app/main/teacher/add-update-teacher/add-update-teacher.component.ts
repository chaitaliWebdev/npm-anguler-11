import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-add-update-teacher',
  templateUrl: './add-update-teacher.component.html',
  styleUrls: ['./add-update-teacher.component.scss'],
})
export class AddUpdateTeacherComponent implements OnInit {
  teacherAddUpdateForm: FormGroup;
  idForUpdate = '';
  buttonLoading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  subjectList: any;
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.teacherAddUpdateForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null],
      password: ['', [Validators.required]],
      rePassword: ['', [Validators.required, this.confirmationValidator]],
      subjects: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    if (this.idForUpdate) {
      this.getTeacherById();
    }
  }

  /**
   * get teacher by id
   */
  getTeacherById(): void {
    this.httpRequestService
      .request('get', `users/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          console.log(result.data);
          this.teacherAddUpdateForm.patchValue(result.data);

          this.teacherAddUpdateForm.removeControl('password');
          this.teacherAddUpdateForm.removeControl('rePassword');
        },
        (err) => {}
      );
  }

  /* Submit teacher form */
  submit(): void {
    if (!this.teacherAddUpdateForm.valid) {
      console.log('in');
      this.markFormGroupTouched(this.teacherAddUpdateForm);
    } else {
      if (this.idForUpdate) {
        console.log(this.teacherAddUpdateForm.value);
        this.addOrUpdateTeacher(
          'put',
          `users/${this.idForUpdate}`,
          'Teacher Successfully Updated'
        );
      } else {
        this.addOrUpdateTeacher(
          'post',
          'users/teachers',
          'Teacher Added Successfully '
        );
      }
    }
  }

  /* Add Or Edit teacher */
  addOrUpdateTeacher(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.teacherAddUpdateForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/teacher');
          this.buttonLoading = false;
        },
        (error: any) => {
          if (error.error.errors) {
            const allErrors: string[] = Object.values(error.error.errors);
            for (const err of allErrors) {
              this.notificationService.error('', err);
            }
          } else {
            this.notificationService.error('', error.error.message);
          }
          this.buttonLoading = false;
        }
      );
  }

  /* Make All Form Controls Dirty */
  private markFormGroupTouched(formGroup: FormGroup): void {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }

  /** For Re-check Password */

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.teacherAddUpdateForm.controls.rePassword.updateValueAndValidity()
    );
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (
      control.value !== this.teacherAddUpdateForm.controls.password.value
    ) {
      return { confirm: true, error: true };
    }
    return {};
  }
}
