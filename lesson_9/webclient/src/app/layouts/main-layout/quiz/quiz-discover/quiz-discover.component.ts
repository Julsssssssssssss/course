import {Component, inject, Signal} from '@angular/core';
import {QuizService} from '../../../../services/quiz/quiz.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {IQuiz} from '../../../../models/quiz';
import {IPagination, IPaginationRequest} from '../../../../models/pagination';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {AppRoutes} from '../../../../app.routes';

@Component({
  selector: 'app-quiz-discover',
  template: `
    @let r = response();

    <div class="quiz-wrapper">
      @if (r === null) {
        <mat-spinner />
      } @else {
        <div class="quiz-page">
          <div class="quiz-actions">
            <button (click)="toCreate()" matMiniFab>
              <mat-icon>add</mat-icon>
            </button>
          </div>

          <div class="quiz-list">
            @if (r.items.length !== 0) {
              @for (item of r.items; track item.id) {
                <div class="quiz-item">
                  <div class="quiz-item__title">{{ item.name }}</div>
                  <div class="quiz-item__delimiter"></div>
                  <div class="quiz-item__description">{{ item.description }}</div>
                </div>
              }
            } @else {
              <div class="quiz-alert">
                <p>No items found.</p>
              </div>
            }
          </div>

          <mat-paginator
            class="quiz-paginator"
            [length]="r.total"
            [pageSize]="request.page_size"
            aria-label="Select page"
          />
        </div>
      }
    </div>
  `,
  styleUrls: ['quiz-discover.component.css'],
  imports: [
    MatPaginator,
    MatProgressSpinner,
    MatMiniFabButton,
    MatIcon
  ]
})
export class QuizDiscoverComponent {
  private readonly router = inject(Router);
  private readonly service = inject(QuizService);

  protected readonly request: IPaginationRequest = {
    page: 1,
    page_size: 10
  };

  protected readonly response: Signal<IPagination<IQuiz> | null> = toSignal(
    this.service.getItems(this.request),
    { initialValue: null }
  )

  protected async toCreate(): Promise<void> {
    await this.router.navigate(["main", AppRoutes.Create]);
  }
}
