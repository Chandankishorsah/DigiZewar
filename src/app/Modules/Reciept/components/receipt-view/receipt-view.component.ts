import { Component } from '@angular/core';
import { Receipt } from '../../../../Models/receipt.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceiptService } from '../../../Shared/services/receipt/receipt.service';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-receipt-view',
  standalone: true,
  imports: [NgIf,NgFor,DecimalPipe,DatePipe],
  templateUrl: './receipt-view.component.html',
  styleUrl: './receipt-view.component.scss'
})
export class ReceiptViewComponent {
 receipt: Receipt | null = null;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private receiptService: ReceiptService
  ) {}

  ngOnInit(): void {
    const receiptId = this.route.snapshot.paramMap.get('id');
    if (receiptId) {
      this.loadReceipt(receiptId);
    } else {
      this.error = true;
    }
  }

  loadReceipt(id: string): void {
    this.receiptService.getReceipt(id).subscribe({
      next: (receipt) => {
        if (receipt) {
          this.receipt = receipt;
          
          // Auto-print if print parameter is present
          const printParam = this.route.snapshot.queryParamMap.get('print');
          if (printParam === 'true') {
            setTimeout(() => this.printReceipt(), 1000);
          }
        } else {
          this.error = true;
        }
      },
      error: () => {
        this.error = true;
      }
    });
  }

  printReceipt(): void {
    window.print();
  }

  downloadPDF(): void {
    // This would typically generate and download a PDF
    console.log('Download PDF for receipt:', this.receipt?.id);
    alert('PDF download functionality will be implemented with backend integration.');
  }

  goBack(): void {
    // Navigate back to the previous page or receipt list
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/receipt/list']);
  }
}
