import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet
  ],
  template: `
    <div class="wrapper">
      <div class="router-outlet-wrapper">
        <router-outlet />
      </div>
    </div>
  `,
  styleUrl: 'main-layout.component.css'
})
export class MainLayoutComponent {

}
