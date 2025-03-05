import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-add-update-service',
  templateUrl: './add-update-service.component.html',
  styleUrls: ['./add-update-service.component.scss']
})
export class AddUpdateServiceComponent implements OnInit {
  serviceForm: FormGroup;
  idForUpdate = '';
  buttonLoading = false;
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.serviceForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
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
    .request('get', `services/${this.idForUpdate}`)
    .subscribe(
      (result: any) => {
        this.serviceForm.patchValue(result.data);
      }, err => {

      });
   }

   /* Submit service form */
   submit(): void {
    if (!this.serviceForm.valid) {
      this.markFormGroupTouched(this.serviceForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateService(
          'put',
          `services/${this.idForUpdate}`,
          'Service Successfully Updated'
        );
      } else {
        this.addOrUpdateService(
          'post',
          'services',
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
      .request(requestMethod, requestURL, this.serviceForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/service');
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

}
