import { Component } from '@angular/core';
import { User } from '../../../../Models/receipt.model';
import { AuthService } from '../../../Shared/services/auth/auth.service';
import { ReceiptService } from '../../../Shared/services/receipt/receipt.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
currentUser: User | null = null;
  totalShops = 3;
  totalSales = 0;
  todaysSales = 0;
  totalReceipts = 0;

  constructor(
    private authService: AuthService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    // Redirect if not admin
    if (!this.authService.isAdmin()) {
      // Redirect to regular dashboard or login
      return;
    }

    this.loadAdminStats();
  }

  loadAdminStats(): void {
    // Load global statistics (all shops)
    this.receiptService.getTotalSales().subscribe(total => {
      this.totalSales = total;
    });

    this.receiptService.getTodaysSales().subscribe(total => {
      this.todaysSales = total;
    });

    this.receiptService.getReceiptCount().subscribe(count => {
      this.totalReceipts = count;
    });
  }
}
