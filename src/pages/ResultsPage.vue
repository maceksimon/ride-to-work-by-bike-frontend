<script lang="ts">
/**
 * Results Page
 *
 * Shows upcoming challenges, badges, user progress, and other results.
 *
 * @components
 * - `ResultsChallengeOngoing`: Component to render content in
 * the "challenge-ongoing" state.
 * - `ResultsChallengeUpcoming`: Component to render content in
 * the "challenge-upcoming" state.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4948%3A125553&mode=dev)
 **/

// libraries
import { defineComponent } from 'vue';

// components
import PageHeading from 'components/global/PageHeading.vue';
import ResultsChallengeOngoing from 'components/results/ResultsChallengeOngoing.vue';
import ResultsChallengeUpcoming from 'components/results/ResultsChallengeUpcoming.vue';

export default defineComponent({
  name: 'ResultsPage',
  components: {
    PageHeading,
    ResultsChallengeOngoing,
    ResultsChallengeUpcoming,
  },
  setup() {
    return {
      state: 'challenge-upcoming',
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg q-pt-lg bg-white q-pb-xl">
      <!-- Heading -->
      <page-heading data-cy="results-page-title">
        {{ $t('results.titleResults') }}
      </page-heading>

      <results-challenge-upcoming
        v-if="state === 'challenge-upcoming'"
        data-cy="results-challenge-upcoming"
      />

      <results-challenge-ongoing
        v-if="state === 'challenge-ongoing'"
        data-cy="results-challenge-ongoing"
      />
    </div>
  </q-page>
</template>
