import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketDispatcherService } from './socket-dispatcher.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  authLogout: Subject<any> = new Subject<any>();
  readMessage: Subject<any> = new Subject<any>();
  constructor(
  ) {
  }

  public logout(): void{
    this.authLogout.next();

  }
}
