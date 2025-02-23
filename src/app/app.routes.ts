import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'table',
    loadComponent: () => import('./table/table-view/table-view.component').then(m => m.TableViewComponent)

}
];
