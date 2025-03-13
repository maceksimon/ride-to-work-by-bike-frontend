<script lang="ts">
/**
 * FormInviteToTeam Component
 *
 * @description * Use this component to render a form for inviting team members.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `onClose` (function, required): Function to close the dialog.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @example
 * <form-invite-to-team :value="emails" @update:value="onUpdateEmails">
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// components
import FormFieldEmail from '../global/FormFieldEmail.vue';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useChallengeStore } from '../../stores/challenge';

export default defineComponent({
  name: 'FormInviteToTeam',
  components: {
    FormFieldEmail,
  },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:value', 'close'],
  setup(props, { emit }) {
    const emailAddresses = ref<string[]>(['']);

    const closeDialog = (): void => {
      props.onClose();
    };

    const onUpdateEmails = (): void => {
      emit('update:value', emailAddresses.value);
      props.onClose();
    };

    const registerChallengeStore = useRegisterChallengeStore();
    const challengeStore = useChallengeStore();
    const remainingSlots = computed<number>((): number => {
      const myTeam = registerChallengeStore.getMyTeam;
      if (!myTeam) return 0;

      const maxTeamMembers = challengeStore.getMaxTeamMembers;
      if (!maxTeamMembers) return 0;

      return maxTeamMembers - myTeam.member_count;
    });

    // handle adding/removing email fields
    const addEmailField = (): void => {
      if (emailAddresses.value.length < remainingSlots.value) {
        emailAddresses.value.push('');
      }
    };

    const removeEmailField = (index: number): void => {
      emailAddresses.value.splice(index, 1);
    };

    return {
      emailAddresses,
      closeDialog,
      onUpdateEmails,
      addEmailField,
      removeEmailField,
      remainingSlots,
      isLoading,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateEmails" data-cy="form-invite-to-team">
    <!-- Label -->
    <label class="text-grey-10 text-caption text-bold" data-cy="form-label">
      {{ $t('form.labelEmailAddresses') }}
    </label>
    <!-- Email address fields -->
    <div class="q-my-md" data-cy="invite-email-addresses">
      <div
        v-for="(email, index) in emailAddresses"
        :key="index"
        class="q-mt-sm"
      >
        <div class="row">
          <div class="col">
            <form-field-email
              hide-label
              v-model="emailAddresses[index]"
              :required="true"
              :testing="false"
              data-cy="invite-email-addresses-input"
            />
          </div>
          <div class="col-auto">
            <q-btn
              v-if="index > 0"
              round
              unelevated
              outline
              text-color="negative"
              icon="close"
              size="8px"
              :title="$t('onboarding.buttonRemoveEmailField')"
              class="q-mt-md q-ml-sm"
              @click="removeEmailField(index)"
              data-cy="remove-email-field"
            />
          </div>
        </div>
      </div>
      <q-btn
        v-if="emailAddresses.length < remainingSlots"
        unelevated
        rounded
        outline
        class="q-mt-md"
        color="primary"
        size="12px"
        @click="addEmailField"
        data-cy="add-email-field"
      >
        <q-icon name="add" size="18px" class="q-mr-xs" />
        {{ $t('onboarding.buttonAddEmailField') }}
      </q-btn>
    </div>
    <div class="q-mt-xl flex justify-end gap-8">
      <!-- Button: Cancel -->
      <q-btn
        rounded
        unelevated
        outline
        color="primary"
        :label="$t('navigation.discardChanges')"
        @click.prevent="closeDialog"
        data-cy="form-button-cancel"
      />
      <!-- Button: Save -->
      <q-btn
        rounded
        unelevated
        type="submit"
        color="primary"
        :label="$t('navigation.save')"
        :loading="isLoading"
        data-cy="form-button-save"
      />
    </div>
  </q-form>
</template>
