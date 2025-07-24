import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Receipt, User } from '../../../../Models/receipt.model';
import { AuthService } from '../../../Shared/services/auth/auth.service';
import { ReceiptService } from '../../../Shared/services/receipt/receipt.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-receipt-create',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './receipt-create.component.html',
  styleUrl: './receipt-create.component.scss'
})
export class ReceiptCreateComponent {
 receiptForm :any= FormGroup;
  currentUser: User | null = null;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private receiptService: ReceiptService,
    private router: Router
  ) {
    this.receiptForm = this.fb.group({
      customerName: ['', Validators.required],
      customerMobile: ['', [Validators.required, Validators.pattern(/^\+91-[0-9]{10}$/)]],
      items: this.fb.array([this.createItemGroup()]),
      subtotal: [0],
      tax: [0],
      total: [0]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser || this.currentUser.role !== 'ShopOwner') {
      this.router.navigate(['/login']);
    }
  }

  get itemsFormArray(): FormArray {
    return this.receiptForm.get('items') as FormArray;
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      description: [''],
      weight: [0, [Validators.required, Validators.min(0.01)]],
      pricePerGram: [0, [Validators.required, Validators.min(0.01)]],
      makingCharges: [0],
      itemTotal: [0]
    });
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.calculateSubtotal();
  }

  calculateItemTotal(index: number): void {
    const item = this.itemsFormArray.at(index);
    const weight = item.get('weight')?.value || 0;
    const pricePerGram = item.get('pricePerGram')?.value || 0;
    const makingCharges = item.get('makingCharges')?.value || 0;

    const itemTotal = (weight * pricePerGram) + makingCharges;
    item.get('itemTotal')?.setValue(itemTotal);

    this.calculateSubtotal();
  }

  calculateSubtotal(): void {
    let subtotal = 0;
    this.itemsFormArray.controls.forEach(item => {
      subtotal += item.get('itemTotal')?.value || 0;
    });
    
    this.receiptForm.get('subtotal')?.setValue(subtotal);
    this.calculateTotal();
  }

  calculateTotal(): void {
    const subtotal = this.receiptForm.get('subtotal')?.value || 0;
    const tax = this.receiptForm.get('tax')?.value || 0;
    const total = subtotal + tax;
    
    this.receiptForm.get('total')?.setValue(total);
  }

  onSubmit(): void {
    if (this.receiptForm.valid && this.currentUser) {
      this.saving = true;

      const formValue = this.receiptForm.value;
      const receipt: Omit<Receipt, 'id' | 'invoiceNumber' | 'date'> = {
        customerName: formValue.customerName,
        customerMobile: formValue.customerMobile,
        items: formValue.items.map((item: any, index: number) => ({
          id: (index + 1).toString(),
          ...item
        })),
        subtotal: formValue.subtotal,
        tax: formValue.tax,
        total: formValue.total,
        createdBy: this.currentUser.name,
        shopId: this.currentUser.shopId!,
        shopName: this.currentUser.shop!.name
      };

      this.receiptService.createReceipt(receipt).subscribe({
        next: (createdReceipt) => {
          this.saving = false;
          this.router.navigate(['/receipt/view', createdReceipt.id]);
        },
        error: (error) => {
          this.saving = false;
          console.error('Error creating receipt:', error);
        }
      });
    }
  }
}
