<script lang="ts">
/**
 * PersonalDetails Component
 *
 * @description * Use this component to display a PersonalDetails section
 * on the profile page.
 * Note: This component is used on `ProfilePage`.
 *
 * @components
 * - `DetailsItem`: Component to display a row of data.
 *
 * @example
 * <personal-details />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=31rhAtfu6ZZ8sEf1-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import DetailsItem from '../../components/profile/DetailsItem.vue';

export default defineComponent({
  name: 'PersonalDetails',
  components: {
    DetailsItem,
  },
  setup() {
    const profile = {
      nickname: 'MyNickname',
    };

    return {
      profile,
    };
  },
});
</script>

<template>
  <div data-cy="personal-details">
    <!-- Title -->
    <h2
      class="text-h6 text-weight-bold text-grey-10 q-my-none"
      data-cy="personal-details-title"
    >
      {{ $t('profile.titlePersonalDetails') }}
    </h2>
    <!-- Details -->
    <div class="q-mt-lg">
      <!-- Nickname -->
      <details-item
        editable
        :label="$t('profile.labelNickname')"
        :value="profile.nickname"
        :dialog-title="$t('profile.titleUpdateNickname')"
        :description="$t('profile.descriptionNickname')"
        :empty-label="$t('profile.labelNicknameEmpty')"
        data-cy="personal-details-nickname"
      >
        <template #form>
          <!-- Form: Update nickname -->
          <form-update-nickname />
        </template>
      </details-item>
    </div>
  </div>
</template>
