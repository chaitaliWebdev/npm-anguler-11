import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})
export class TeachersComponent implements OnInit {
  teachers: any[] = [];
  totalDataCount = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;
  searchTeachers: Subject<any> = new Subject<any>();
  search = '';
  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.searchTeachers.pipe(debounceTime(1000)).subscribe((success) => {
      this.search = success;
      this.getTeachers();
    });
  }

  getTeachers(skip = 0): void {
    let params: any;
    params = { skip, limit: this.pageSize };
    if (this.search) {
      params.search = this.search;
    }

    this.loading = true;
    this.httpRequestService.request('get', 'users/teachers', params).subscribe(
      (result: any) => {
        this.loading = false;
        this.teachers = result.data;
        this.totalDataCount = result.totalCount;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }
  // search teacher
  searchTeacher(event: any): void {
    this.searchTeachers.next(event);
  }

  /* status change*/
  // updateStatus(id: string, status: boolean): void {
  //   this.httpRequestService
  //     .request('put', `services/update-status/${id}`, { status: !status })
  //     .subscribe((result: any) => {
  //       this.notificationService.success('', 'Status Updated Successfully');
  //       this.getServices();
  //     });
  // }

  /* For Pagination / Sending skip */
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getTeachers(pageSize * (pageIndex - 1));
  }
}
