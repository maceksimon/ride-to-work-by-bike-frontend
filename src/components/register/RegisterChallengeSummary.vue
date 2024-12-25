<script lang="ts">
/**
 * RegisterChallengeSummary Component
 *
 * @description A summary component that displays the registration details in four sections:
 * personal details, participation, merch, and delivery address.
 * Used as the final step in the registration process to review all entered information.
 *
 * @example
 * <RegisterChallengeSummary />
 *
 * @see [Figma Design](...)
 */

// libraries
import { computed, defineComponent } from 'vue';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useLoginStore } from '../../stores/login';

export default defineComponent({
  name: 'RegisterChallengeSummary',
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();
    const loginStore = useLoginStore();

    const personalDetails = computed(
      () => registerChallengeStore.getPersonalDetails,
    );
    const email = computed(() => loginStore.getUserEmail);

    return {
      personalDetails,
      email,
    };
  },
});
</script>

<template>
  <div>
    <!-- Personal Details Section -->
    <div class="q-mb-lg">
      <h3 class="text-body1 text-weight-bold q-my-none">
        {{ $t('register.challenge.titleStepPersonalDetails') }}
      </h3>
      <div>
        <!-- Email -->
        <div v-if="email" class="q-mt-sm">
          {{ email }}
        </div>
        <!-- Full name -->
        <div
          v-if="personalDetails.firstName || personalDetails.lastName"
          class="q-mt-sm"
        >
          {{ personalDetails.firstName }} {{ personalDetails.lastName }}
        </div>
        <!-- Gender -->
        <div v-if="personalDetails.gender" class="q-mt-sm">
          {{ $t('register.challenge.labelGender') }}:
          {{ $t(`register.challenge.textGender.${personalDetails.gender}`) }}
        </div>
      </div>
    </div>

    <!-- Participation Section -->
    <div class="q-mb-lg">
      <h3 class="text-body1 text-weight-bold q-my-none">
        {{ $t('register.challenge.titleStepParticipation') }}
      </h3>
      <div class="q-pl-md">
        <!-- Content will be added later -->
      </div>
    </div>

    <!-- Merch Section -->
    <div class="q-mb-lg">
      <h3 class="text-body1 text-weight-bold q-my-none">
        {{ $t('register.challenge.titleStepMerch') }}
      </h3>
      <div class="q-pl-md">
        <!-- Content will be added later -->
      </div>
    </div>

    <!-- Delivery Address Section -->
    <div class="q-mb-lg">
      <h3 class="text-body1 text-weight-bold q-my-none">
        {{ $t('register.challenge.titleDeliveryAddress') }}
      </h3>
      <div class="q-pl-md">
        <!-- Content will be added later -->
      </div>
    </div>
  </div>
</template>
