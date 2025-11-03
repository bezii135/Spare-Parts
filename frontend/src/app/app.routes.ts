import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminComponent } from './admin/admin';
import { LoginComponent } from './login/login';
import { UserAddRemoveComponent } from './useraddremove/useraddremove';
import { ItemComponent } from './item/item';
import { CartComponent } from './cart/cart';
import { HistoryComponent } from './history/history';
import { ItemAddComponent } from './itemadd/itemadd';
import { SalesComponent } from './sales/sales'; // adjust path if your file is somewhere else
import { CashierComponent } from './cashier/cashier'; 
import { AttachementComponent } from './attachement/attachement';

  export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'item', component: ItemComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/item', pathMatch: 'full' },
  { path: 'history', component: HistoryComponent },
  { path: 'user', component: UserAddRemoveComponent }, 
  { path: 'itemadd', component: ItemAddComponent },
  { path: 'cashier', component: CashierComponent },
  { path: 'sales', component: SalesComponent }, 
  { path: 'attachment', component: AttachementComponent },
  { path: '', redirectTo: '/cashier', pathMatch: 'full' }, // default
  { path: '**', redirectTo: '/cashier' }, // fallback
   { path: '**', redirectTo: '/item' } 
];
