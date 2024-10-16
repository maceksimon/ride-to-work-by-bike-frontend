<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="bg-white">
      <div
        class="q-px-lg q-pt-lg q-pb-xl"
        :style="{ 'max-width': containerContentWidth }"
      >
        <page-heading data-cy="index-title">
          {{ $t('index.title') }}
        </page-heading>
        <!-- Countdown: Event -->
        <countdown-event
          :release-date="releaseDate"
          data-cy="countdown-event"
        />
        <!-- Banner: Routes -->
        <template v-if="challengeStatus === ChallengeStatusEnum.during">
          <banner-routes
            :routes-count="14"
            variant="default"
            class="q-mt-xl q-mb-xl"
            data-cy="banner-routes"
          />
        </template>
        <!-- Banner: App link -->
        <banner-app
          :banner="bannerAppData"
          class="q-mt-xl"
          data-cy="banner-app"
        />
        <!-- Section: Future challenges -->
        <template v-if="challengeStatus === ChallengeStatusEnum.before">
          <!-- Title -->
          <section-heading class="q-pt-xl q-mb-md" data-cy="card-list-title">
            {{ $t('index.cardListChallenge.title') }}
          </section-heading>
          <!-- Cards -->
          <section-columns
            :columns="3"
            class="q-col-gutter-lg q-pb-xl"
            data-cy="list-challenge"
          >
            <card-challenge
              v-for="card in cardsChallenge"
              :key="card.title"
              :card="card"
              data-cy="card-list-item"
            />
          </section-columns>
        </template>
        <!-- Banner: Questionnaire -->
        <banner-image
          :banner="bannerImageData"
          class="q-pt-xl q-pb-xl"
          data-cy="banner-image"
        />
        <!-- Slider: Progress -->
        <template v-if="challengeStatus === ChallengeStatusEnum.during">
          <slider-progress
            :title="$t('index.progressSlider.title')"
            :cards="cardsProgressSlider"
            class="q-pt-xl q-mb-md"
            :button="{
              title: $t('index.progressSlider.button'),
              url: urlResults,
            }"
          >
          </slider-progress>
        </template>
        <!-- List: Progress -->
        <template v-if="challengeStatus === ChallengeStatusEnum.after">
          <list-card-progress
            :title="$t('index.cardListProgress.title')"
            :cards="cardsProgress"
            class="q-pt-xl q-pb-xl"
            data-cy="list-progress"
          ></list-card-progress>
        </template>
      </div>
    </div>
    <div :style="{ backgroundColor: primaryOpacity }">
      <div
        class="q-px-lg q-pb-xl"
        :style="{ 'max-width': containerContentWidth }"
      >
        <heading-background
          :title="headingBgTitle"
          class="q-pt-xl"
          data-cy="heading-background"
        />
        <div class="q-pt-xl" data-cy="list-event">
          <card-event
            v-for="card in cardsEvent"
            :key="card.title"
            :card="card"
            class="q-mt-lg"
            data-cy="card-list-item"
          />
        </div>
        <list-card-offer
          :title="$t('index.cardListOffer.title')"
          :cards="cardsOffer"
          class="q-pt-xl"
          data-cy="list-offer"
        >
        </list-card-offer>
        <list-card-post
          :title="$t('index.cardListPost.title')"
          :cards="cardsPost"
          :button="{
            title: $t('index.cardListPost.button'),
            url: urlCommunity,
          }"
          class="q-mt-xl"
          data-cy="list-post"
        >
        </list-card-post>
        <newsletter-feature class="q-mt-xl" data-cy="newsletter-feature" />
        <list-card-follow :cards="cardsFollow" class="q-mt-xl" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
// libraries
import { colors } from 'quasar';
import { computed, defineComponent } from 'vue';

// composables
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// import components
import BannerApp from 'components/homepage/BannerApp.vue';
import BannerImage from 'components/homepage/BannerImage.vue';
import BannerRoutes from 'components/homepage/BannerRoutes.vue';
import CardChallenge from 'components/homepage/CardChallenge.vue';
import CardEvent from 'components/homepage/CardEvent.vue';
import CountdownEvent from 'components/homepage/CountdownEvent.vue';
import HeadingBackground from 'components/homepage/HeadingBackground.vue';
import ListCardFollow from 'components/homepage/ListCardFollow.vue';
import ListCardOffer from 'components/homepage/ListCardOffer.vue';
import ListCardPost from 'components/homepage/ListCardPost.vue';
import ListCardProgress from 'components/homepage/ListCardProgress.vue';
import NewsletterFeature from 'components/homepage/NewsletterFeature.vue';
import PageHeading from 'src/components/global/PageHeading.vue';
import SectionColumns from 'components/homepage/SectionColumns.vue';
import SectionHeading from 'src/components/global/SectionHeading.vue';
import SliderProgress from 'components/homepage/SliderProgress.vue';

// config
import { routesConf } from '../router/routes_conf';

// mocks
import * as homepage from '../mocks/homepage';

// enums
import { ChallengeStatus as ChallengeStatusEnum } from 'src/stores/challenge';

// fixtures
import listCardsFollow from '../../test/cypress/fixtures/listCardsFollow.json';
import listCardsPost from '../../test/cypress/fixtures/listCardsPost.json';
import cardsProgressSlider from '../../test/cypress/fixtures/cardsProgress.json';

// stores
import { useChallengeStore } from 'src/stores/challenge';

export default defineComponent({
  name: 'IndexPage',
  components: {
    BannerApp,
    BannerImage,
    BannerRoutes,
    CardChallenge,
    CardEvent,
    CountdownEvent,
    HeadingBackground,
    ListCardFollow,
    ListCardOffer,
    ListCardPost,
    ListCardProgress,
    NewsletterFeature,
    PageHeading,
    SectionColumns,
    SectionHeading,
    SliderProgress,
  },
  setup() {
    const challengeStore = useChallengeStore();
    const challengeStatus = computed(() => challengeStore.getChallengeStatus);

    const { challengeStartDate } = rideToWorkByBikeConfig;

    const cardsFollow = listCardsFollow;
    const cardsPost = listCardsPost;

    const urlCommunity = routesConf['community']['path'];
    const urlResults = routesConf['results']['path'];

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const primary = getPaletteColor('primary');
    const primaryOpacity = changeAlpha(primary, 0.1);

    const { containerContentWidth } = rideToWorkByBikeConfig;

    return {
      badgeList: homepage.badgeList,
      bannerImageData: homepage.bannerImage,
      bannerAppData: homepage.bannerApp,
      cardsChallenge: homepage.cardsChallenge,
      cardsEvent: homepage.cardsEvent,
      cardsFollow,
      cardsOffer: homepage.cardsOffer,
      cardsPost,
      cardsProgress: homepage.cardsProgress,
      cardsProgressSlider,
      cardsStats: homepage.cardsStats,
      challengeStatus,
      ChallengeStatusEnum,
      containerContentWidth,
      headingBgTitle: homepage.headingBgTitle,
      primaryOpacity,
      releaseDate: challengeStartDate,
      urlCommunity,
      urlResults,
    };
  },
});
</script>

<style scoped lang="scss">
.bg-gray-lighter {
  background-color: var(--q-gray-lighter);
}
</style>
