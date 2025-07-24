import { Component } from '@angular/core';
import { Receipt, User } from '../../../../Models/receipt.model';
import { AuthService } from '../../../Shared/services/auth/auth.service';
import { ReceiptService } from '../../../Shared/services/receipt/receipt.service';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [NgIf,NgFor,DecimalPipe,DatePipe,FormsModule,RouterLink],
  templateUrl: './receipt-list.component.html',
  styleUrl: './receipt-list.component.scss'
})
export class ReceiptListComponent {
 currentUser: User | null = null;
  receipts: Receipt[] = [];
  filteredReceipts: Receipt[] = [];
  searchTerm: string = '';
  fromDate: string = '';
  toDate: string = '';

  constructor(
    private authService: AuthService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadReceipts();
  }

  loadReceipts(): void {
    const shopId = this.currentUser?.shopId;
    this.receiptService.getReceipts(shopId).subscribe(receipts => {
      this.receipts = receipts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.filteredReceipts = [...this.receipts];
    });
  }

  filterReceipts(): void {
    let filtered = [...this.receipts];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(receipt => 
        receipt.customerName.toLowerCase().includes(term) ||
        receipt.customerMobile.includes(term) ||
        receipt.invoiceNumber.toLowerCase().includes(term)
      );
    }

    // Filter by date range
    if (this.fromDate) {
      const from = new Date(this.fromDate);
      filtered = filtered.filter(receipt => 
        new Date(receipt.date) >= from
      );
    }

    if (this.toDate) {
      const to = new Date(this.toDate);
      to.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(receipt => 
        new Date(receipt.date) <= to
      );
    }

    this.filteredReceipts = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.fromDate = '';
    this.toDate = '';
    this.filteredReceipts = [...this.receipts];
  }

  getTotalValue(): number {
    return this.filteredReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
  }

  getItemsSummary(items: any[]): string {
    if (items.length === 1) {
      return items[0].itemName;
    } else if (items.length === 2) {
      return `${items[0].itemName}, ${items[1].itemName}`;
    } else {
      return `${items[0].itemName} +${items.length - 1} more`;
    }
  }

  trackByReceiptId(index: number, receipt: Receipt): string {
    return receipt.id;
  }

  printReceipt(receiptId: string): void {
    // Navigate to receipt view and trigger print
    window.open(`/receipt/view/${receiptId}?print=true`, '_blank');
  }

  downloadReceipt(receiptId: string): void {
    // This would typically generate and download a PDF
    console.log('Download receipt:', receiptId);
    alert('PDF download functionality will be implemented with backend integration.');
  }
}
