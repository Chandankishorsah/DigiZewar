import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User } from '../../../../Models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          name: email === 'admin@jewelry.com' ? 'Super Admin' : 'Shop Owner',
          email: email,
          role: email === 'admin@jewelry.com' ? 'SuperAdmin' : 'ShopOwner',
          shopId: email === 'admin@jewelry.com' ? undefined : '1',
          shop: email === 'admin@jewelry.com' ? undefined : {
            id: '1',
            name: 'Golden Jewelers',
            ownerName: 'Raj Kumar',
            email: 'raj@goldenjewelers.com',
            mobile: '+91-9876543210',
            address: '123 Main Street',
            city: 'Patna',
            state: 'Bihar',
            gstNumber: '10AABCU9603R1ZM'
          }
        };

        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        this.currentUserSubject.next(mockUser);
        observer.next(mockUser);
        observer.complete();
      }, 1000);
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'SuperAdmin';
  }
}
