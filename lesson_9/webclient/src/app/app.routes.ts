import { Routes } from '@angular/router';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {QuizDiscoverComponent} from './layouts/main-layout/quiz/quiz-discover/quiz-discover.component';
import { QuizCreateComponent } from "./layouts/main-layout/quiz/quiz-create/quiz-create.component";
import {AuthState} from './states/auth.state';
import {authGuard, nonAuthGuard} from './guards/auth.guard';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {LoginComponent} from './layouts/auth-layout/login/login.component';

export enum AppRoutes {
  Login = 'login',
  Discover = 'discover',
  Create = 'create',
}

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [nonAuthGuard],
    component: AuthLayoutComponent,
    children: [{
      path: AppRoutes.Login,
      component: LoginComponent,
    },    {
      path: '',
      pathMatch: 'full',
      redirectTo: AppRoutes.Login
    }]
  },
  {
  path: 'main',
  canActivate: [authGuard],
  component: MainLayoutComponent,
  children: [
    {
      path: AppRoutes.Discover,
      component: QuizDiscoverComponent,
    },
    {
      path: AppRoutes.Create,
      component: QuizCreateComponent
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: AppRoutes.Discover,
    }
  ],
},
  {
    path: '**',
    redirectTo: 'main',
  }];
