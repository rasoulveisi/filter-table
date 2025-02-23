import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableViewComponent } from './table/table-view/table-view.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TableViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'filter-table';
}
