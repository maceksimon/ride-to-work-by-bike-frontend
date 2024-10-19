<script lang="ts">
/**
 * FormRegisterCoordinator Component
 *
 * The `FormRegisterCoordinator` is used to allow coordinators to register.
 *
 * @description * Use this component to display registration form.
 *
 * Note: This component is commonly used in `RegisterCoordinatorPage`.
 *
 * @components
 * - `FormFieldCheckboxRequired`: Component to render checkbox input.
 * - `FormFieldCompany`: Component to render company input.
 * - `FormFieldEmail`: Component to render email input.
 * - `FormFieldPassword`: Component to render password input.
 * - `FormFieldPasswordConfirm`: Component to render password confirm input.
 * - `FormFieldPhone`: Component to render phone input.
 * - `FormFieldTextRequired`: Component to render required field.
 *
 * @example
 * <form-register-coordinator />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import { defineComponent, inject, reactive } from 'vue';

// components
import FormFieldCheckboxRequired from './../form/FormFieldCheckboxRequired.vue';
import FormFieldCompany from '../global/FormFieldCompany.vue';
import FormFieldEmail from './../global/FormFieldEmail.vue';
import FormFieldPassword from '../global/FormFieldPassword.vue';
import FormFieldPasswordConfirm from '../global/FormFieldPasswordConfirm.vue';
import FormFieldPhone from './../global/FormFieldPhone.vue';
import FormFieldTextRequired from './../global/FormFieldTextRequired.vue';

// composables
import { i18n } from 'src/boot/i18n';

// enums
import { OrganizationType } from '../types/Organization';
import { NewsletterType } from '../types/Newsletter';

// stores
import { useRegisterStore } from 'src/stores/register';

// types
import type { FormOption } from '../types/Form';
import type { Logger } from '../types/Logger';
import type { RegisterCoordinatorRequest } from '../types/Register';

export default defineComponent({
  name: 'FormRegisterCoordinator',
  components: {
    FormFieldCheckboxRequired,
    FormFieldCompany,
    FormFieldEmail,
    FormFieldTextRequired,
    FormFieldPassword,
    FormFieldPasswordConfirm,
    FormFieldPhone,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerStore = useRegisterStore();

    const formRegisterCoordinator = reactive({
      firstName: '',
      lastName: '',
      organizationType: OrganizationType.company,
      organizationId: '',
      jobTitle: '',
      email: '',
      newsletter: [] as NewsletterType[],
      phone: '',
      password: '',
      passwordConfirm: '',
      responsibility: false,
      terms: false,
    });

    const optionsInstitutionType: FormOption[] = [
      {
        label: i18n.global.t('form.labelCompanyShort'),
        value: OrganizationType.company,
      },
      {
        label: i18n.global.t('form.labelSchool'),
        value: OrganizationType.school,
      },
      {
        label: i18n.global.t('form.labelFamily'),
        value: OrganizationType.family,
      },
    ];

    const onSubmit = async (): Promise<void> => {
      // build payload
      const payload: RegisterCoordinatorRequest = {
        firstName: formRegisterCoordinator.firstName,
        lastName: formRegisterCoordinator.lastName,
        organizationType: formRegisterCoordinator.organizationType,
        organizationId: formRegisterCoordinator.organizationId,
        jobTitle: formRegisterCoordinator.jobTitle,
        email: formRegisterCoordinator.email,
        newsletter: formRegisterCoordinator.newsletter,
        phone: formRegisterCoordinator.phone,
        password: formRegisterCoordinator.password,
        responsibility: formRegisterCoordinator.responsibility,
        terms: formRegisterCoordinator.terms,
      };
      // register coordinator
      const data = await registerStore.registerCoordinator(payload);
      if (data) {
        logger?.debug(JSON.stringify(data));
      }
    };

    const onReset = (): void => {
      // noop
    };

    return {
      formRegisterCoordinator,
      optionsInstitutionType,
      onReset,
      onSubmit,
    };
  },
});
</script>

<template>
  <div>
    <!-- Form: register coordinator -->
    <q-form
      autofocus
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md text-grey-10"
    >
      <!-- Heading -->
      <h2
        class="q-mt-0 q-mb-sm text-body1 text-weight-bold"
        data-cy="register-coordinator-form-title"
      >
        {{ $t('register.coordinator.form.title') }}
      </h2>
      <div class="q-mt-lg">
        <div class="row q-col-gutter-md q-mb-sm">
          <!-- Input: first name -->
          <form-field-text-required
            v-model="formRegisterCoordinator.firstName"
            name="form-first-name"
            label="form.labelFirstName"
            autocomplete="given-name"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-first-name"
          />
          <!-- Input: last name -->
          <form-field-text-required
            v-model="formRegisterCoordinator.lastName"
            name="form-last-name"
            label="form.labelLastName"
            autocomplete="family-name"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-last-name"
          />
          <!-- Input: institution type -->
          <div class="col-12 col-sm-6">
            <!-- Label -->
            <label
              for="form-institution-type"
              class="text-grey-10 text-caption text-bold"
            >
              {{ $t('form.labelInstitutionType') }}
            </label>
            <!-- Options -->
            <q-option-group
              inline
              dense
              id="form-institution-type"
              v-model="formRegisterCoordinator.organizationType"
              :options="optionsInstitutionType"
              color="primary"
              class="q-mt-sm q-gutter-x-lg"
            />
          </div>
          <!-- Input: organization ID -->
          <form-field-company
            v-model="formRegisterCoordinator.organizationId"
            class="col-12"
            data-cy="form-register-coordinator-company"
          />
          <!-- Input: job title -->
          <form-field-text-required
            v-model="formRegisterCoordinator.jobTitle"
            name="form-job-title"
            label="form.labelJobTitle"
            label-short="form.labelJobTitleShort"
            class="col-12"
            data-cy="form-register-coordinator-job-title"
          />
          <!-- Input: email -->
          <form-field-email
            v-model="formRegisterCoordinator.email"
            data-cy="form-register-coordinator-email"
          />
          <!-- Input: phone-->
          <form-field-phone
            v-model="formRegisterCoordinator.phone"
            data-cy="form-register-coordinator-phone"
          />
          <!-- Input: password -->
          <form-field-password
            v-model="formRegisterCoordinator.password"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-password"
          />
          <!-- Input: password confirm -->
          <form-field-password-confirm
            v-model="formRegisterCoordinator.passwordConfirm"
            :compare-value="formRegisterCoordinator.password"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-password-confirm"
          />
          <!-- Input: confirm responsibility -->
          <div
            class="col-12"
            data-cy="form-register-coordinator-responsibility"
          >
            <form-field-checkbox-required
              v-model="formRegisterCoordinator.responsibility"
              :validation-message="
                $t('register.coordinator.form.messageResponsibilityRequired')
              "
            >
              {{ $t('register.coordinator.form.labelResponsibility') }}
            </form-field-checkbox-required>
          </div>
          <!-- Input: confirm consent -->
          <div class="col-12" data-cy="form-register-coordinator-terms">
            <!-- Checkbox: terms -->
            <form-field-checkbox-required
              v-model="formRegisterCoordinator.terms"
              :validation-message="
                $t('register.coordinator.form.messageTermsRequired')
              "
            >
              {{ $t('register.coordinator.form.labelPrivacyConsent') }}
              <!-- Link: terms -->
              <!-- TODO: Link to terms page -->
              <a href="#" target="_blank" class="text-primary">
                {{ $t('register.coordinator.form.linkPrivacyConsent') }} </a
              >.
            </form-field-checkbox-required>
          </div>
        </div>
        <!-- Button: submit -->
        <div class="flex justify-end q-mt-lg">
          <q-btn
            rounded
            unelevated
            type="submit"
            color="primary"
            :label="$t('register.coordinator.form.buttonSubmit')"
            data-cy="form-register-coordinator-submit"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>
