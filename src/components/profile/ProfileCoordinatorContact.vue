<script lang="ts">
/**
 * ProfileCoordinatorContact Component
 *
 * @description * Use this component to display a card with contact
 * instructions.
 *
 * Used in `ProfileDetails` component.
 *
 * @props
 * - `coordinator` (ProfileCoordinator, required): Coordinator contact details.
 *   It should be of type `ProfileCoordinator`.
 *
 * @example
 * <profile-coordinator-contact :coordinator="coordinator">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=WcrxMvLONggUrjGt-1)
 */

// libraries
import { defineComponent, PropType } from 'vue';
import { ProfileCoordinator } from '../../types/Profile';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'ProfileCoordinatorContact',
  props: {
    coordinator: {
      type: Object as PropType<ProfileCoordinator>,
      required: true,
    },
  },
  setup() {
    const avatarSize = '56px';
    const iconSize = '18px';

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      avatarSize,
      iconSize,
      borderRadius,
    };
  },
});
</script>

<template>
  <div
    class="text-grey-10"
    data-cy="profile-coordinator-contact"
    :style="{ borderRadius }"
  >
    <div>
      <div
        data-cy="contact-message"
        v-html="$t('profile.textCoordinatorContact')"
      />
    </div>
    <div class="flex items-center gap-12 q-mt-md">
      <q-avatar data-cy="coordinator-avatar" :size="avatarSize">
        <q-img
          ratio="1"
          :src="coordinator.image"
          placeholder-src="~assets/image/profile-coordinator-contact/profile-placeholder.webp"
          :alt="coordinator.name"
        />
      </q-avatar>
      <div>
        <div data-cy="coordinator-name" class="text-weight-bold q-mt-sm">
          {{ coordinator.name }}
        </div>
        <div
          class="flex items-center gap-8 gap-x-24 q-mt-sm"
          data-cy="coordinator-contact"
        >
          <div data-cy="coordinator-phone">
            <q-icon name="phone" :size="iconSize" />
            {{ coordinator.phone }}
          </div>
          <div data-cy="coordinator-email">
            <q-icon name="email" :size="iconSize" />
            {{ coordinator.email }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
