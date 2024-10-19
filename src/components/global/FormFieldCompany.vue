<script lang="ts">
/**
 * FormFieldCompany Component
 *
 * The `FormFieldCompany` renders company select
 *
 * @description * Use this component to allow user to select their company
 * and create a new company to register under.
 *
 * Used in `FormRegisterCoordinator`, `RegisterChallengePayment`.
 *
 * @props
 * - `modelValue` (string, required): The object representing user input.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Used to render a dialog window with form as content.
 * - `FormAddCompany`: Used to render form for registering a new company.
 *
 * @example
 * <form-field-company />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import { computed, defineComponent, inject, ref } from 'vue';
import { QForm } from 'quasar';

// components
import DialogDefault from 'src/components/global/DialogDefault.vue';
import FormAddCompany from 'src/components/form/FormAddCompany.vue';

// composables
import { i18n } from 'src/boot/i18n';
import { useApi } from 'src/composables/useApi';
import { useValidation } from 'src/composables/useValidation';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// stores
import { useLoginStore } from 'src/stores/login';

// types
import type {
  FormCompanyFields,
  FormSelectOption,
} from 'src/components/types/Form';
import type { Logger } from 'src/components/types/Logger';

interface CompanyOption {
  id: string;
  name: string;
}

interface GetOrganizationsResponse {
  results: CompanyOption[];
}

interface PostOrganizationsBody {
  name: string;
  vatId: string;
}

interface PostOrganizationsResponse {
  id: string;
  name: string;
}

// utils
import { requestDefaultHeader, requestTokenHeader } from 'src/utils';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';

export default defineComponent({
  name: 'FormFieldCompany',
  components: {
    DialogDefault,
    FormAddCompany,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const options = ref<FormSelectOption[]>([]);
    const optionsDefault = ref<FormSelectOption[]>([]);
    const isOptionsLoading = ref<boolean>(false);
    const loginStore = useLoginStore();
    const { apiFetch } = useApi();
    // get API base URL
    const { apiBase, apiDefaultLang, urlApiOrganizations } =
      rideToWorkByBikeConfig;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiOrganizationsLocalized = `${apiBaseUrl}${urlApiOrganizations}`;
    /**
     * Load options
     * Fetches organizations and saves them into default options
     * @returns {Promise<void>}
     */
    const loadOptions = async (): Promise<void> => {
      logger?.info('Get API organizations.');
      isOptionsLoading.value = true;
      // append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      // fetch organizations
      const { data } = await apiFetch<GetOrganizationsResponse>({
        endpoint: urlApiOrganizationsLocalized,
        method: 'get',
        translationKey: 'getOrganizations',
        showSuccessMessage: false,
        headers: Object.assign(requestDefaultHeader, requestTokenHeader_),
        logger,
      });
      // save default option array
      if (data?.results?.length) {
        logger?.info('Organizations fetched. Saving to default options.');
        logger?.debug(
          `Setting default options to <${JSON.stringify(data.results)}>`,
        );
        optionsDefault.value = data.results.map((option) => {
          return {
            label: option.name,
            value: option.id,
          };
        });
        logger?.debug(
          `Default options set to <${JSON.stringify(optionsDefault.value)}>`,
        );
      }
      isOptionsLoading.value = false;
    };
    // load options on component mount
    loadOptions();

    // company v-model
    const company = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    // handles company select input
    const onInputValue = (val: string) => {
      company.value = val;
      logger?.debug(`Company set to <${company.value}>`);
    };

    /**
     * Autocomplete functionality for company select
     * Upon typing, find strings which contain query entered into the select
     *
     * Limitation: does not support fuzzy search
     *
     * Quasar types are not implemented yet so we provide custom typing
     * for update function.
     * See https://github.com/quasarframework/quasar/issues/8914#issuecomment-1313783889
     *
     * See https://quasar.dev/vue-components/select#example--text-autocomplete
     */
    const onFilter = (val: string, update: (fn: () => void) => void) => {
      update(() => {
        const valLowerCase = val.toLocaleLowerCase();
        options.value = optionsDefault.value.filter(
          (option) =>
            option.label.toLocaleLowerCase().indexOf(valLowerCase) > -1,
        );
      });
    };

    /**
     * New company logic
     * Renders dialog for adding a new company
     * and handles form submission.
     */
    const isDialogOpen = ref<boolean>(false);
    // form ref
    const formRef = ref<typeof QForm | null>(null);
    // default form state
    const companyNew: FormCompanyFields = {
      name: '',
      vatId: '',
      address: [
        {
          street: '',
          houseNumber: '',
          city: '',
          zip: '',
          cityChallenge: '',
          department: '',
        },
      ],
    };
    /**
     * Close dialog
     * Resets form and closes dialog
     * @returns {void}
     */
    const onClose = (): void => {
      if (formRef.value) {
        formRef.value.reset();
      }
      isDialogOpen.value = false;
    };
    /**
     * Submit new company form
     * Validates form and calls createOrganization API if valid
     * @returns {Promise<void>}
     */
    const onSubmit = async (): Promise<void> => {
      if (formRef.value) {
        const isFormValid: boolean = await formRef.value.validate();

        if (isFormValid) {
          createOrganization();
        } else {
          formRef.value.$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };
    /**
     * Create organization
     * Creates a new organization in database
     * @returns {Promise<void>}
     */
    const createOrganization = async (): Promise<void> => {
      logger?.info('Post API new organization.');
      // append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      // body
      logger?.debug(`Create organization name <${companyNew.name}>`);
      logger?.debug(`Create organization vatId <${companyNew.vatId}>`);
      const body: PostOrganizationsBody = {
        name: companyNew.name,
        vatId: companyNew.vatId,
      };
      // fetch organizations
      const { data } = await apiFetch<PostOrganizationsResponse>({
        endpoint: urlApiOrganizationsLocalized,
        method: 'post',
        translationKey: 'createOrganization',
        headers: Object.assign(requestDefaultHeader, requestTokenHeader_),
        payload: body,
        logger,
      });
      if (data?.id) {
        logger?.info(`Organization created with ID <${data.id}>`);
        logger?.info(`Organization created with name <${data.name}>`);
        // close dialog
        isDialogOpen.value = false;
        // refetch organizations
        logger?.debug('Refetching organizations.');
        await loadOptions();
        // set company to new organization
        logger?.debug(`Setting organization to ID <${data.id}>`);
        company.value = data.id;
      }
    };

    const { isFilled } = useValidation();

    const formFieldLabel = computed(
      () => props.label || i18n.global.t('form.labelCompany'),
    );

    return {
      company,
      companyNew,
      formFieldLabel,
      formRef,
      isDialogOpen,
      isFilled,
      isOptionsLoading,
      options,
      onClose,
      onFilter,
      onInputValue,
      onSubmit,
    };
  },
});
</script>

