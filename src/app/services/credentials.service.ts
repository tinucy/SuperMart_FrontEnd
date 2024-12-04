import { Injectable } from '@angular/core';
import { StoredCredentials } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private readonly STORAGE_KEY = 'savedCredentials';

  saveCredentials(credentials: StoredCredentials): void {
    // In a production environment, you should encrypt the password
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
  }

  getSavedCredentials(): StoredCredentials | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  clearSavedCredentials(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
