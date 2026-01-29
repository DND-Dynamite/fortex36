
import { Alarm, Stakeholder, NotificationLog } from "../types";

/**
 * Dispatches an alarm to all relevant active stakeholders.
 * Following the requirement to send exactly what the alert system provides.
 */
export const dispatchAlarm = (alarm: Alarm, stakeholders: Stakeholder[]): { 
  logs: NotificationLog[], 
  notifiedIds: string[] 
} => {
  // Select active stakeholders to receive the alert
  const activeStakeholders = stakeholders.filter(s => s.isActive);
  
  // In a real-world scenario, you might filter by role here, 
  // but for a direct "send whatever" system, we broadcast to all active personnel.
  const recipients = activeStakeholders;

  const logs: NotificationLog[] = recipients.map(s => ({
    id: `log-${Math.random().toString(36).substr(2, 5)}`,
    alarmId: alarm.id,
    stakeholderId: s.id,
    message: alarm.description, // Exactly what the alert system wants to send
    sentAt: Date.now(),
    method: 'EMAIL',
    status: 'SENT'
  }));

  return {
    logs,
    notifiedIds: recipients.map(r => r.id)
  };
};
