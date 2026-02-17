import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '../api/api';
import {ILoginRequest} from '../../models/auth';
import {Observable} from 'rxjs';

interface IRegisterRequest {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiConfig = inject(Api);

  public login(req: ILoginRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiConfig.getUrl()}api/auth/login`, req, 
      { withCredentials: true });
  }


  public register(req: IRegisterRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiConfig.getUrl()}api/auth/register`, req, 
      { withCredentials: true });
  }

  public logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiConfig.getUrl()}api/auth/logout`, {}, 
      { withCredentials: true });
  }
}
