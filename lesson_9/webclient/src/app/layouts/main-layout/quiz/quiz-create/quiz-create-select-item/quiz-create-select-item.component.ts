import {Component, input, OnInit, output} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {QuizItemType} from '../../../../../models/quiz';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput, MatLabel} from '@angular/material/input';

export interface IQuizItemSelectFormGroup {
  readonly type: FormControl<QuizItemType.Select>;
  readonly options: FormArray<FormControl<string>>;
}

@Component({
  selector: "app-quiz-create-select-item",
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatMiniFabButton,
    ReactiveFormsModule
  ],
  template: `
    @let option = formGroup();

    <div class="quiz-item__content">
      <div class="quiz-item__select-options">
        <div class="quiz-item__select-header">
          <h4>Options</h4>
          <button type="button" (click)="addSelectOption(option)" matButton>
            <mat-icon>add</mat-icon>
            Add Option
          </button>
        </div>
        <div class="quiz-item__options-list">
          @for (selectOption of option.controls.options.controls; track $index; let optionId = $index) {
            <div class="quiz-item__option-row">
              <mat-form-field>
                <mat-label>Option {{ optionId + 1 }}</mat-label>
                <input matInput
                       placeholder="Enter option text"
                       [formControl]="selectOption">
              </mat-form-field>
              <button type="button" (click)="removeSelectOption(option, optionId)" matMiniFab color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
      </div>
      <button type="button" (click)="delete.emit()" matMiniFab color="warn">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
  styleUrl: "../quiz-create.component.css",
})
export class QuizCreateSelectItemComponent {
  public readonly formGroup = input.required<FormGroup<IQuizItemSelectFormGroup>>()
  public readonly delete = output<void>();

  protected addSelectOption(option: FormGroup<IQuizItemSelectFormGroup>): void {
    option.controls.options.controls.push(new FormControl('', { nonNullable: true, validators: [Validators.required] }));
  }

  protected removeSelectOption(option: FormGroup<IQuizItemSelectFormGroup>, optionIndex: number): void {
    const optionsArray = option.controls.options;

    if (optionsArray.length > 1) {
      optionsArray.removeAt(optionIndex);
    }
  }
}
