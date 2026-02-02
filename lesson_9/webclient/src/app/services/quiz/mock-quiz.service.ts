import {QuizService} from './quiz.service';
import {IPagination, IPaginationRequest} from '../../models/pagination';
import {Observable, of} from 'rxjs';
import {IQuiz, IQuizCreateRequest, IQuizItem} from '../../models/quiz';

export class MockQuizService extends QuizService {
  private readonly _quizes: IQuiz[] = [{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },{
    id: -1,
    name: 'test quiz',
    description: 'test description',
  },];
  private readonly _quiz_items: IQuizItem[] = [];

  private _quiz_id: number = 0;
  private _quiz_item_id: number = 0;

  public getItems(request: IPaginationRequest): Observable<IPagination<IQuiz>> {
    return of({
      page: request.page,
      page_size: request.page_size,
      total: this._quizes.length,
      items: this._quizes.slice((request.page - 1) * request.page_size, request.page * request.page_size),
    })
  }

  public create(request: IQuizCreateRequest): Observable<IQuiz> {
    const quiz: IQuiz = {
      id: this._quiz_id,
      name: request.name,
      description: request.description
    };
    this._quizes.push(quiz);

    request.items.forEach(item => {
      const quiz_item: IQuizItem = {
        ...item,
        quiz_id: this._quiz_id,
        id: this._quiz_item_id++,
      };

      this._quiz_items.push(quiz_item);
    });

    this._quiz_id++;

    return of(quiz);
  }
}
