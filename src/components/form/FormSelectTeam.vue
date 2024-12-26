<script lang="ts">
/**
 * FormSelectTeam Component
 *
 * @description Use this component to render a table for selecting a team.
 * Handles fetching teams from API.
 * Note: This component is used on `RegisterChallengePage`.
 *
 * @components
 * - `FormFieldSelectTable`: Base component for displaying selectable table options
 *
 * @example
 * <form-select-team />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=5366-26763&t=3zQmiCgIVO72EQBq-1)
 */

// libraries
import { computed, defineComponent, inject, watch } from 'vue';

// components
import FormFieldSelectTable from './FormFieldSelectTable.vue';

// composables
import { useApiGetTeams } from '../../composables/useApiGetTeams';

// enums
import { OrganizationLevel } from 'src/components/types/Organization';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { Logger } from '../types/Logger';
import type { OrganizationTeam } from '../types/Organization';
import type { TeamPostApiResponse } from '../types/ApiTeam';
import type { FormSelectTableOption } from '../types/Form';

export default defineComponent({
  name: 'FormSelectTeam',
  components: {
    FormFieldSelectTable,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerChallengeStore = useRegisterChallengeStore();
    const { mapTeamToOption } = useApiGetTeams(logger);

    const team = computed({
      get: () => {
        return registerChallengeStore.getTeamId;
      },
      set: (value: number | null) => {
        registerChallengeStore.setTeamId(value);
      },
    });

    const isLoading = computed(() => registerChallengeStore.isLoadingTeams);
    const teams = computed(() => registerChallengeStore.getTeams);
    const options = computed<FormSelectTableOption[]>(() =>
      teams.value.map(mapTeamToOption),
    );

    // load teams when subsidiary ID changes
    watch(
      () => registerChallengeStore.getSubsidiaryId,
      async (newValue: number | null) => {
        logger?.debug(
          `Register challenge store subsidiary ID changed to <${newValue}>.`,
        );
        if (newValue) {
          logger?.info('Loading teams.');
          await registerChallengeStore.loadTeamsToStore(logger);
        }
      },
      { immediate: true },
    );

    /**
     * Handle option created event
     * When option is created in the child component, push the result into
     * the `teams` array in the `registerChallenge` store.
     * @param {TeamPostApiResponse} data - Team data
     * @returns {void}
     */
    const onOptionCreated = (data: TeamPostApiResponse): void => {
      const newTeam: OrganizationTeam = {
        id: data.id,
        name: data.name,
        subsidiary: registerChallengeStore.getSubsidiaryId as number,
        members: [],
      };
      const updatedTeams = [newTeam, ...teams.value];
      registerChallengeStore.setTeams(updatedTeams);
    };

    return {
      isLoading,
      options,
      team,
      OrganizationLevel,
      onOptionCreated,
    };
  },
});
</script>

<template>
  <div data-cy="form-select-team">
    <!-- Text: Info -->
    <div class="q-mb-lg" data-cy="form-select-team-info">
      {{ $t('register.challenge.textTeamInfo') }}
    </div>
    <!-- Select table -->
    <form-field-select-table
      v-model="team"
      :organization-level="OrganizationLevel.team"
      :options="options"
      :loading="isLoading"
      @create:option="onOptionCreated"
      data-cy="form-select-table-team"
    />
  </div>
</template>
