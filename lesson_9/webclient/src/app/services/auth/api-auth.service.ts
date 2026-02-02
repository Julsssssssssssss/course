import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '../api/api';
import {ILoginRequest} from '../../models/auth';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiConfig = inject(Api);

  public login(req: ILoginRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiConfig.getUrl()}api/auth/login`, req);
  }
}
