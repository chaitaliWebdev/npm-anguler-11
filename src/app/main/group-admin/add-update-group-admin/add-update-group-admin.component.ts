import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-add-update-group-admin',
  templateUrl: './add-update-group-admin.component.html',
  styleUrls: ['./add-update-group-admin.component.scss']
})
export class AddUpdateGroupAdminComponent implements OnInit {

  groupAdminForm: FormGroup;
  idForUpdate = '';
  buttonLoading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.groupAdminForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null],
      password: ['', [Validators.required]],
      rePassword: ['', [Validators.required, this.confirmationValidator]],
    });
  }

  ngOnInit(): void {
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    if (this.idForUpdate) {
      this.getServiceById();
    }
  }

  /**
   * get service by id
   */
   getServiceById(): void {
    this.httpRequestService
    .request('get', `users/admins/${this.idForUpdate}`)
    .subscribe(
      (result: any) => {
        this.groupAdminForm.patchValue(result.data);
      }, err => {

      });
   }

   /* Submit service form */
   submit(): void {
    if (!this.groupAdminForm.valid) {
      this.markFormGroupTouched(this.groupAdminForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateService(
          'put',
          `users/admins/${this.idForUpdate}`,
          'Service Successfully Updated'
        );
      } else {
        this.addOrUpdateService(
          'post',
          'users/admins',
          'Service Added Successfully '
        );
      }
    }
  }

  /* Add Or Edit service */
  addOrUpdateService(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.groupAdminForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/group-admin');
          this.buttonLoading = false;
        },
        (error: any) => {
          if (error.error.errors) {
            const allErrors: string[] = Object.values(error.error.errors);
            for (const err of allErrors) {
              this.notificationService.error('', err);
            }
          }else {
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
      this.groupAdminForm.controls.rePassword.updateValueAndValidity()
    );
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.groupAdminForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }
}
