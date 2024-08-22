<script lang="ts">
/**
 * ProfileDetails Component
 *
 * @description * Use this component to display a ProfileDetails section
 * on the profile page.
 * Note: This component is used on `ProfilePage` in `ProfileTabs` component.
 *
 * @components
 * - `DetailsItem`: Component to display a row of data.
 * - `FormUpdateEmail`: Component to render a form for updating email.
 * - `FormUpdateGender`: Component to render a form for updating gender.
 * - `FormUpdateNickname`: Component to render a form for updating nickname.
 * - `LanguageSwitcher`: Component to render a language switcher.
 *
 * @example
 * <profile-details />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=31rhAtfu6ZZ8sEf1-1)
 */

// libraries
import { defineComponent, reactive } from 'vue';

// components
import DetailsItem from '../profile/DetailsItem.vue';
import FormUpdateEmail from '../form/FormUpdateEmail.vue';
import FormUpdateGender from '../form/FormUpdateGender.vue';
import FormUpdateNickname from '../form/FormUpdateNickname.vue';
import LanguageSwitcher from '../global/LanguageSwitcher.vue';

// fixtures
import formPersonalDetails from '../../../test/cypress/fixtures/formPersonalDetails.json';

// types
import type { Profile } from '../types/Profile';

export default defineComponent({
  name: 'ProfileDetails',
  components: {
    DetailsItem,
    FormUpdateEmail,
    FormUpdateGender,
    FormUpdateNickname,
    LanguageSwitcher,
  },
  setup() {
    const profile: Profile = reactive(formPersonalDetails as Profile);

    return {
      profile,
    };
  },
});
</script>

<template>
  <div data-cy="profile-details">
    <!-- Title -->
    <h2
      class="text-h6 text-grey-10 q-my-none"
      data-cy="profile-title-personal-details"
    >
      {{ $t('profile.titlePersonalDetails') }}
    </h2>
    <!-- Personal info -->
    <div class="q-mt-lg">
      <!-- Nickname -->
      <details-item
        editable
        :label="$t('profile.labelNickname')"
        :value="profile.nickname"
        :dialog-title="$t('profile.titleUpdateNickname')"
        :description="$t('profile.descriptionNickname')"
        :empty-label="$t('profile.labelNicknameEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-nickname"
      >
        <template #form="{ close }">
          <!-- Form: Update nickname -->
          <form-update-nickname
            :on-close="close"
            :value="profile.nickname"
            @update:value="profile.nickname = $event"
            data-cy="profile-details-form-nickname"
          />
        </template>
      </details-item>
      <!-- Email -->
      <details-item
        editable
        :label="$t('profile.labelEmail')"
        :value="profile.email"
        :dialog-title="$t('profile.titleUpdateEmail')"
        :empty-label="$t('profile.labelEmailEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-email"
      >
        <template #form="{ close }">
          <!-- Form: Update email -->
          <form-update-email
            :on-close="close"
            :value="profile.email"
            @update:value="profile.email = $event"
            data-cy="profile-details-form-email"
          />
        </template>
      </details-item>
      <!-- Gender -->
      <details-item
        editable
        :label="$t('profile.labelGender')"
        :value="profile.gender"
        :dialog-title="$t('profile.titleUpdateGender')"
        :empty-label="$t('profile.labelGenderEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-gender"
      >
        <template #form="{ close }">
          <!-- Form: Update gender -->
          <form-update-gender
            :on-close="close"
            :value="profile.gender"
            @update:value="profile.gender = $event"
            data-cy="profile-details-form-gender"
          />
        </template>
      </details-item>
      <!-- Language -->
      <details-item
        :label="$t('profile.labelLanguage')"
        :value="profile.language"
        :empty-label="$t('profile.labelLanguageEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-language"
      >
        <template #value>
          <!-- Language switcher -->
          <language-switcher
            variant="light"
            class="full-width justify-start"
            data-cy="profile-details-language-switcher"
          />
        </template>
      </details-item>
    </div>

    <!-- Title -->
    <h2
      class="text-h6 text-grey-10 q-mb-none q-mt-xl"
      data-cy="profile-title-challenge-details"
    >
      {{ $t('profile.titleChallengeDetails') }}
    </h2>

    <!-- Challenge details -->
    <div class="q-mt-lg">
      <div class="row q-col-gutter-lg">
        <!-- Organization type -->
        <details-item
          :label="$t('profile.labelOrganizationType')"
          :value="profile.organizationType"
          :empty-label="$t('profile.labelOrganizationTypeEmpty')"
          class="col-12 col-sm-6"
          data-cy="profile-details-organization-type"
        />
        <!-- Organization -->
        <details-item
          :label="$t('profile.labelOrganization')"
          :value="profile.organization"
          :empty-label="$t('profile.labelOrganizationEmpty')"
          class="col-12 col-sm-6"
          data-cy="profile-details-organization"
        />
      </div>
    </div>
  </div>
</template>
