import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  totalDataCount = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;
  searchServices: Subject<any> = new Subject<any>();
  search = '';
  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.searchServices.pipe(debounceTime(1000)).subscribe((success) => {
      this.search = success;
      this.getServices();
    });
  }

  getServices(skip = 0): void {
    let params: any;
    params = { skip, limit: this.pageSize };
    if (this.search) {
      params.search = this.search;
    }

    this.loading = true;
    this.httpRequestService.request('get', 'services', params).subscribe(
      (result: any) => {
        this.loading = false;
        this.services = result.data;
        this.totalDataCount = result.totalCount;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }
  // search service
  searchService(event: any): void {
    this.searchServices.next(event);
  }

  /* status change*/
  updateStatus(id: string, status: boolean): void {
    this.httpRequestService
      .request('put', `services/update-status/${id}`, { status: !status })
      .subscribe((result: any) => {
        this.notificationService.success('', 'Status Updated Successfully');
        this.getServices();
      });
  }

  /* For Pagination / Sending skip */
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getServices(pageSize * (pageIndex - 1));
  }
}
