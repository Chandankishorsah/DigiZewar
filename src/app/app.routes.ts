import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './Modules/Admin/components/admin-dashboard/admin-dashboard.component';
import { ReceiptCreateComponent } from './Modules/Reciept/components/receipt-create/receipt-create.component';
import { ReceiptListComponent } from './Modules/Reciept/components/receipt-list/receipt-list.component';
import { ReceiptViewComponent } from './Modules/Reciept/components/receipt-view/receipt-view.component';
import { DashboardComponent } from './Modules/Shared/components/dashboard/dashboard.component';
import { LoginComponent } from './Modules/Shared/components/login/login.component';
import { ReceiptPrintComponent } from './Modules/Reciept/components/receipt-print/receipt-print.component';

export const routes: Routes = [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'receipt/create', component: ReceiptCreateComponent },
  { path: 'receipt/list', component: ReceiptListComponent },
   { path: 'receipt/view/:id', component: ReceiptViewComponent },
  { path: 'receipt/print/:id', component: ReceiptPrintComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '/login' }
];