<template>
  <div data-cy="form-company">
    <!-- Label -->
    <label
      for="form-company"
      class="text-caption text-bold"
      data-cy="form-field-company-label"
    >
      {{ formFieldLabel }}
    </label>
    <div class="row">
      <div class="col-12 col-sm" data-cy="col-input">
        <!-- Input: Autocomplete -->
        <q-select
          dense
          outlined
          use-input
          emit-value
          hide-selected
          fill-input
          hide-bottom-space
          input-debounce="0"
          :model-value="company"
          :options="options"
          :loading="isOptionsLoading"
          class="q-mt-sm"
          id="form-company"
          name="company"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('form.labelCompanyShort'),
              }),
          ]"
          @filter="onFilter"
          @input-value="onInputValue"
          data-cy="form-company-input"
        >
          <!-- Item: No option -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t('form.messageNoCompany') }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="col-12 col-sm-auto flex items-start justify-end q-pt-sm q-pl-md"
        data-cy="col-button"
      >
        <!-- Button: Add company -->
        <q-btn
          flat
          rounded
          icon="mdi-plus"
          color="primary"
          style="margin-top: 2px"
          @click.prevent="isDialogOpen = true"
          data-cy="button-add-company"
        >
          <!-- Label -->
          <span class="inline-block q-pl-xs">
            {{ $t('register.challenge.buttonAddCompany') }}
          </span>
        </q-btn>
      </div>
    </div>
    <!-- Dialog: Add company -->
    <dialog-default
      v-model="isDialogOpen"
      :form-ref="formRef"
      data-cy="dialog-add-company"
    >
      <template #title>
        {{ $t('form.company.titleAddCompany') }}
      </template>
      <template #content>
        <q-form ref="formRef">
          <form-add-company
            :form-values="companyNew"
            variant="simple"
            @update:form-values="companyNew = $event"
          ></form-add-company>
        </q-form>
        <!-- Action buttons -->
        <div class="flex justify-end q-mt-sm">
          <div class="flex gap-8">
            <q-btn
              rounded
              unelevated
              outline
              color="primary"
              data-cy="dialog-button-cancel"
              @click="onClose"
            >
              {{ $t('navigation.discard') }}
            </q-btn>
            <q-btn
              rounded
              unelevated
              color="primary"
              data-cy="dialog-button-submit"
              @click="onSubmit"
            >
              {{ $t('form.company.buttonAddCompany') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
