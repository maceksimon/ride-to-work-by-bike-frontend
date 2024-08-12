<script lang="ts">
/**
 * PersonalDetails Component
 *
 * @description * Use this component to ... .
 * You can adjust its appearance by ... .
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <PersonalDetails></PersonalDetails>
 *
 * @see [Figma Design](...)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PersonalDetails',
  setup() {
    const profile = {
      nickname: 'nickname',
    };

    return {
      profile,
    };
  },
});
</script>

<template>
  <div data-cy="personal-details">
    <h2 class="text-h6 text-weight-bold text-grey-10">
      {{ $t('profile.titlePersonalDetails') }}
    </h2>
    <div>
      <details-item
        editable
        :label="$t('profile.labelNickname')"
        :value="profile.nickname"
        :description="$t('profile.descriptionNickname')"
        :empty-label="$t('profile.labelNicknameEmpty')"
        data-cy="personal-details-nickname"
      >
        <template #form>
          <form-update-nickname />
        </template>
      </details-item>
    </div>
  </div>
</template>
