import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  students: any[] = [];
  totalDataCount = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;
  searchStudents: Subject<any> = new Subject<any>();
  search = '';
  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchStudents.pipe(debounceTime(1000)).subscribe((success) => {
      this.search = success;
      this.getStudents();
    });
  }

  getStudents(skip = 0): void {
    let params: any;
    params = { skip, limit: this.pageSize };
    if (this.search) {
      params.search = this.search;
    }

    this.loading = true;
    this.httpRequestService.request('get', 'users', params).subscribe(
      (result: any) => {
        this.loading = false;
        this.students = result.data;
        this.totalDataCount = result.totalCount;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }
  // search service
  searchService(event: any): void {
    this.searchStudents.next(event);
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
    this.getStudents(pageSize * (pageIndex - 1));
  }

  gotoMessage(studentId: string): void {
    this.router.navigateByUrl(`chat?user=${studentId}`);
  }
}
