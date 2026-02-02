import {IPagination, IPaginationRequest} from '../../models/pagination';
import {Observable} from 'rxjs';
import {IQuiz, IQuizCreateRequest} from '../../models/quiz';

export abstract class QuizService {
  public abstract getItems(request: IPaginationRequest): Observable<IPagination<IQuiz>>;
  public abstract create(request: IQuizCreateRequest): Observable<IQuiz>;
}
