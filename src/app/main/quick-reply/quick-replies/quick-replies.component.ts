import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-quick-replies',
  templateUrl: './quick-replies.component.html',
  styleUrls: ['./quick-replies.component.scss'],
})
export class QuickRepliesComponent implements OnInit {
  qucikReplies: any[] = [];
  totalDataCount = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;
  searchQuickReplies: Subject<any> = new Subject<any>();
  search = '';
  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.searchQuickReplies.pipe(debounceTime(1000)).subscribe((success) => {
      this.search = success;
      this.getQuickReplies();
    });
  }

  getQuickReplies(skip = 0): void {
    let params: any;
    params = { skip, limit: this.pageSize };
    if (this.search) {
      params.search = this.search;
    }

    this.loading = true;
    this.httpRequestService.request('get', 'quick-replies', params).subscribe(
      (result: any) => {
        this.loading = false;
        this.qucikReplies = result.data;
        this.totalDataCount = result.totalCount;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }
  // search quick reply
  searchQuickReply(event: any): void {
    this.searchQuickReplies.next(event);
  }

  /* status change*/
  updateStatus(id: string, status: boolean): void {
    this.httpRequestService
      .request('put', `quick-replies/update-status/${id}`, { status: !status })
      .subscribe((result: any) => {
        this.notificationService.success('', 'Status Updated Successfully');
        this.getQuickReplies();
      });
  }
  /* row delete*/
  deleteRow(id: string): void {
    this.httpRequestService
      .request('delete', `quick-replies/delete/${id}`)
      .subscribe((result: any) => {
        this.notificationService.success('', 'Row Deleted Successfully');
        this.getQuickReplies();
      });
  }

  /* For Pagination / Sending skip */
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getQuickReplies(pageSize * (pageIndex - 1));
  }
}
