import {Api} from './api';
import {Injectable} from '@angular/core';

@Injectable()
export class QuizApi extends Api {
  public getUrl(): string {
    return "http://localhost:5000/";
  }
}
