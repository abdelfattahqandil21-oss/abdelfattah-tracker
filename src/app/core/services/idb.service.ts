import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IDBService {
  private db: IDBDatabase | null = null;

  open(dbName: string, storeName: string): Promise<IDBDatabase | null> {
    console.log(`[IDBService] Opening database '${dbName}' with store '${storeName}'`);
    return new Promise((resolve, reject) => {
      // Use version 4 to trigger upgrade and create all stores
      const req = indexedDB.open(dbName, 4);

      req.onupgradeneeded = () => {
        console.log(`[IDBService] Database upgrade needed for '${dbName}'`);
        const db = req.result;
        // Create all known stores
        const stores = ['tasks', 'sugar-entries', 'evaluations', 'notes'];
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            console.log(`[IDBService] Creating object store '${store}'`);
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
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

  add<T>(storeName: string, value: T): Promise<void> {
    console.log(`[IDBService] Adding to store '${storeName}':`, value);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const request = tx.objectStore(storeName).add(value);

        request.onsuccess = () => {
          console.log(`[IDBService] Successfully added to '${storeName}'`);
          resolve();
        };

        request.onerror = (event) => {
          console.error(`[IDBService] Error adding to '${storeName}':`, request.error);
          reject(request.error);
        };

        tx.oncomplete = () => console.log(`[IDBService] Transaction for adding to '${storeName}' completed`);
        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${storeName}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in add to '${storeName}':`, error);
        reject(error);
      }
    });
  }

  update<T>(storeName: string, value: T): Promise<void> {
    console.log(`[IDBService] Updating in store '${storeName}':`, value);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const request = tx.objectStore(storeName).put(value);

        request.onsuccess = () => {
          console.log(`[IDBService] Successfully updated in '${storeName}'`);
          resolve();
        };

        request.onerror = (event) => {
          console.error(`[IDBService] Error updating in '${storeName}':`, request.error);
          reject(request.error);
        };

        tx.oncomplete = () => console.log(`[IDBService] Transaction for updating in '${storeName}' completed`);
        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${storeName}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in update in '${storeName}':`, error);
        reject(error);
      }
    });
  }

  delete(storeName: string, id: string): Promise<void> {
    console.log(`[IDBService] Deleting from store '${storeName}' with id '${id}'`);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const request = tx.objectStore(storeName).delete(id);

        request.onsuccess = () => {
          console.log(`[IDBService] Successfully deleted from '${storeName}'`);
          resolve();
        };

        request.onerror = (event) => {
          console.error(`[IDBService] Error deleting from '${storeName}':`, request.error);
          reject(request.error);
        };

        tx.oncomplete = () => console.log(`[IDBService] Transaction for deleting from '${storeName}' completed`);
        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${storeName}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in delete from '${storeName}':`, error);
        reject(error);
      }
    });
  }

  getAll<T>(storeName: string): Promise<T[]> {
    console.log(`[IDBService] Getting all from '${storeName}'`);
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(storeName, 'readonly');
        const request = tx.objectStore(storeName).getAll();

        request.onsuccess = () => {
          console.log(`[IDBService] Retrieved ${request.result.length} items from '${storeName}'`);
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error(`[IDBService] Error getting all from '${storeName}':`, request.error);
          reject(request.error);
        };

        tx.onerror = (event) => {
          console.error(`[IDBService] Transaction error in '${storeName}':`, tx.error);
          reject(tx.error);
        };
      } catch (error) {
        console.error(`[IDBService] Exception in getAll from '${storeName}':`, error);
        reject(error);
      }
    });
  }
}