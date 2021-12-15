export type NotificationType =
  | 'DAILY_LOG'
  | 'CHECKIN_REMINDER'
  | 'CHAT_MESSAGE';

export interface NotificationData {
  id: string;
  type: NotificationType;
  data?: Record<string, any>;
}
