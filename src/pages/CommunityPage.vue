<script lang="ts">
/**
 * CommunityPage Component
 *
 * The `CommunityPage` displays information about community events.
 *
 * @components
 * - `CardEvent`: Card with event information.
 * - `ForumPostList`: List of forum posts.
 * - `ListCardFollow`: List of cards social networks profiles.
 * - `ListCardPost`: List of cards with news posts.
 *
 * @layout
 * - `MainLayout`: Default layout with sidebar on desktop.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=ZZSrUuLgRLYixhUu-1)
 */
import { defineComponent, ref } from 'vue';

// components
import CardEvent from '../components/homepage/CardEvent.vue';
import FormFieldSelectCity from 'src/components/form/FormFieldSelectCity.vue';
import ForumPostList from 'src/components/community/ForumPostList.vue';
import ListCardFollow from '../components/homepage/ListCardFollow.vue';
import ListCardPost from 'src/components/homepage/ListCardPost.vue';
import ListCardSlider from '../components/global/ListCardSlider.vue';
import PageHeading from 'src/components/global/PageHeading.vue';
import SectionHeading from 'src/components/global/SectionHeading.vue';

// composables
import { i18n } from 'src/boot/i18n';

// config
import { routesConf } from 'src/router/routes_conf';

// fixtures
import events from '../../test/cypress/fixtures/listCardsEvent.json';
import listCardsFollow from '../../test/cypress/fixtures/listCardsFollow.json';
import listCardsLocation from '../../test/cypress/fixtures/listCardsLocation.json';
import listCardsPost from '../../test/cypress/fixtures/listCardsPost.json';

// types
import type {
  CardPost,
  CardFollow,
  CardLocationType,
} from 'src/components/types';

export default defineComponent({
  name: 'CommunityPage',
  components: {
    CardEvent,
    FormFieldSelectCity,
    ForumPostList,
    ListCardFollow,
    ListCardPost,
    ListCardSlider,
    PageHeading,
    SectionHeading,
  },
  setup() {
    const city = ref<number | null>(null);

    const cardsFollow = listCardsFollow as CardFollow[];
    const cardsPost = listCardsPost as CardPost[];
    const buttonPosts = {
      title: i18n.global.t('index.cardListPost.button'),
      // TODO: add route
      url: routesConf?.blog?.path,
    };
    const cardsLocation = listCardsLocation as CardLocationType[];

    return {
      buttonPosts,
      cardsFollow,
      cardsPost,
      cardsLocation,
      city,
      events,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl q-pt-lg">
      <!-- Page title -->
      <page-heading
        horizontal
        class="q-mt-none q-mb-none"
        data-cy="community-page-title"
      >
        {{ $t('community.titleCommunity') }}
        <template #secondary>
          <!-- Select: City -->
          <form-field-select-city
            v-model="city"
            data-cy="form-field-select-city"
          />
        </template>
      </page-heading>

      <!-- Section: Local events -->
      <div class="q-mt-lg">
        <section-heading data-cy="local-events-title">
          {{ $t('community.titleLocalEvents') }}
        </section-heading>
        <div data-cy="local-events-list">
          <card-event
            v-for="card in events"
            :key="card.title"
            :card="card"
            class="q-mt-lg"
            data-cy="local-events-item"
          />
        </div>

        <!-- TODO: Section: Past events -->
      </div>

      <!-- Section: Forum -->
      <forum-post-list class="q-mt-xl" data-cy="forum-post-list" />

      <!-- Section: Locations -->
      <list-card-slider
        :title="$t('community.titleLocations')"
        :button="{ title: $t('community.buttonLocationsMap'), url: '#' }"
        :cards="cardsLocation"
        cardType="CardLocation"
        class="q-pt-xl"
        :slides="3"
        data-cy="locations-slider"
      />

      <!-- Section: Social networks -->
      <list-card-follow :cards="cardsFollow" class="q-pt-xl" />

      <list-card-post
        :cards="cardsPost"
        :title="$t('index.cardListPost.title')"
        :button="buttonPosts"
        class="q-pt-xl"
        data-cy="list-card-post"
      />

      <!-- TODO: Section Instagram -->
    </div>
  </q-page>
</template>
