import { TestBed } from '@angular/core/testing';

import { SocketDispatcherService } from './socket-dispatcher.service';

describe('SocketDispatcherService', () => {
  let service: SocketDispatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketDispatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
