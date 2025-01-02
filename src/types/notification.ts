export type NotificationType = 'order' | 'system' | 'success' | 'alert' | 'food';

export interface Notification {
  notificationId?: string;
  type: string;
  title: string;
  content: string;
  activity?: string;
  path?: string;
  isRead?: boolean;
}