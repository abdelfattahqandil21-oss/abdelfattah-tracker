import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IDBService {
  private db: IDBDatabase | null = null;

  open(dbName: string, storeName: string): Promise<IDBDatabase> {
    console.log(`[IDBService] Opening database '${dbName}' with store '${storeName}'`);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);

      req.onupgradeneeded = () => {
        console.log(`[IDBService] Database upgrade needed for '${dbName}'`);
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          console.log(`[IDBService] Creating object store '${storeName}'`);
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };

      req.onerror = (event) => {
        console.error(`[IDBService] Error opening database:`, req.error);
        reject(req.error);
      };
      
      req.onsuccess = () => {
        console.log(`[IDBService] Database '${dbName}' opened successfully`);
        this.db = req.result;
        resolve(req.result);
      };
    });
  }

  add<T>(store: string, value: T): Promise<void> {
    console.log(`[IDBService] Adding to store '${store}':`, value);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(store, 'readwrite');
        const request = tx.objectStore(store).add(value);
        
        request.onsuccess = () => {
          console.log(`[IDBService] Successfully added to '${store}'`);
          resolve();
        };
        
        request.onerror = (event) => {
          console.error(`[IDBService] Error adding to '${store}':`, request.error);
          reject(request.error);
        };
        
        tx.oncomplete = () => console.log(`[IDBService] Transaction for adding to '${store}' completed`);
        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${store}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in add to '${store}':`, error);
        reject(error);
      }
    });
  }

  update<T>(store: string, value: T): Promise<void> {
    console.log(`[IDBService] Updating in store '${store}':`, value);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(store, 'readwrite');
        const request = tx.objectStore(store).put(value);
        
        request.onsuccess = () => {
          console.log(`[IDBService] Successfully updated in '${store}'`);
          resolve();
        };
        
        request.onerror = (event) => {
          console.error(`[IDBService] Error updating in '${store}':`, request.error);
          reject(request.error);
        };
        
        tx.oncomplete = () => console.log(`[IDBService] Transaction for updating in '${store}' completed`);
        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${store}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in update in '${store}':`, error);
        reject(error);
      }
    });
  }

  delete(store: string, id: string): Promise<void> {
    console.log(`[IDBService] Deleting from store '${store}' with id '${id}'`);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(store, 'readwrite');
        const request = tx.objectStore(store).delete(id);
        
        request.onsuccess = () => {
          console.log(`[IDBService] Successfully deleted from '${store}'`);
          resolve();
        };
        
        request.onerror = (event) => {
          console.error(`[IDBService] Error deleting from '${store}':`, request.error);
          reject(request.error);
        };
        
        tx.oncomplete = () => console.log(`[IDBService] Transaction for deleting from '${store}' completed`);
        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${store}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in delete from '${store}':`, error);
        reject(error);
      }
    });
  }

  getAll<T>(store: string): Promise<T[]> {
    console.log(`[IDBService] Getting all from '${store}'`);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(store, 'readonly');
        const request = tx.objectStore(store).getAll();
        
        request.onsuccess = () => {
          console.log(`[IDBService] Retrieved ${request.result.length} items from '${store}'`);
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error(`[IDBService] Error getting all from '${store}':`, request.error);
          reject(request.error);
        };
        
        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${store}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in getAll from '${store}':`, error);
        reject(error);
      }
    });
  }
}