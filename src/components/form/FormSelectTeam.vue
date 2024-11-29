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
import { defineComponent, ref } from 'vue';

// enums
import { OrganizationLevel } from 'src/components/types/Organization';

// types
import { FormSelectTableOption } from '../types/Form';

// components
import FormFieldSelectTable from './FormFieldSelectTable.vue';

export default defineComponent({
  name: 'FormSelectTeam',
  components: {
    FormFieldSelectTable,
  },
  setup() {
    // TODO: fetch teams from API
    const teamOptions: FormSelectTableOption[] = [
      {
        label: 'Zelený team',
        value: 34565,
        members: 2,
        maxMembers: 5,
      },
      {
        label: 'Modrý team',
        value: 34566,
        members: 5,
        maxMembers: 5,
      },
    ];

    const team = ref<number | null>(null);

    return {
      team,
      teamOptions,
      OrganizationLevel,
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
      :options="teamOptions"
      data-cy="form-select-table-team"
    />
  </div>
</template>
