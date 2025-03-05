import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketDispatcherService {
  socketAuthState: Subject<boolean> = new Subject<boolean>();
  constructor(
      private socket: Socket
  ) {
    this.socket.on('connect', () => {
      console.log('Connection established');
      this.authenticate().then(report => {
        // console.log(report);
      });
    });


    this.socket.on('connect_error', (e: any) => {
      console.log('Connection Error', e);
      this.socketAuthState.next(false);
    });
    this.socket.on('disconnect', () => {
      console.log('Socket Disconnected');
      this.socketAuthState.next(false);
    });

    this.socketAuthState.subscribe(state => {
      console.log('Socket Authentication Status => ', state);
    });
  }
  public connect(): void {
    this.socket.connect();
  }
  public disconnect(): void {
    this.socket.disconnect();
  }
  public async authenticate(): Promise<any> {
    const token = localStorage.getItem('token');
    return new Promise(resolve => {
      this.socket.emit('authentication', {token}, (report: any) => {
        this.socketAuthState.next(true);
        console.log('Authenticated');
        resolve(report);
      });
    });
  }
  public sendMessage(key: string, data: any): Promise<any> {
    return new Promise(resolve => {
      this.socket.emit(key, data, (report: any) => {
        resolve(report);
      });
    });
  }

  public getMessage(key: string): Observable<any> {
    return this.socket.fromEvent(key);
  }
  public get rawSocket(): Socket {
    return this.socket;
  }
  public addNewWork(key: string, data: any): Promise<any> {
    return new Promise(resolve => {
      this.socket.emit(key, data, (report: any) => {
        resolve(report);
      });
    });
  }
}
