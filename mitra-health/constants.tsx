
import React from 'react';
import { Bed, LabOrder, QueueItem, InventoryItem } from './types';

export const MOCK_BEDS: Bed[] = [
  { id: '1', number: 'A-101', status: 'Occupied', patientName: 'John Doe', daysSinceAdmission: 3 },
  { id: '2', number: 'A-102', status: 'Available' },
  { id: '3', number: 'A-103', status: 'Cleaning' },
  { id: '4', number: 'A-104', status: 'Occupied', patientName: 'Sarah Smith', daysSinceAdmission: 5 },
  { id: '5', number: 'B-201', status: 'Available' },
  { id: '6', number: 'B-202', status: 'Occupied', patientName: 'Robert Brown', daysSinceAdmission: 1 },
  { id: '7', number: 'B-203', status: 'Cleaning' },
  { id: '8', number: 'B-204', status: 'Available' },
  { id: '9', number: 'C-301', status: 'Occupied', patientName: 'Emma Wilson', daysSinceAdmission: 12 },
  { id: '10', number: 'C-302', status: 'Available' },
  { id: '11', number: 'C-303', status: 'Available' },
  { id: '12', number: 'C-304', status: 'Available' },
];

export const MOCK_LAB_ORDERS: LabOrder[] = [
  { id: 'L001', testName: 'Complete Blood Count (CBC)', patientName: 'John Doe', status: 'Results-Ready', requestTime: '10:00 AM' },
  { id: 'L002', testName: 'Lipid Profile', patientName: 'Emma Wilson', status: 'In-Process', requestTime: '11:30 AM' },
  { id: 'L003', testName: 'HbA1c', patientName: 'Sarah Smith', status: 'Sample-Collected', requestTime: '12:15 PM' },
  { id: 'L004', testName: 'Liver Function Test', patientName: 'Robert Brown', status: 'Ordered', requestTime: '01:00 PM' },
];

export const MOCK_QUEUE: QueueItem[] = [
  { id: 'Q1', doctorName: 'Dr. Sarah Jenkins', nowConsulting: 'Alice Cooper', next3: ['Bob Marley', 'Charlie Puth', 'David Bowie'] },
  { id: 'Q2', doctorName: 'Dr. Michael Chen', nowConsulting: 'Frank Sinatra', next3: ['Grace Kelly', 'Harry Styles', 'Iris Apfel'] },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'I1', name: 'Surgical Gloves - Size 7', sku: 'SG-007', batch: 'B2201', expiry: '2025-12-01', stock: 450, isAsset: false },
  { id: 'I2', name: 'Ventilator V1', sku: 'VEN-V1', batch: 'ASSET-001', expiry: 'N/A', stock: 12, isAsset: true },
  { id: 'I3', name: 'Paracetamol 500mg', sku: 'PARA-500', batch: 'A102', expiry: '2024-06-15', stock: 1200, isAsset: false },
];
