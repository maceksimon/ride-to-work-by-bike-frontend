import { computed, reactive } from 'vue';
import notificationsFixture from '../../test/cypress/fixtures/notifications.json';
import type { Notification } from '../components/types/Notifications';

export const useNotifications = () => {
  const notifications = reactive<Notification[]>(notificationsFixture);

  const notificationsUnread = computed<Notification[]>(() =>
    notifications.filter((notification: Notification) => notification.unread),
  );

  const notificationsUnreadCount = computed<number>(
    () => notificationsUnread.value.length,
  );

  const markAsRead = (notification: Notification): void => {
    notification.unread = false;
  };

  const markAllAsRead = (): void => {
    notifications.forEach((notification: Notification) => {
      notification.unread = false;
    });
  };

  const onNotificationClick = (notification: Notification): void => {
    markAsRead(notification);
    if (notification.data.url) {
      window.location.href = notification.data.url;
    }
  };

  return {
    notifications,
    notificationsUnread,
    notificationsUnreadCount,
    markAsRead,
    markAllAsRead,
    onNotificationClick,
  };
};
