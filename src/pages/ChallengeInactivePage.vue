<script lang="ts">
/**
 * ChallengeInactivePage
 *
 * The `ChallengeInactivePage` renders the page for an inactive challenge.
 *
 * @description
 * This component is used to inform users that the challenge they're trying to access
 * is currently inactive or not available.
 *
 * @components
 * - `ChallengeInactiveInfo`: Component to display information about the inactive challenge.
 * - `LoginRegisterHeader`: Component to render page header.
 * - `ListCardPost`: Component to render list of posts.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6385-26491&t=Kg5tEX1Skno3i6DW-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import ChallengeInactiveInfo from '../components/homepage/ChallengeInactiveInfo.vue';
import ListCardPost from '../components/homepage/ListCardPost.vue';
import LoginRegisterHeader from '../components/global/LoginRegisterHeader.vue';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// fixtures
import listCardsPostFixture from '../../test/cypress/fixtures/listCardsPost.json';

// types
import type { CardPost } from '../components/types/Card';
import type { Link } from '../components/types/Link';

export default defineComponent({
  name: 'ChallengeInactivePage',
  components: {
    ChallengeInactiveInfo,
    ListCardPost,
    LoginRegisterHeader,
  },
  setup() {
    const button: Link = {
      title: 'challengeInactive.buttonBlog',
      url: rideToWorkByBikeConfig.urlBlog,
    };

    const cards: CardPost[] = listCardsPostFixture;

    return {
      button,
      cards,
    };
  },
});
</script>

<template>
  <q-page padding>
    <div class="q-px-lg q-pb-xl overflow-hidden">
      <!-- Page header -->
      <login-register-header data-cy="login-register-header" />

      <div class="row q-mt-xl">
        <div class="col-12 col-md-4">
          <challenge-inactive-info />
        </div>
      </div>

      <list-card-post
        dark
        title=""
        :button="button"
        :cards="cards"
        class="q-mt-xl"
      />
    </div>
  </q-page>
</template>
