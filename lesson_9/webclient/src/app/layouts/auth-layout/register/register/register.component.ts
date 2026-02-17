import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiAuthService } from '../../../../services/auth/api-auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface RegisterRequest {
  username: string;
  password: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule
  ],
  template: `
    <div class="register-container">
      <h2>Регистрация</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Имя</mat-label>
          <input matInput formControlName="username">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Пароль</mat-label>
          <input matInput type="password" formControlName="password">
          <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
            Пароль обязателен (минимум 6 символов)
          </mat-error>
        </mat-form-field>

        <button 
          mat-raised-button 
          color="primary" 
          type="submit" 
          class="full-width"
          [disabled]="registerForm.invalid">
          Зарегистрироваться
        </button>
      </form>
      <p>
        Уже есть аккаунт? 
        <a routerLink="/login">Войти</a>
      </p>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: ApiAuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const request: RegisterRequest = this.registerForm.value;
      this.authService.register(request).subscribe({
        next: () => {
          console.log('✅ Регистрация успешна!');
          this.router.navigate(['/auth/login']);
        },
        error: (error: any) => { 
          console.error('❌ Ошибка регистрации:', error);
        }
      });
    }
  }
}