import {Component, inject, signal} from '@angular/core';
import {QuizService} from '../../../../services/quiz/quiz.service';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {MatButton, MatMiniFabButton, MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {Router, RouterModule} from '@angular/router';
import {AppRoutes} from '../../../../app.routes';
import {MatError, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {QuizItemType, IQuizItemRequest} from '../../../../models/quiz';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMiniFabButton,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule,
    MatDatepickerModule,
    MatError
    // QuizCreateSelectItemComponent
  ],
  template: `
    <div class="quiz-wrapper">
      <div class="quiz-page">
        <div class="quiz-actions">
          <button (click)="toDiscover()" matMiniFab>
            <mat-icon>arrow_back</mat-icon>
          </button>
          <button (click)="save()" [disabled]="loading()" matButton>Save</button>
        </div>

        <div class="quiz-form">
          <mat-form-field class="full-width">
            <mat-label>Quiz Title</mat-label>
            <input matInput placeholder="Title" [formControl]="form.controls.name">
            <mat-error>Please enter a valid name for quiz</mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Quiz Description</mat-label>
            <textarea matInput placeholder="Description" [formControl]="form.controls.description"></textarea>
            <mat-error>Please enter a valid description for quiz</mat-error>
          </mat-form-field>

          <div class="quiz-items">
            <div class="quiz-items__header">
              <p>Quiz Items (5 типов вопросов)</p>
              <div class="quiz-items__actions">
                <button type="button" (click)="addSelectItem()" matButton>
                  <mat-icon>add</mat-icon> Select
                </button>
                <button type="button" (click)="addMultiselectItem()" matButton>
                  <mat-icon>check_box</mat-icon> Multiselect
                </button>
                <button type="button" (click)="addTextItem()" matButton>
                  <mat-icon>text_fields</mat-icon> Text
                </button>
                <button type="button" (click)="addRangeItem()" matButton>
                  <mat-icon>tune</mat-icon> Range
                </button>
                <button type="button" (click)="addDateTimeItem()" matButton>
                  <mat-icon>event</mat-icon> DateTime
                </button>
              </div>
            </div>

            <div class="quiz-items__list">
              @for (option of form.controls.items.controls; track $index; let id = $index) {
                <div class="quiz-item">
                  @if (isSelectFormGroup(option)) {
                    <app-quiz-create-select-item [formGroup]="option" (delete)="removeItem(id)" />
                  } @else if (isMultiselectFormGroup(option)) {
                    <div class="quiz-item__content">
                      <mat-form-field class="full-width">
                        <mat-label>Вопрос</mat-label>
                        <input matInput [formControl]="option.controls.questionText" placeholder="Текст вопроса">
                      </mat-form-field>
                      <app-quiz-create-select-item [formGroup]="option" (delete)="removeItem(id)" />
                    </div>
                  } @else if (isTextFormGroup(option)) {
                    <div class="quiz-item__content">
                      <mat-form-field class="full-width">
                        <mat-label>Вопрос</mat-label>
                        <input matInput [formControl]="option.controls.questionText" placeholder="Текст вопроса">
                      </mat-form-field>
                      <mat-form-field class="full-width">
                        <mat-label>Placeholder</mat-label>
                        <input matInput [formControl]="option.controls.placeholder">
                      </mat-form-field>
                      <button type="button" (click)="removeItem(id)" matMiniFab color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  } @else if (isRangeFormGroup(option)) {
                    <div class="quiz-item__content">
                      <mat-form-field class="full-width">
                        <mat-label>Вопрос</mat-label>
                        <input matInput [formControl]="option.controls.questionText" placeholder="Текст вопроса">
                      </mat-form-field>
                      <div class="quiz-item__range-controls">
                        <mat-form-field>
                          <mat-label>Min Value</mat-label>
                          <input matInput type="number" [formControl]="option.controls.min">
                        </mat-form-field>
                        <mat-form-field>
                          <mat-label>Max Value</mat-label>
                          <input matInput type="number" [formControl]="option.controls.max">
                        </mat-form-field>
                      </div>
                      <button type="button" (click)="removeItem(id)" matMiniFab color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  } @else if (isDateTimeFormGroup(option)) {
                    <div class="quiz-item__content">
                      <mat-form-field class="full-width">
                        <mat-label>Вопрос</mat-label>
                        <input matInput [formControl]="option.controls.questionText" placeholder="Текст вопроса">
                      </mat-form-field>
                      <mat-form-field class="full-width">
                        <mat-label>DateTime Placeholder</mat-label>
                        <input matInput type="datetime-local" [formControl]="option.controls.placeholder">
                      </mat-form-field>
                      <button type="button" (click)="removeItem(id)" matMiniFab color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['quiz-create.component.css']
})
export class QuizCreateComponent {
  private readonly router = inject(Router);
  private readonly service = inject(QuizService);

  protected readonly loading = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6), Validators.maxLength(100)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(500)] }),
    items: new FormArray<IQuizItemFormGroup>([])
  });

  protected addSelectItem(): void {
    const itemGroup = new FormGroup<IQuizItemSelectFormGroup>({
      type: new FormControl({ value: QuizItemType.Select, disabled: true }, { nonNullable: true }),
      questionText: new FormControl('', { nonNullable: true }),
      options: new FormArray<FormControl<string>>([
        new FormControl('', { nonNullable: true, validators: [Validators.required] })
      ])
    });
    this.form.controls.items.push(itemGroup);
  }

  protected addMultiselectItem(): void {
    const itemGroup = new FormGroup<IQuizItemMultiselectFormGroup>({
      type: new FormControl({ value: 'multiselect' as any, disabled: true }, { nonNullable: true }),
      questionText: new FormControl('', { nonNullable: true }),
      options: new FormArray<FormControl<string>>([
        new FormControl('', { nonNullable: true, validators: [Validators.required] })
      ])
    });
    this.form.controls.items.push(itemGroup);
  }

  protected addTextItem(): void {
    const itemGroup = new FormGroup<IQuizItemTextFormGroup>({
      type: new FormControl({ value: QuizItemType.Text, disabled: true }, { nonNullable: true }),
      questionText: new FormControl('', { nonNullable: true }), 
      placeholder: new FormControl('', { nonNullable: true })
    });
    this.form.controls.items.push(itemGroup);
  }

  protected addRangeItem(): void {
    const itemGroup = new FormGroup<IQuizItemRangeFormGroup>({
      type: new FormControl({ value: QuizItemType.Range, disabled: true }, { nonNullable: true }),
      questionText: new FormControl('', { nonNullable: true }), 
      min: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      max: new FormControl(100, { nonNullable: true, validators: [Validators.required] })
    });
    this.form.controls.items.push(itemGroup);
  }

  protected addDateTimeItem(): void {
    const itemGroup = new FormGroup<IQuizItemDateTimeFormGroup>({
      type: new FormControl({ value: 'datetime' as any, disabled: true }, { nonNullable: true }),
      questionText: new FormControl('', { nonNullable: true }),
      placeholder: new FormControl('', { nonNullable: true })
    });
    this.form.controls.items.push(itemGroup);
  }

  protected isSelectFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemSelectFormGroup> {
    return form.controls.type.value === QuizItemType.Select;
  }

  protected isMultiselectFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemMultiselectFormGroup> {
    return form.controls.type.value === 'multiselect';
  }

  protected isTextFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemTextFormGroup> {
    return form.controls.type.value === QuizItemType.Text;
  }

  protected isRangeFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemRangeFormGroup> {
    return form.controls.type.value === QuizItemType.Range;
  }

  protected isDateTimeFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemDateTimeFormGroup> {
    return form.controls.type.value === 'datetime';
  }

  protected removeItem(index: number): void {
    this.form.controls.items.removeAt(index);
  }

  protected buildItemsRequest(): readonly IQuizItemRequest[] {
    return this.form.controls.items.controls.map(itemGroup => itemGroup.getRawValue());
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    const value = this.form.getRawValue();
    const items = this.buildItemsRequest();

    this.loading.set(true);

    try {
      await firstValueFrom(this.service.create({
        name: value.name,
        description: value.description,
        items: items
      }));

      await this.toDiscover();
    }
    finally {
      this.loading.set(false);
    }
  }

  protected async toDiscover(): Promise<void> {
    await this.router.navigate(["main", AppRoutes.Discover]);
  }
}


export type IQuizItemFormGroup =
  | FormGroup<IQuizItemSelectFormGroup>
  | FormGroup<IQuizItemMultiselectFormGroup>
  | FormGroup<IQuizItemTextFormGroup>
  | FormGroup<IQuizItemRangeFormGroup>
  | FormGroup<IQuizItemDateTimeFormGroup>;

export interface IQuizItemSelectFormGroup {
  readonly type: FormControl<QuizItemType.Select>;
  readonly questionText: FormControl<string>;
  readonly options: FormArray<FormControl<string>>;
}

export interface IQuizItemMultiselectFormGroup {
  readonly type: FormControl<any>;
  readonly questionText: FormControl<string>;
  readonly options: FormArray<FormControl<string>>;
}

export interface IQuizItemTextFormGroup {
  readonly type: FormControl<QuizItemType.Text>;
  readonly questionText: FormControl<string>;
  readonly placeholder: FormControl<string>;
}

export interface IQuizItemRangeFormGroup {
  readonly type: FormControl<QuizItemType.Range>;
  readonly questionText: FormControl<string>;
  readonly min: FormControl<number>;
  readonly max: FormControl<number>;
}

export interface IQuizItemDateTimeFormGroup {
  readonly type: FormControl<any>;
  readonly questionText: FormControl<string>;
  readonly placeholder: FormControl<string>;
}
