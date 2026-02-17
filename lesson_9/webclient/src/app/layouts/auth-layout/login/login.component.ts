import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ApiAuthService} from '../../../services/auth/api-auth.service';
import {firstValueFrom} from 'rxjs';
import {AuthState} from '../../../states/auth.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <input [formControl]="form.controls.username">
    <input [formControl]="form.controls.password">
    <button (click)="submit()">Submit</button>
  `
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(ApiAuthService);
  private readonly authState = inject(AuthState);

  protected readonly form = new FormGroup({
    username: new FormControl("", { nonNullable: true }),
    password: new FormControl("", { nonNullable: true })
  });

  protected async submit() {
    await firstValueFrom(this.authService.login(this.form.getRawValue()));
    this.authState.loggedIn.set(true);
    await this.router.navigate(['/main/discover']);
  }
}
