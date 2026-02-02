import {Component, inject, signal} from '@angular/core';
import {QuizService} from '../../../../services/quiz/quiz.service';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {AppRoutes} from '../../../../app.routes';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {QuizItemType, IQuizItemRequest} from '../../../../models/quiz';
import {CommonModule} from '@angular/common';
import {
  IQuizItemSelectFormGroup,
  QuizCreateSelectItemComponent
} from './quiz-create-select-item/quiz-create-select-item.component';

@Component({
  selector: 'app-quiz-create',
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
          <mat-form-field>
            <mat-label>Quiz Title</mat-label>
            <input matInput placeholder="Title" [formControl]="form.controls.name">
            <mat-error>Please enter a valid name for quiz</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Quiz Description</mat-label>
            <textarea matInput placeholder="Description" [formControl]="form.controls.description"></textarea>
            <mat-error>Please enter a valid description for quiz</mat-error>
          </mat-form-field>

          <div class="quiz-items">
            <div class="quiz-items__header">
              <p>Quiz Items</p>
              <div class="quiz-items__actions">
                <button type="button" (click)="addSelectItem()" matButton>Add Select</button>
                <button type="button" (click)="addTextItem()" matButton>Add Text</button>
                <button type="button" (click)="addRangeItem()" matButton>Add Range</button>
              </div>
            </div>

            <div class="quiz-items__list">
              @for (option of form.controls.items.controls; track $index; let id = $index) {
                <div class="quiz-item">
                  @if (isSelectFormGroup(option)) {
                    <app-quiz-create-select-item [formGroup]="option" (delete)="removeItem(id)" />
                  } @else if (isTextFormGroup(option)) {
                    <div class="quiz-item__content">
                      <mat-form-field>
                        <mat-label>Placeholder</mat-label>
                        <input matInput
                               placeholder="Enter placeholder text"
                               [formControl]="option.controls.placeholder">
                      </mat-form-field>
                      <button type="button" (click)="removeItem(id)" matMiniFab color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  } @else if (isRangeFormGroup(option)) {
                    <div class="quiz-item__content">
                      <div class="quiz-item__range-controls">
                        <mat-form-field>
                          <mat-label>Min Value</mat-label>
                          <input matInput
                                 type="number"
                                 [formControl]="option.controls.min">
                        </mat-form-field>
                        <mat-form-field>
                          <mat-label>Max Value</mat-label>
                          <input matInput
                                 type="number"
                                 [formControl]="option.controls.max">
                        </mat-form-field>
                      </div>
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
  styleUrls: ['quiz-create.component.css'],
  imports: [
    MatButton,
    MatMiniFabButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    CommonModule,
    QuizCreateSelectItemComponent
  ]
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
      options: new FormArray<FormControl<string>>([
        new FormControl('', { nonNullable: true, validators: [Validators.required] })
      ])
    });

    this.form.controls.items.push(itemGroup);
  }

  protected addTextItem(): void {
    const itemGroup = new FormGroup<IQuizItemTextFormGroup>({
      type: new FormControl({ value: QuizItemType.Text, disabled: true }, { nonNullable: true }),
      placeholder: new FormControl('', { nonNullable: true })
    });

    this.form.controls.items.push(itemGroup);
  }

  protected addRangeItem(): void {
    const itemGroup = new FormGroup<IQuizItemRangeFormGroup>({
      type: new FormControl({ value: QuizItemType.Range, disabled: true }, { nonNullable: true }),
      min: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      max: new FormControl(100, { nonNullable: true, validators: [Validators.required] })
    });

    this.form.controls.items.push(itemGroup);
  }

  protected isSelectFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemSelectFormGroup> {
    return form.controls.type.value === QuizItemType.Select;
  }

  protected isTextFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemTextFormGroup> {
    return form.controls.type.value === QuizItemType.Text;
  }

  protected isRangeFormGroup(form: IQuizItemFormGroup): form is FormGroup<IQuizItemRangeFormGroup> {
    return form.controls.type.value === QuizItemType.Range;
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
  FormGroup<IQuizItemSelectFormGroup> |
  FormGroup<IQuizItemTextFormGroup> |
  FormGroup<IQuizItemRangeFormGroup>;

export interface IQuizItemTextFormGroup {
  readonly type: FormControl<QuizItemType.Text>;
  readonly placeholder: FormControl<string>;
}

export interface IQuizItemRangeFormGroup {
  readonly type: FormControl<QuizItemType.Range>;
  readonly min: FormControl<number>;
  readonly max: FormControl<number>;
}
