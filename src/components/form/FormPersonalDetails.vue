<script lang="ts">
/**
 * FormPersonalDetails Component
 *
 * The `FormPersonalDetails`
 *
 * @description * Use this component to display contact details form.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render name, surname, nickname...
 * - `FormFieldRadioRequired`: Component to render gender radio buttons.
 *
 * @example
 * <form-personal-details />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A102976&mode=dev)
 */

// libraries
import { defineComponent, reactive, watch } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldRadioRequired from './FormFieldRadioRequired.vue';

// composables
import { i18n } from 'src/boot/i18n';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import {
  FormOption,
  FormPersonalDetailsFields,
} from 'src/components/types/Form';

export default defineComponent({
  name: 'FormPersonalDetails',
  components: {
    FormFieldTextRequired,
    FormFieldRadioRequired,
  },
  setup() {
    const store = useRegisterChallengeStore();
    const personalDetails = reactive<FormPersonalDetailsFields>(
      store.getPersonalDetails,
    );

    watch(
      personalDetails,
      (newVal) => {
        store.setPersonalDetails(newVal);
      },
      { deep: true },
    );

    const newsletterOptions: FormOption[] = [
      {
        label: 'form.personalDetails.labelNewsletterAll',
        value: 'all',
      },
      {
        label: 'form.personalDetails.labelNewsletterChallenges',
        value: 'challenges',
      },
      {
        label: 'form.personalDetails.labelNewsletterEvents',
        value: 'events',
      },
      {
        label: 'form.personalDetails.labelNewsletterMobility',
        value: 'mobility',
      },
    ];

    const genderOptions: FormOption[] = [
      {
        label: i18n.global.t('global.man'),
        value: 'male',
      },
      {
        label: i18n.global.t('global.woman'),
        value: 'female',
      },
    ];

    return {
      genderOptions,
      newsletterOptions,
      personalDetails,
    };
  },
});
</script>

<template>
  <div>
    <div class="row q-col-gutter-md">
      <!-- Input: First name -->
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.firstName"
          name="firstName"
          label="form.labelFirstName"
          autocomplete="given-name"
          data-cy="form-personal-details-first-name"
        />
      </div>
      <!-- Input: Last name -->
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.lastName"
          name="lastName"
          label="form.labelLastName"
          autocomplete="family-name"
          data-cy="form-personal-details-last-name"
        />
      </div>
      <!-- Input: Nickname -->
      <div class="col-12">
        <div data-cy="form-personal-details-nickname">
          <label
            for="form-nickname"
            class="text-grey-10 text-caption text-bold"
          >
            {{ $t('form.labelNicknameOptional') }}
          </label>
          <q-input
            dense
            outlined
            type="text"
            v-model="personalDetails.nickname"
            name="nickname"
            :hint="$t('form.hintNickname')"
            id="form-nickname"
            class="q-mt-sm hint-no-padding"
            data-cy="form-nickname-input"
          />
        </div>
      </div>
      <!-- Input: Gender -->
      <div class="col-12" data-cy="form-personal-details-gender">
        <!-- Label -->
        <label for="form-gender" class="text-grey-10 text-caption text-bold">
          {{ $t('form.personalDetails.titleGender') }}
        </label>
        <!-- Radio group -->
        <form-field-radio-required
          inline
          v-model="personalDetails.gender"
          :options="genderOptions"
          :hint="$t('form.personalDetails.hintGender')"
          class="q-mt-sm"
        />
      </div>
      <!-- Input: Newsletter -->
      <div class="col-12" data-cy="form-personal-details-newsletter">
        <!-- Label -->
        <label for="form-gender" class="text-grey-10 text-caption text-bold">
          {{ $t('form.personalDetails.titleNewsletter') }}
        </label>
        <!-- Checkbox group -->
        <q-option-group
          dense
          v-model="personalDetails.newsletter"
          :options="newsletterOptions"
          color="primary"
          type="checkbox"
          class="q-gutter-md q-mt-xs"
          data-cy="form-newsletter-input"
        >
          <!-- Default slot: label (used so that label is translated dynamically) -->
          <template v-slot:label="option">
            {{ $t(option.label) }}
          </template>
        </q-option-group>
      </div>
      <!-- Input: confirm consent -->
      <div class="col-12" data-cy="form-personal-details-terms">
        <q-field
          dense
          borderless
          hide-bottom-space
          :model-value="personalDetails.terms"
          :rules="[(val) => !!val || $t('form.messageTermsRequired')]"
        >
          <q-checkbox
            dense
            id="form-personal-details-terms"
            v-model="personalDetails.terms"
            color="primary"
            :true-value="true"
            :false-value="false"
            rules="required"
            class="text-grey-10"
            data-cy="form-terms-input"
          >
            <!-- Default slot: label -->
            <span>
              {{ $t('form.labelPrivacyConsent') }}
              <!-- Link: terms -->
              <!-- TODO: Link to terms page -->
              <a
                href="#"
                target="_blank"
                class="text-primary"
                @click.stop
                data-cy="form-terms-link"
                >{{ $t('form.linkPrivacyConsent') }}</a
              >.
            </span>
          </q-checkbox>
        </q-field>
      </div>
    </div>
  </div>
</template>

<style>
.hint-no-padding {
  .q-field__bottom {
    padding: 8px 0 0;
  }
}
</style>
