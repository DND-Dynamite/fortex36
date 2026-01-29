
import { SensorReading, Alert, LabResult, UserProfile } from '../types';
import initSqlJs from 'sql.js';

let dbInstance: any = null;

const initDb = async () => {
  if (dbInstance) return dbInstance;
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  dbInstance = new SQL.Database();
  
  // Initialize Tables
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS readings (
      timestamp INTEGER PRIMARY KEY,
      heartRate REAL,
      spo2 REAL,
      bodyTemp REAL,
      airQuality REAL,
      systolic REAL,
      diastolic REAL,
      glucose REAL,
      steps INTEGER,
      sleepQuality REAL,
      movementX REAL,
      movementY REAL,
      movementZ REAL
    );
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      timestamp INTEGER,
      type TEXT,
      title TEXT,
      message TEXT,
      isRead INTEGER
    );
    CREATE TABLE IF NOT EXISTS lab_results (
      id TEXT PRIMARY KEY,
      timestamp INTEGER,
      parameter TEXT,
      value TEXT,
      unit TEXT,
      doctorNotes TEXT
    );
    CREATE TABLE IF NOT EXISTS profile (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
  
  return dbInstance;
};

export const db = {
  // We use async wrappers to ensure DB is initialized
  saveReadings: async (readings: SensorReading[]) => {
    const database = await initDb();
    // For simplicity, we clear and re-insert for the history buffer, or just insert new ones
    // In a live system, we'd just INSERT. Here we'll maintain the last 60 as per constants.
    database.run("DELETE FROM readings");
    const stmt = database.prepare("INSERT INTO readings VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
    readings.forEach(r => {
      stmt.run([r.timestamp, r.heartRate, r.spo2, r.bodyTemp, r.airQuality, r.systolic, r.diastolic, r.glucose, r.steps, r.sleepQuality, r.movementX, r.movementY, r.movementZ]);
    });
    stmt.free();
    // Persist to localStorage as a backup
    localStorage.setItem('safetynet_readings', JSON.stringify(readings));
  },
  
  getReadings: (): SensorReading[] => {
    const data = localStorage.getItem('safetynet_readings');
    return data ? JSON.parse(data) : [];
  },

  saveAlerts: async (alerts: Alert[]) => {
    const database = await initDb();
    database.run("DELETE FROM alerts");
    const stmt = database.prepare("INSERT INTO alerts VALUES (?,?,?,?,?,?)");
    alerts.forEach(a => {
      stmt.run([a.id, a.timestamp, a.type, a.title, a.message, a.isRead ? 1 : 0]);
    });
    stmt.free();
    localStorage.setItem('safetynet_alerts', JSON.stringify(alerts));
  },

  getAlerts: (): Alert[] => {
    const data = localStorage.getItem('safetynet_alerts');
    return data ? JSON.parse(data) : [];
  },

  saveLabResults: async (results: LabResult[]) => {
    const database = await initDb();
    database.run("DELETE FROM lab_results");
    const stmt = database.prepare("INSERT INTO lab_results VALUES (?,?,?,?,?,?)");
    results.forEach(r => {
      stmt.run([r.id, r.timestamp, r.parameter, r.value, r.unit, r.doctorNotes]);
    });
    stmt.free();
    localStorage.setItem('safetynet_lab_results', JSON.stringify(results));
  },

  getLabResults: (): LabResult[] => {
    const data = localStorage.getItem('safetynet_lab_results');
    return data ? JSON.parse(data) : [];
  },

  saveProfile: async (profile: UserProfile) => {
    const database = await initDb();
    database.run("REPLACE INTO profile (key, value) VALUES ('current_user', ?)", [JSON.stringify(profile)]);
    localStorage.setItem('safetynet_profile', JSON.stringify(profile));
  },

  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem('safetynet_profile');
    return data ? JSON.parse(data) : null;
  },

  // SQL Debugger: Run arbitrary queries
  query: async (sql: string) => {
    const database = await initDb();
    try {
      const res = database.exec(sql);
      return res;
    } catch (e) {
      console.error("SQL Error:", e);
      return [];
    }
  },

  save: (key: string, value: any) => {
    localStorage.setItem(`safetynet_ext_${key}`, JSON.stringify(value));
  },

  get: <T>(key: string): T | null => {
    const data = localStorage.getItem(`safetynet_ext_${key}`);
    return data ? JSON.parse(data) : null;
  },

  clear: () => {
    localStorage.clear();
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
  }
};
