export interface IQuiz {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export enum QuizItemType {
  Select = 'select',
  Text = 'text',
  Range = 'range',
}

export interface IQuizItem {
  readonly id: number;
  readonly quiz_id: number;
  readonly type: QuizItemType;
}

export interface IQuizItemRequestSelect {
  readonly type: QuizItemType.Select;
  readonly options: readonly string[];
}

export interface IQuizItemRequestText {
  readonly type: QuizItemType.Text;
  readonly placeholder: string;
}

export interface IQuizItemRequestRange {
  readonly type: QuizItemType.Range;
  readonly min: number;
  readonly max: number;
}

export type IQuizItemRequest = IQuizItemRequestSelect | IQuizItemRequestText | IQuizItemRequestRange;

export interface IQuizCreateRequest {
  readonly name: string;
  readonly description: string;
  readonly items: readonly IQuizItemRequest[];
}
