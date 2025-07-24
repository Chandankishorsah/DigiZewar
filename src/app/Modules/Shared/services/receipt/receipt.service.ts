import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Receipt } from '../../../../Models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
 private receipts: Receipt[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'Priya Sharma',
      customerMobile: '+91-9876543210',
      items: [
        {
          id: '1',
          itemName: 'Gold Chain',
          weight: 10.5,
          pricePerGram: 6500,
          makingCharges: 5000,
          itemTotal: 73250,
          description: '22K Gold Chain with pendant'
        }
      ],
      subtotal: 73250,
      tax: 2197.5,
      total: 75447.5,
      date: new Date('2024-01-15'),
      createdBy: 'Shop Owner',
      shopId: '1',
      shopName: 'Golden Jewelers'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'Amit Singh',
      customerMobile: '+91-9876543211',
      items: [
        {
          id: '2',
          itemName: 'Diamond Ring',
          weight: 3.2,
          pricePerGram: 12000,
          makingCharges: 8000,
          itemTotal: 46400,
          description: '18K Gold Diamond Ring'
        }
      ],
      subtotal: 46400,
      tax: 1392,
      total: 47792,
      date: new Date('2024-01-16'),
      createdBy: 'Shop Owner',
      shopId: '1',
      shopName: 'Golden Jewelers'
    }
  ];

  getReceipts(shopId?: string): Observable<Receipt[]> {
    if (shopId) {
      return of(this.receipts.filter(r => r.shopId === shopId));
    }
    return of(this.receipts);
  }

  getReceipt(id: string): Observable<Receipt | undefined> {
    return of(this.receipts.find(r => r.id === id));
  }

  createReceipt(receipt: Omit<Receipt, 'id' | 'invoiceNumber' | 'date'>): Observable<Receipt> {
    const newReceipt: Receipt = {
      ...receipt,
      id: Date.now().toString(),
      invoiceNumber: `INV-2024-${String(this.receipts.length + 1).padStart(3, '0')}`,
      date: new Date()
    };
    
    this.receipts.push(newReceipt);
    return of(newReceipt);
  }

  getTotalSales(shopId?: string): Observable<number> {
    const filteredReceipts = shopId 
      ? this.receipts.filter(r => r.shopId === shopId)
      : this.receipts;
    
    const total = filteredReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
    return of(total);
  }

  getTodaysSales(shopId?: string): Observable<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filteredReceipts = shopId 
      ? this.receipts.filter(r => r.shopId === shopId && r.date >= today)
      : this.receipts.filter(r => r.date >= today);
    
    const total = filteredReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
    return of(total);
  }

  getReceiptCount(shopId?: string): Observable<number> {
    const count = shopId 
      ? this.receipts.filter(r => r.shopId === shopId).length
      : this.receipts.length;
    
    return of(count);
  }
}
