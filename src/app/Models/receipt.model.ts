export interface Receipt {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerMobile: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
  createdBy: string;
  shopId: string;
  shopName: string;
}

export interface ReceiptItem {
  id: string;
  itemName: string;
  weight: number;
  pricePerGram: number;
  makingCharges: number;
  itemTotal: number;
  description?: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  gstNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ShopOwner' | 'SuperAdmin';
  shopId?: string;
  shop?: Shop;
}