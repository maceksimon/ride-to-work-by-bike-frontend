import { colors } from 'quasar';

import SliderProgress from '../homepage/SliderProgress.vue';
import { hexToRgb } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { progressStats, cardsProgress } from 'src/mocks/homepage';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey2 = getPaletteColor('grey-2');
const grey10 = getPaletteColor('grey-10');
const blueGrey3 = getPaletteColor('blue-grey-3');

// selectors
const classSelectorSwiperButtonPrev = '.swiper-button-prev';
const classSelectorSwiperButtonNext = '.swiper-button-next';
const selectorSectionHeadingTitle = 'section-heading-title';
const selectorProgressSliderStats = 'progress-slider-stats';
const selectorProgressSliderStatsItem = 'progress-slider-stats-item';
const selectorSwiperContainer = 'swiper-container';
const selectorProgressSliderButton = 'progress-slider-button';

// variables
const cards = cardsProgress.slice(0, 5);
const buttonSize = '38px';
const opacityDisabled = '0.35';
const opacityEnabled = '1';

describe('<SliderProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.progressSlider',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(SliderProgress, {
        props: {
          title: i18n.global.t('index.progressSlider.title'),
          stats: progressStats,
          cards: cards,
          button: {
            title: i18n.global.t('index.progressSlider.button'),
            url: '/vysledky',
          },
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    desktopTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(SliderProgress, {
        props: {
          title: i18n.global.t('index.progressSlider.title'),
          stats: progressStats,
          cards: cards,
          button: {
            title: i18n.global.t('index.progressSlider.button'),
            url: '/vysledky',
          },
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    mobileTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.window().then(() => {
      // title
      cy.dataCy(selectorSectionHeadingTitle)
        .should('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('have.color', black)
        .and('contain', i18n.global.t('index.progressSlider.title'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('index.progressSlider.title'),
          );
        });
      // stats
      cy.dataCy(selectorProgressSliderStats)
        .should('be.visible')
        .and('have.backgroundColor', grey2)
        .and(
          'have.css',
          'border-radius',
          rideToWorkByBikeConfig.borderRadiusCard,
        )
        .and('have.css', 'padding', '8px');
    });
  });

  it('renders list of stats', () => {
    cy.window().then(() => {
      cy.dataCy(selectorProgressSliderStatsItem).should('have.length', 3);
      cy.dataCy(selectorProgressSliderStatsItem).each(($item, index) => {
        cy.wrap($item)
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10);
        cy.wrap($item)
          .find('.q-icon')
          .should('contain', progressStats[index].icon)
          .and('have.color', blueGrey3)
          .and('have.css', 'width', '18px')
          .and('have.css', 'height', '18px');
        cy.wrap($item)
          .find('span')
          .should('contain', progressStats[index].label)
          .and('have.color', grey10);
        cy.wrap($item)
          .find('strong')
          .should('contain', progressStats[index].value)
          .and('have.color', grey10)
          .and('have.css', 'font-weight', '700');
      });
    });
  });

  it('renders a slider with stat cards', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSwiperContainer).should('be.visible');
    });
  });

  it('renders button with title', () => {
    cy.dataCy(selectorProgressSliderButton)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '500')
      .and('have.css', 'text-transform', 'uppercase')
      .and('have.color', grey10)
      .and('have.css', 'border-radius', '28px')
      .and('contain', i18n.global.t('index.progressSlider.button'))
      .then(($title) => {
        expect($title.text()).to.equal(
          i18n.global.t('index.progressSlider.button'),
        );
      });
  });
}

function desktopTests() {
  it('renders swiper navigation buttons', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('be.visible')
        .and('have.css', 'width', buttonSize)
        .and('have.css', 'height', buttonSize)
        .and('have.css', 'border', `1px solid ${hexToRgb(grey10)}`);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('be.visible')
        .and('have.css', 'width', buttonSize)
        .and('have.css', 'height', buttonSize)
        .and('have.css', 'border', `1px solid ${hexToRgb(grey10)}`);
    });
  });

  it('changes button disabled state after navigation', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('have.css', 'opacity', opacityDisabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('have.css', 'opacity', opacityEnabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .click();
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('have.css', 'opacity', opacityEnabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('have.css', 'opacity', opacityEnabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .click();
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('have.css', 'opacity', opacityDisabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('have.css', 'opacity', opacityEnabled);
    });
  });
}

function mobileTests() {
  it('renders full-width button', () => {
    cy.window().then(() => {
      cy.testElementPercentageWidth(
        cy.dataCy(selectorProgressSliderButton),
        100,
      );
    });
  });
}
