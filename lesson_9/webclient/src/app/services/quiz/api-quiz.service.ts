import {inject, Injectable} from '@angular/core';
import {QuizService} from './quiz.service';
import {HttpClient} from '@angular/common/http';
import { Observable } from "rxjs";
import { IPaginationRequest, IPagination } from "../../models/pagination";
import { IQuiz, IQuizCreateRequest } from "../../models/quiz";
import {Api} from '../api/api';

@Injectable()
export class ApiQuizService extends QuizService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiConfig = inject(Api);

  public override getItems(request: IPaginationRequest): Observable<IPagination<IQuiz>> {
    return this.httpClient.get<IPagination<IQuiz>>(`${this.apiConfig.getUrl()}api/quizes?pageNumber=${request.page}&pageSize=${request.page_size}`);
  }

  public override create(request: IQuizCreateRequest): Observable<IQuiz> {
    return this.httpClient.post<IQuiz>(`${this.apiConfig.getUrl()}api/quizes`, request);
  }
}
