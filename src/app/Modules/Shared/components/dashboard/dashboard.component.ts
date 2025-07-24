import { Component } from '@angular/core';
import { Receipt, User } from '../../../../Models/receipt.model';
import { AuthService } from '../../services/auth/auth.service';
import { ReceiptService } from '../../services/receipt/receipt.service';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe,DatePipe,NgIf,RouterLink,NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentUser: User | null = null;
  totalSales = 0;
  todaysSales = 0;
  totalReceipts = 0;
  recentReceipts: Receipt[] = [];

  constructor(
    private authService: AuthService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const shopId = this.currentUser?.shopId;

    // Load total sales
    this.receiptService.getTotalSales(shopId).subscribe(total => {
      this.totalSales = total;
    });

    // Load today's sales
    this.receiptService.getTodaysSales(shopId).subscribe(total => {
      this.todaysSales = total;
    });

    // Load receipt count
    this.receiptService.getReceiptCount(shopId).subscribe(count => {
      this.totalReceipts = count;
    });

    // Load recent receipts
    this.receiptService.getReceipts(shopId).subscribe(receipts => {
      this.recentReceipts = receipts.slice(0, 5).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
