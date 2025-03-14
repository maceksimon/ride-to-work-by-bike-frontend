<script lang="ts">
/**
 * TeamMembersList Component
 *
 * @description Displays a list of team members with their approval status.
 * Responsive layout - side by side on desktop, stacked on mobile.
 *
 * Note: This component is used in the `ProfileDetails` component.
 *
 * @example
 * <team-members-list />
 */

// libraries
import { defineComponent, computed, ref } from 'vue';

// composables
import { useTeamMemberApprovalStatus } from '../../composables/useTeamMemberApprovalStatus';
import { i18n } from '../../boot/i18n';

// Components
import DialogDefault from '../global/DialogDefault.vue';
import FormInviteToTeam from './FormInviteToTeam.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useChallengeStore } from '../../stores/challenge';

// types
import type { ExtendedMemberResults } from '../types/Results';

// utils
import { getGenderLabel } from '../../utils/get_gender_label';

export default defineComponent({
  name: 'TeamMembersList',
  components: {
    DialogDefault,
    FormInviteToTeam,
  },
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();
    const challengeStore = useChallengeStore();

    const teamMembers = computed<ExtendedMemberResults[]>(
      (): ExtendedMemberResults[] => {
        const myTeam = registerChallengeStore.getMyTeam;
        if (!myTeam) return [];
        return myTeam.members as ExtendedMemberResults[];
      },
    );

    const { getStatusLabel, getStatusColor, getStatusIcon } =
      useTeamMemberApprovalStatus();

    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;

    const isDialogInviteTeamMembersOpen = ref(false);

    const remainingSlots = computed<number>((): number => {
      const myTeam = registerChallengeStore.getMyTeam;
      if (!myTeam) return 0;

      const maxTeamMembers = challengeStore.getMaxTeamMembers;
      if (!maxTeamMembers) return 0;

      return maxTeamMembers - myTeam.member_count;
    });

    return {
      borderRadius,
      getGenderLabel,
      getStatusLabel,
      getStatusColor,
      getStatusIcon,
      i18n,
      isDialogInviteTeamMembersOpen,
      remainingSlots,
      teamMembers,
    };
  },
});
</script>

<template>
  <div data-cy="team-members-list">
    <!-- Title -->
    <h3
      class="text-h6 text-weight-bold text-grey-10 q-mt-none q-mb-md"
      data-cy="team-members-list-title"
    >
      {{ $t('teamMembersList.titleMembers') }}
    </h3>

    <!-- List -->
    <q-expansion-item header-class="disable-bg-hover" data-cy="team-members">
      <template v-slot:header>
        <div class="row full-width items-center">
          <div class="col-9">
            <!-- Show hide expansion team members element -->
            <div class="row items-center">
              <div class="col-auto q-mr-lg">
                <!-- Icon -->
                <q-avatar
                  icon="groups"
                  color="secondary"
                  text-color="primary"
                />
              </div>
              <!-- Title -->
              <div class="col-auto">
                {{ $t('teamMembersList.showHideMembers') }}
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-lg-3 col-auto">
            <q-item-section avatar>
              <!-- Invite new team members btn -->
              <q-chip
                icon="group_add"
                color="secondary"
                text-color="primary"
                size="md"
                :class="{ 'q-mt-md': $q.screen.lt.md }"
                :disable="remainingSlots === 0"
                @click.stop="isDialogInviteTeamMembersOpen = true"
                clickable
                data-cy="profile-details-invite-team-members"
                >{{ $t('profile.inviteTeamMembers') }}</q-chip
              >
              <!-- Invite new team members modal dialog  -->
              <dialog-default
                v-model="isDialogInviteTeamMembersOpen"
                data-cy="profile-details-invite-team-members-dialog"
              >
                <!-- Dialog title -->
                <template #title>
                  {{ $t('profile.inviteTeamMembers') }}
                </template>
                <!-- Dialog content -->
                <template #content>
                  <form-invite-to-team
                    :remaining-slots="remainingSlots"
                    :on-close="() => (isDialogInviteTeamMembersOpen = false)"
                  />
                </template>
              </dialog-default>
            </q-item-section>
          </div>
        </div>
      </template>
      <q-card>
        <q-card-section>
          <q-list bordered separator class="rounded-borders">
            <!-- Team member expansion item element -->
            <q-expansion-item
              class="full-width"
              v-for="member in teamMembers"
              :key="member.id"
              header-class="disable-bg-hover"
              data-cy="team-member-item"
            >
              <template v-slot:header>
                <div class="row full-width">
                  <div class="col-9">
                    <q-item-section avatar>
                      <!-- Icon -->
                      <q-chip
                        color="secondary"
                        text-color="primary"
                        size="md"
                        data-cy="team-member-name"
                      >
                        <!-- Gender -->
                        <q-avatar
                          :icon="member.sex"
                          :color="member.sex == 'male' ? 'blue' : 'red'"
                          text-color="white"
                          size="md"
                        />
                        <!-- Name -->
                        {{ member.name }}
                      </q-chip>
                    </q-item-section>
                  </div>
                  <div class="col-sm-auto">
                    <!-- Team membership status -->
                    <q-item-section side>
                      <q-chip
                        :color="getStatusColor(member)"
                        :icon="getStatusIcon(member)"
                        data-cy="team-member-status-chip"
                      >
                        {{ getStatusLabel(member) }}
                      </q-chip>
                    </q-item-section>
                  </div>
                </div>
              </template>
              <q-card>
                <q-card-section>
                  <!-- Email -->
                  <q-chip color="secondary" text-color="primary">
                    <!-- Icon -->
                    <q-avatar
                      icon="contact_mail"
                      color="secondary"
                      text-color="primary"
                    />
                    <a
                      data-cy="team-member-email"
                      href="mailto:{{ member.email }}"
                      class="text-primary"
                      >{{ member.email }}</a
                    >
                  </q-chip>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<style lang="scss">
.disable-bg-hover.q-hoverable:hover > .q-focus-helper {
  opacity: 0 !important;
}
</style>
