import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ConfigurationService, HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-add-update-chat-group',
  templateUrl: './add-update-chat-group.component.html',
  styleUrls: ['./add-update-chat-group.component.scss'],
})
export class AddUpdateChatGroupComponent implements OnInit {
  chatGroupForm: FormGroup;
  idForUpdate = '';
  buttonLoading = false;
  subAdmins: any[] = [];
  loading = false;
  avatarUrl?: string;
  mediaUploadUrl?: string;
  topics?: any[];
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private cofigurationService: ConfigurationService
  ) {
    this.chatGroupForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null],
      subAdmins: [[]],
      logo: [''],
      topics: [[]]
    });
  }

  ngOnInit(): void {
    this.mediaUploadUrl = this.cofigurationService.apiUrl + '/api/media';
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    if (this.idForUpdate) {
      this.getChatGroupById();
    }
    this.getSubAdmins();
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]) =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size ? file.size / 1024 / 1024 < 4 : false;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 4MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    })

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result ? reader.result.toString() : ''));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.

        this.chatGroupForm.patchValue({
          logo: info.file.response.data._id,
        });
        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (img: string) => {
            this.loading = false;
            this.avatarUrl = img;
          });
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
  /**
   * get chat group by id
   */
  getChatGroupById(): void {
    this.httpRequestService
      .request('get', `chat-groups/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          this.chatGroupForm.patchValue({...result.data, logo: result.data.logo?._id});
          this.avatarUrl = result.data.logo && this.cofigurationService.mediaBaseUrl + result.data.logo.path;
        },
        (err) => {}
      );
  }

  getSubAdmins(): void {
    this.httpRequestService.request('get', `users/admins`).subscribe(
      (result: any) => {
        this.subAdmins = result.data;
        console.log(this.subAdmins);
      },
      (err) => {}
    );
  }

  /* Submit service form */
  submit(): void {
    if (!this.chatGroupForm.valid) {
      this.markFormGroupTouched(this.chatGroupForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateService(
          'put',
          `chat-groups/${this.idForUpdate}`,
          'Chat Groups Successfully Updated'
        );
      } else {
        this.addOrUpdateService(
          'post',
          'chat-groups',
          'Chat Groups Added Successfully '
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
      .request(requestMethod, requestURL, this.chatGroupForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/chat-group');
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
