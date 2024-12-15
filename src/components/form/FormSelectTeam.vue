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
import { computed, defineComponent, inject, watch, ref } from 'vue';

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

export default defineComponent({
  name: 'FormSelectTeam',
  components: {
    FormFieldSelectTable,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;

    const registerChallengeStore = useRegisterChallengeStore();

    const team = computed({
      get: () => {
        return registerChallengeStore.getTeamId;
      },
      set: (value: number | null) => {
        registerChallengeStore.setTeamId(value);
      },
    });

    const { options, isLoading, teams, loadTeams } = useApiGetTeams(logger);
    const opts = ref([]);
    // load teams when subsidiary ID changes
    watch(
      () => registerChallengeStore.getSubsidiaryId,
      (newValue: number | null) => {
        logger?.debug(
          `Register challenge store subsidiary ID changed to <${newValue}>.`,
        );
        if (newValue) {
          logger?.info('Loading teams.');
          // Lazy loading
          loadTeams(newValue).then(() => {
            opts.value = options;
          });
        }
      },
      { immediate: true },
    );

    /**
     * Handle option created event
     * When option is created in the child component, push the result into
     * the `teams` array (options are computed from `teams` array).
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
      teams.value.push(newTeam);
    };

    return {
      isLoading,
      opts,
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
      :options="opts.value"
      :loading="isLoading"
      @create:option="onOptionCreated"
      data-cy="form-select-table-team"
    />
  </div>
</template>
