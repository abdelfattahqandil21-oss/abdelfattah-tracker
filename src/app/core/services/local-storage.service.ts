import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private getKey(storeName: string): string {
    return `${storeName}`;
  }

  getAll<T>(storeName: string): T[] {
      const key = this.getKey(storeName);
      const data = localStorage.getItem(key);
      const result = data ? JSON.parse(data) : [];
      return result;
  }

  add<T>(storeName: string, value: T): void {
    const key = this.getKey(storeName);
    const currentData = this.getAll<T>(storeName);
    currentData.push(value);
    localStorage.setItem(key, JSON.stringify(currentData));
  }

  update<T>(storeName: string, value: T & { id: string }): void {
    const key = this.getKey(storeName);
    const currentData = this.getAll<T>(storeName);
    const index = currentData.findIndex((item: any) => item.id === value.id);
    
    if (index !== -1) {
        currentData[index] = value;
        localStorage.setItem(key, JSON.stringify(currentData));
    }
  }

  delete(storeName: string, id: string): void {
    const key = this.getKey(storeName);
    const currentData = this.getAll(storeName);
    const filteredData = currentData.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filteredData));
  }

  clearStore(storeName: string): void {
    const key = this.getKey(storeName);
    localStorage.removeItem(key);
  }

  clearAll(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(''));
    keys.forEach(key => localStorage.removeItem(key));
  }
}
