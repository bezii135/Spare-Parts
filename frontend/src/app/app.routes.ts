import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminComponent } from './admin/admin';
import { LoginComponent } from './login/login';
import { ItemComponent } from './item/item';
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'item', component: ItemComponent },
];
