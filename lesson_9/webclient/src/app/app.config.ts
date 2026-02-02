import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  Provider,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {QuizService} from './services/quiz/quiz.service';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {Api} from './services/api/api';
import {QuizApi} from './services/api/quiz.api';
import {ApiQuizService} from './services/quiz/api-quiz.service';
import {handleAuth} from './interceptors/auth.interceptor';

const services: Provider[] = [
  {
    provide: QuizService,
    useClass: ApiQuizService,
  },
  {
    provide: Api,
    useClass: QuizApi
  }
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([handleAuth])),
    ...services,
  ]
};
