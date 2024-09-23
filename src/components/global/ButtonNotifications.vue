<script lang="ts">
/**
 * ButtonNotifications Component
 *
 * @description * Use this component to render a notification button with
 * a dialog popup, containing a list of unread notifications.
 *
 * Used in `DrawerHeader` component.
 *
 * @slots
 * - `button`: For rendering a custom button
 *   exposed methods:
 *     - `openDialog`
 *
 * @components
 * - `DialogDefault`: Component to render a dialog with notifications.
 *
 * @example
 * <button-notifications>
 *  <template #button>
 *    <q-btn>
 *      <q-icon name="notifications" />
 *    </q-btn>
 *  </template>
 * </button-notifications>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=3cf3dt8cy6quEPfT-1)
 */

// libraries
import { defineComponent, ref, computed } from 'vue';

// components
import DialogDefault from './DialogDefault.vue';

// composables
import { useFormatDate } from '../../composables/useFormatDate';

// config
import { routesConf } from '../../router/routes_conf';

// fixtures
import notificationFixture from '../../../test/cypress/fixtures/buttonNotifications.json';

// types
import type { Notification } from '../types/Notifications';

export default defineComponent({
  name: 'ButtonNotifications',
  components: {
    DialogDefault,
  },
  setup() {
    const notifications = ref<Notification[]>(notificationFixture);
    const notificationsUnread = computed<Notification[]>(() =>
      notifications.value.filter((notification) => notification.unread),
    );
    const notificationsUnreadCount = computed<number>(
      () => notificationsUnread.value.length,
    );
    const isDialogOpen = ref<boolean>(false);

    const { formatDateTimeLabel } = useFormatDate();

    const openDialog = (): void => {
      isDialogOpen.value = true;
    };

    const markAsRead = (notification: Notification): void => {
      notification.unread = false;
    };

    const markAllAsRead = (): void => {
      notificationsUnread.value.forEach((notification) => {
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
      formatDateTimeLabel,
      isDialogOpen,
      markAllAsRead,
      markAsRead,
      notificationsUnread,
      notificationsUnreadCount,
      openDialog,
      onNotificationClick,
      routesConf,
    };
  },
});
</script>

<template>
  <div>
    <slot name="button" :open-dialog="openDialog">
      <!-- Default slot button -->
      <q-btn
        unelevated
        round
        color="primary"
        size="8px"
        @click.prevent="openDialog"
        data-cy="button-notifications"
      >
        <q-badge
          floating
          rounded
          v-if="notificationsUnreadCount > 0"
          color="red"
          style="z-index: 1"
          data-cy="notifications-count-badge"
        >
          {{ notificationsUnreadCount }}
        </q-badge>
        <q-icon
          name="svguse:/icons/custom.svg#bell"
          size="18px"
          color="white"
          data-cy="notifications-icon"
        />
      </q-btn>
    </slot>
    <dialog-default
      no-padding
      v-model="isDialogOpen"
      min-width="0"
      data-cy="notifications-dialog"
    >
      <template #title>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center justify-between">
            <h3
              class="text-h6 text-weight-normal text-grey-10 q-my-none"
              data-cy="notifications-title"
            >
              {{ $t('notifications.dialogTitle') }}
            </h3>
            <q-badge
              v-if="notificationsUnreadCount > 0"
              color="red"
              class="q-ml-md"
              data-cy="notifications-count-badge-dialog"
            >
              {{ notificationsUnreadCount }}
            </q-badge>
          </div>
          <div>
            <q-btn
              flat
              color="primary"
              :to="routesConf['profile_notifications'].children.fullPath"
              data-cy="notifications-history-button"
            >
              {{ $t('notifications.buttonNotificationHistory') }}
            </q-btn>
          </div>
        </div>
      </template>
      <template #content>
        <div
          v-if="notificationsUnreadCount > 0"
          class="flex items-center justify-end q-px-md"
        >
          <q-btn
            flat
            color="primary"
            @click="markAllAsRead"
            data-cy="mark-all-read-button"
          >
            {{ $t('notifications.buttonMarkAllAsRead') }}
          </q-btn>
        </div>
        <div v-else class="q-px-md" data-cy="no-unread-notifications">
          <p class="text-grey-10 q-my-sm">
            {{ $t('notifications.textNoUnreadNotifications') }}
          </p>
        </div>
        <q-list data-cy="notifications-list">
          <q-item
            v-for="notification in notificationsUnread"
            :key="notification.id"
            class="q-my-sm"
            clickable
            v-ripple
            :data-cy="`notification-item-${notification.id}`"
            @click="onNotificationClick(notification)"
          >
            <q-item-section avatar>
              <q-avatar
                v-if="notification.data.icon"
                color="primary"
                text-color="white"
                :data-cy="`notification-icon-${notification.id}`"
              >
                <q-icon :name="notification.data.icon" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label
                v-if="notification.verb"
                :data-cy="`notification-verb-${notification.id}`"
              >
                {{ notification.verb }}
              </q-item-label>
              <q-item-label
                v-if="notification.description"
                caption
                lines="1"
                :data-cy="`notification-timestamp-${notification.id}`"
              >
                {{ formatDateTimeLabel(notification.timestamp) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                round
                flat
                size="sm"
                :outline="!notification.unread"
                :disabled="!notification.unread"
                color="primary"
                :icon="
                  notification.unread
                    ? 'mdi-email-check-outline'
                    : 'mdi-email-open-outline'
                "
                @click.stop="markAsRead(notification)"
                :data-cy="`notification-state-icon-${notification.id}`"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </dialog-default>
  </div>
</template>
