import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CommunicationService } from './communication.service';
import { HttpRequestService } from './http-request.service';
import { SocketDispatcherService } from './socket-dispatcher.service';
// import { promise } from 'protractor';
interface AuthState {
  authenticated: boolean;
  user: null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticationState: ReplaySubject<AuthState> = new ReplaySubject<AuthState>(
    1
  );
  constructor(
    private localStorageService: LocalStorageService,
    private httpRequestService: HttpRequestService,
    private communicationService: CommunicationService,
    private socketDispatcherService: SocketDispatcherService

  ) {
    /**
     * logout call by subject
     */
    this.communicationService.authLogout.subscribe((success) => {
      this.logout();
    });

    /**
     * Check Logged in Logic
     */
    const user = localStorageService.getItem('user');
    const token = localStorageService.getItem('token', false);
    // const expiry = localStorageService.getItem('expiry');
    const authenticated = !!user && !!token;
    this.authenticationState.next({ authenticated, user: user || null });
  }
  public get authState(): Observable<AuthState> {
    return this.authenticationState as Observable<AuthState>;
  }
  public getLocalUser(): any {
    return this.localStorageService.getItem('user');
  }
  public setLocalUser(user: any): void {
    this.localStorageService.setItem('user', user);
    this.authenticationState.next({ authenticated: true, user });
  }
  private setLocalToken(token: string): void {
    this.localStorageService.setItem('token', token);
  }
  public async login(mobile: string, otp: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpRequestService
        .request('post', 'auth/admin-login-with-otp', { mobile, otp })
        .subscribe(
          (success) => {
            const loginResponse = success.data;
            this.setLocalUser(loginResponse.user);
            this.setLocalToken(loginResponse.token);
            this.socketDispatcherService.authenticate().then();
            resolve(loginResponse.user);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  public async logout(): Promise<any> {
    /**
     * Replace with API Call
     */
    return new Promise<void>((resolve, reject) => {
      this.localStorageService.removeItem('user');
      this.localStorageService.removeItem('token');
      this.authenticationState.next({ authenticated: false, user: null });
      resolve();
    });
  }
}
