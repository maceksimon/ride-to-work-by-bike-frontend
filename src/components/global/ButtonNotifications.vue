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
import { defineComponent, ref } from 'vue';

// components
import DialogDefault from './DialogDefault.vue';

// composables
import { useFormatDate } from '../../composables/useFormatDate';

// config
import { routesConf } from '../../router/routes_conf';

export default defineComponent({
  name: 'ButtonNotifications',
  components: {
    DialogDefault,
  },
  setup() {
    const notificationsCount = ref(2);
    const isDialogOpen = ref(false);

    const { formatDateTimeLabel } = useFormatDate();

    const openDialog = (): void => {
      isDialogOpen.value = true;
    };

    const markAllAsRead = (): void => {
      notificationsCount.value = 0;
    };

    return {
      formatDateTimeLabel,
      isDialogOpen,
      notificationsCount,
      openDialog,
      routesConf,
      markAllAsRead,
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
        data-cy="button-help"
      >
        <q-badge
          floating
          rounded
          v-if="notificationsCount > 0"
          color="red"
          style="z-index: 1"
        >
          {{ notificationsCount }}
        </q-badge>
        <q-icon
          name="svguse:/icons/custom.svg#bell"
          size="18px"
          color="white"
          data-cy="icon-help"
        />
      </q-btn>
    </slot>
    <dialog-default
      no-padding
      v-model="isDialogOpen"
      min-width="0"
      data-cy="dialog-help"
    >
      <template #title>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-weight-bold text-grey-10">
              {{ $t('notifications.title') }}
            </h3>
            <q-badge v-if="notificationsCount > 0" color="red" class="q-ml-md">
              {{ notificationsCount }}
            </q-badge>
          </div>
          <div>
            <q-btn
              flat
              :to="routesConf['profile_notifications'].children.fullPath"
            >
              {{ $t('notifications.buttonNotificationHistory') }}
            </q-btn>
          </div>
        </div>
      </template>
      <template #content>
        <div>
          <div>
            <q-btn flat color="primary" @click="markAllAsRead">
              {{ $t('notifications.buttonMarkAllAsRead') }}
            </q-btn>
          </div>
          <q-list bordered>
            <q-item
              v-for="notification in notifications"
              :key="notification.id"
              class="q-my-sm"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-avatar
                  v-if="notification.data.icon"
                  color="primary"
                  text-color="white"
                >
                  <q-icon :name="notification.data.icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label v-if="notification.verb">{{
                  notification.verb
                }}</q-item-label>
                <q-item-label
                  v-if="notification.description"
                  caption
                  lines="1"
                  >{{
                    formatDateTimeLabel(notification.timestamp)
                  }}</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <q-icon name="chat_bubble" color="green" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
