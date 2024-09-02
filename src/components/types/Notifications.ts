export interface Notification {
  mark_as_read: string;
  mark_as_unread: string;
  id: number;
  level: string;
  unread: boolean;
  deleted: boolean;
  verb: string;
  description: string | null;
  timestamp: string;
  data: {
    url: string;
    icon: string;
  };
}
