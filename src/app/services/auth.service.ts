import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async login(email: string, password: string): Promise<User> {
    // This is a mock implementation. Replace with actual API call
    const mockUser: User = {
      id: '1',
      email: email,
      role: email.includes('admin') ? UserRole.ADMIN : UserRole.CUSTOMER,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
    };

    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    return mockUser;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    // This is a mock implementation. Replace with actual API call
    const mockUser: User = {
      id: '1',
      email: userData.email,
      role: UserRole.CUSTOMER,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date(),
    };

    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    return mockUser;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserValue?.role === role;
  }
}
