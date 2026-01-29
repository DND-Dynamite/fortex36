
import { AnalysisResult, ImageFilters } from "../types";

export interface SavedScan {
  id: string;
  timestamp: number;
  image: string;
  result: AnalysisResult | null;
  filters: ImageFilters;
  name: string;
}

const DB_NAME = 'RadianceScanArchive';
const STORE_NAME = 'scans';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveToArchive = async (scan: Omit<SavedScan, 'id' | 'timestamp'>): Promise<string> => {
  const db = await openDB();
  const id = crypto.randomUUID();
  const timestamp = Date.now();
  const newScan: SavedScan = { ...scan, id, timestamp };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newScan);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const getArchive = async (): Promise<SavedScan[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a: any, b: any) => b.timestamp - a.timestamp));
    request.onerror = () => reject(request.error);
  });
};

export const deleteFromArchive = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
