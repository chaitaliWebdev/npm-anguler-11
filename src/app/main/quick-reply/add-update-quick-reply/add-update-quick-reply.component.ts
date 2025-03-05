import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-add-update-quick-reply',
  templateUrl: './add-update-quick-reply.component.html',
  styleUrls: ['./add-update-quick-reply.component.scss'],
})
export class AddUpdateQuickReplyComponent implements OnInit {
  quickReplyForm: FormGroup;
  idForUpdate = '';
  buttonLoading = false;
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.quickReplyForm = this.fb.group({
      message: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    if (this.idForUpdate) {
      this.getQuickReplyById();
    }
  }

  /**
   * get quick reply by id
   */
  getQuickReplyById(): void {
    this.httpRequestService
      .request('get', `quick-replies/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          this.quickReplyForm.patchValue(result.data);
        },
        (err) => {}
      );
  }

  /* Submit quick reply form */
  submit(): void {
    if (!this.quickReplyForm.valid) {
      this.markFormGroupTouched(this.quickReplyForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateQuickReply(
          'put',
          `quick-replies/${this.idForUpdate}`,
          'Quick Reply Successfully Updated'
        );
      } else {
        this.addOrUpdateQuickReply(
          'post',
          'quick-replies',
          'Quick Reply Added Successfully '
        );
      }
    }
  }

  /* Add Or Edit quick reply */
  addOrUpdateQuickReply(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.quickReplyForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/quick-reply');
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
}
