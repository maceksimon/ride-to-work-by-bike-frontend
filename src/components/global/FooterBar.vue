<script lang="ts">
/**
 * TheFooter Component
 *
 * The `TheFooter` component renders the website footer, which includes
 * social links, a language switcher, and a scroll to top functionality.
 *
 * @description
 * This footer displays a set of social links, a language switcher
 * for changing the website language, and a button to smoothly scroll back
 * to the top of the page. Link urls are taken from global config.
 *
 * @components
 * - `LanguageSwitcher`: Component to switch the website's language.
 *
 * @example
 * <the-footer />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103891&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';
import { i18n } from '../../boot/i18n';

// components
import LanguageSwitcher from '../global/LanguageSwitcher.vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// types
import { ConfigAppVersion } from '../types/Config';

// Deployed app version
const rideToWorkByBikeDeployedAppVersion: ConfigAppVersion = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION,
);

export default defineComponent({
  name: 'FooterBar',
  components: {
    LanguageSwitcher,
  },
  setup() {
    let copyrightList: string[];
    if (rideToWorkByBikeDeployedAppVersion.version) {
      copyrightList = [
        'copyrightOpenSource',
        'deployedAppVersion',
        'copyrightAuthor',
      ];
    } else {
      copyrightList = ['copyrightOpenSource', 'copyrightAuthor'];
    }

    function scrollToTop(): void {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    const socialLinksList = [
      {
        id: 'instagram',
        title: i18n.global.t('index.menuLinks.instagram'),
        icon: 'mdi-instagram',
        url: rideToWorkByBikeConfig.urlInstagram,
      },
      {
        id: 'facebook',
        title: i18n.global.t('index.menuLinks.facebook'),
        icon: 'mdi-facebook',
        url: rideToWorkByBikeConfig.urlFacebook,
      },
      {
        id: 'twitter',
        title: i18n.global.t('index.menuLinks.twitter'),
        icon: 'mdi-twitter',
        url: rideToWorkByBikeConfig.urlTwitter,
      },
      {
        id: 'youtube',
        title: i18n.global.t('index.menuLinks.youtube'),
        icon: 'mdi-youtube',
        url: rideToWorkByBikeConfig.urlYoutube,
      },
    ];

    const { containerContentWidth } = rideToWorkByBikeConfig;

    return {
      socialLinksList,
      copyrightList,
      containerContentWidth,
      scrollToTop,
      rideToWorkByBikeDeployedAppVersion,
    };
  },
});
</script>

<template>
  <div
    class="bg-info q-px-lg q-py-xl q-mt-xl"
    :style="{ 'max-width': containerContentWidth }"
    data-cy="footer"
  >
    <!-- Footer content (leave space above for graphics) -->
    <div>
      <!-- Scroll to top button (desktop) -->
      <div class="flex items-center gt-sm">
        <q-btn
          dense
          round
          outline
          color="primary"
          @click.prevent="scrollToTop"
          data-cy="footer-top-button"
        >
          <q-icon name="arrow_upward" size="18px" />
        </q-btn>
        <a
          href="#"
          class="text-primary no-underline q-ml-sm"
          @click.prevent="scrollToTop"
          >Zpátky nahoru</a
        >
      </div>

      <q-separator color="primary" class="q-my-lg" />

      <div class="flex items-end">
        <div class="footer-content full-height col-grow">
          <div class="col-grow row q-col-gutter-md items-start justify-between">
            <div class="col-auto">
              <!-- Logo -->
              <q-img
                src="~assets/svg/logo.svg"
                width="142px"
                height="40px"
                data-cy="footer-logo"
              />
            </div>

            <!-- Scroll to top button (mobile) -->
            <div class="col-auto">
              <q-btn
                dense
                class="lt-md"
                color="primary"
                outline
                round
                data-cy="footer-top-button-mobile"
                @click.prevent="scrollToTop"
              >
                <q-icon name="arrow_upward" size="18px" />
              </q-btn>
            </div>
            <!-- License + Owner information (mobile) -->
            <div
              class="col-12 lt-md w-md-auto flex flex-wrap items-center justify-center gap-12 text-center q-my-md"
              data-cy="footer-copyright-list-mobile"
            >
              <div
                v-for="(message, index) in copyrightList"
                :key="message"
                class="flex items-center gap-12"
              >
                <span
                  v-if="message !== 'deployedAppVersion'"
                  v-html="$t('index.footer.' + message)"
                ></span>
                <!-- Deployed app version -->
                <span
                  v-else-if="rideToWorkByBikeDeployedAppVersion.version"
                  v-html="
                    `${$t('index.footer.' + message)}: ${
                      rideToWorkByBikeDeployedAppVersion.version
                    }`
                  "
                ></span>
                <span v-if="index < copyrightList.length - 1" class="gt-sm"
                  >|</span
                >
              </div>
            </div>

            <div class="col-12 col-md-auto">
              <div class="row q-col-gutter-lg items-center">
                <!-- List: Social links -->
                <div class="col-12 col-md-auto flex">
                  <div class="q-mx-auto">
                    <ul
                      class="flex items-center gap-32 q-my-none q-px-none"
                      data-cy="footer-social-menu"
                      style="list-style: none"
                    >
                      <li>
                        <q-btn
                          flat
                          round
                          v-for="link in socialLinksList"
                          :key="link.icon"
                          :title="link.title"
                          data-cy="footer-social-menu-button"
                        >
                          <a
                            :href="link.url"
                            class="flex column justify-center"
                            target="_blank"
                            style="text-decoration: none"
                            :data-cy="`footer-social-menu-link-${link.id}`"
                          >
                            <q-icon
                              :name="link.icon"
                              size="24px"
                              color="primary"
                              data-cy="footer-social-menu-icon"
                            />
                          </a>
                        </q-btn>
                      </li>
                    </ul>
                  </div>
                </div>
                <span class="col-auto q-mx-lg gt-sm">|</span>
                <!-- Language switcher component -->
                <div class="col-12 col-md-auto flex">
                  <div class="q-mx-auto">
                    <language-switcher
                      class="q-my-none"
                      variant="light"
                      data-cy="language-switcher-footer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- License + Owner information (desktop) -->
          <div
            class="flex flex-wrap items-center gap-12 copyright gt-sm q-mt-lg"
            data-cy="footer-copyright-list-desktop"
          >
            <div
              v-for="(message, index) in copyrightList"
              :key="message"
              class="flex items-center gap-12"
            >
              <span
                v-if="message !== 'deployedAppVersion'"
                v-html="$t('index.footer.' + message)"
              ></span>
              <!-- Deployed app version -->
              <span
                v-else-if="rideToWorkByBikeDeployedAppVersion.version"
                v-html="
                  `${$t('index.footer.' + message)}: ${
                    rideToWorkByBikeDeployedAppVersion.version
                  }`
                "
              ></span>
              <span v-if="index < copyrightList.length - 1" class="gt-sm"
                >|</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style scoped lang="scss">
.w-md-auto {
  @media (min-width: $breakpoint-md-min) {
    width: auto !important;
  }
}

.max-w-lg-90perc {
  @media (min-width: $breakpoint-lg-min) {
    max-width: 90%;
  }
}

.row-md {
  @media (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}

.footer-scroll-top {
  padding-top: 16px;

  @media (min-width: $breakpoint-md-min) {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 8px;
  }

  @media (min-width: $breakpoint-md-min) {
    padding-top: 0;
    padding-bottom: 24px;
  }
}

.footer-content {
  padding-bottom: 80px;

  @media (min-width: $breakpoint-md-min) {
    padding-bottom: 0;
  }
}
</style>
