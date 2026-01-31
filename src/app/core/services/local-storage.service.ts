import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private prefix = 'venofy-tracker-';

  private getKey(storeName: string): string {
    return `${this.prefix}${storeName}`;
  }

  getAll<T>(storeName: string): T[] {
    console.log(`[LocalStorageService] Getting all from store '${storeName}'`);
    try {
      const key = this.getKey(storeName);
      const data = localStorage.getItem(key);
      const result = data ? JSON.parse(data) : [];
      console.log(`[LocalStorageService] Retrieved ${result.length} items from '${storeName}'`);
      return result;
    } catch (error) {
      console.error(`[LocalStorageService] Error getting all from '${storeName}':`, error);
      return [];
    }
  }

  add<T>(storeName: string, value: T): void {
    console.log(`[LocalStorageService] Adding to store '${storeName}':`, value);
    try {
      const key = this.getKey(storeName);
      const currentData = this.getAll<T>(storeName);
      currentData.push(value);
      localStorage.setItem(key, JSON.stringify(currentData));
      console.log(`[LocalStorageService] Successfully added to '${storeName}'`);
    } catch (error) {
      console.error(`[LocalStorageService] Error adding to '${storeName}':`, error);
      throw error;
    }
  }

  update<T>(storeName: string, value: T & { id: string }): void {
    console.log(`[LocalStorageService] Updating in store '${storeName}':`, value);
    try {
      const key = this.getKey(storeName);
      const currentData = this.getAll<T>(storeName);
      const index = currentData.findIndex((item: any) => item.id === value.id);
      
      if (index !== -1) {
        currentData[index] = value;
        localStorage.setItem(key, JSON.stringify(currentData));
        console.log(`[LocalStorageService] Successfully updated in '${storeName}'`);
      } else {
        console.warn(`[LocalStorageService] Item with id ${value.id} not found in '${storeName}'`);
      }
    } catch (error) {
      console.error(`[LocalStorageService] Error updating in '${storeName}':`, error);
      throw error;
    }
  }

  delete(storeName: string, id: string): void {
    console.log(`[LocalStorageService] Deleting from store '${storeName}' with id '${id}'`);
    try {
      const key = this.getKey(storeName);
      const currentData = this.getAll(storeName);
      const filteredData = currentData.filter((item: any) => item.id !== id);
      localStorage.setItem(key, JSON.stringify(filteredData));
      console.log(`[LocalStorageService] Successfully deleted from '${storeName}'`);
    } catch (error) {
      console.error(`[LocalStorageService] Error deleting from '${storeName}':`, error);
      throw error;
    }
  }

  clearStore(storeName: string): void {
    console.log(`[LocalStorageService] Clearing store '${storeName}'`);
    try {
      const key = this.getKey(storeName);
      localStorage.removeItem(key);
      console.log(`[LocalStorageService] Successfully cleared store '${storeName}'`);
    } catch (error) {
      console.error(`[LocalStorageService] Error clearing store '${storeName}':`, error);
      throw error;
    }
  }

  clearAll(): void {
    console.log(`[LocalStorageService] Clearing all stores`);
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => localStorage.removeItem(key));
      console.log(`[LocalStorageService] Successfully cleared all stores`);
    } catch (error) {
      console.error(`[LocalStorageService] Error clearing all stores:`, error);
      throw error;
    }
  }
}
