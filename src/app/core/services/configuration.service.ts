import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor() {}
  get apiUrl(): string {
    // return environment.production ? 'https://etapi.meancloud.in'  : 'https://etapi.meancloud.in';
    return environment.apiBaseUrl;
  }

  get mediaBaseUrl(): string {
    return environment.production ? '' : '';
  }
}
