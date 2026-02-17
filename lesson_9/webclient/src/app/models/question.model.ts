export type QuestionType = 'text' | 'select' | 'multiselect' | 'range' | 'datetime';

export interface IQuestion {
  id?: number;
  quiz_id?: number;
  type: QuestionType;        
  text: string;
  options?: string[];           
  min?: number;                
  max?: number;                 
}
