
export enum Severity {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export enum AlarmStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  ACKNOWLEDGED = 'ACKNOWLEDGED'
}

export enum StakeholderRole {
  ENGINEER = 'ENGINEER',
  MANAGER = 'MANAGER',
  SECURITY = 'SECURITY',
  EXECUTIVE = 'EXECUTIVE'
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StakeholderRole;
  isActive: boolean;
}

export interface Alarm {
  id: string;
  timestamp: number;
  source: string;
  type: string;
  description: string;
  severity: Severity;
  status: AlarmStatus;
  analysis?: string;
  notifiedStakeholders: string[]; // IDs
}

export interface NotificationLog {
  id: string;
  alarmId: string;
  stakeholderId: string;
  message: string;
  sentAt: number;
  method: 'EMAIL' | 'SMS' | 'PUSH';
  status: 'SENT' | 'FAILED' | 'DELIVERED';
}
