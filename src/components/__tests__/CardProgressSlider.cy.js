import { colors } from 'quasar';

import CardProgressSlider from '../homepage/CardProgressSlider.vue';
import { i18n } from '../../boot/i18n';
import { cardsProgressSlider } from '../../mocks/homepage';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const blueGrey1 = getPaletteColor('blue-grey-1');

const card = cardsProgressSlider[0];

// Selectors
const selectorCardProgressSlider = 'card-progress-slider';
const selectorCardProgressContent = 'card-progress-content';
const selectorCardProgressTimeline = 'card-progress-timeline';
const selectorCardProgressStats = 'card-progress-stats';
const selectorCardProgressFooterMobile = 'card-progress-footer-mobile';
const selectorCardProgressHeader = 'card-progress-header';
const selectorCardProgressTitle = 'card-progress-title';
const selectorCardProgressPercentage = 'card-progress-percentage';
const selectorCardProgressCircular = 'card-progress-circular';

describe('<CardProgressSlider>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['timeline', 'toDate'],
      'index.cardProgressSlider',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardProgressSlider, {
        props: {
          card,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders card content horizontally', () => {
      cy.dataCy(selectorCardProgressContent)
        .should('be.visible')
        .and('have.css', 'display', 'flex')
        .and('have.css', 'flex-direction', 'row')
        .and('have.css', 'align-items', 'center');
    });

    it('renders timeline progress bar', () => {
      cy.dataCy(selectorCardProgressTimeline)
        .find('.q-linear-progress')
        .first()
        .should('be.visible');
      cy.dataCy(selectorCardProgressTimeline)
        .find('.q-linear-progress')
        .last()
        .should('not.be.visible');
    });

    it('renders stats', () => {
      cy.dataCy(selectorCardProgressStats)
        .should('be.visible')
        .find('.stats-title')
        .first()
        .should('contain', card.stats[0].title)
        .and('have.color', white)
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'font-size', '12px');
      cy.dataCy(selectorCardProgressStats)
        .should('be.visible')
        .find('.stats-value')
        .first()
        .should('contain', card.stats[0].items[0].text)
        .and('have.color', white)
        .and('have.css', 'font-weight', '400')
        .and('have.css', 'font-size', '14px');
    });

    it('does not render card footer with timeline', () => {
      cy.dataCy(selectorCardProgressFooterMobile).should('not.be.visible');
    });
  });

  // context('mobile', () => {
  //   beforeEach(() => {
  //     cy.mount(CardProgressSlider, {
  //       props: {
  //         card,
  //       },
  //     });
  //     cy.viewport('iphone-6');
  //   });

  //   coreTests();

  //   it('renders timeline progress bar', () => {
  //     cy.dataCy(selectorCardProgressTimeline)
  //       .find('.q-linear-progress')
  //       .first()
  //       .should('not.be.visible');
  //     cy.dataCy(selectorCardProgressTimeline)
  //       .find('.q-linear-progress')
  //       .last()
  //       .should('be.visible');
  //   });

  //   it('renders stats', () => {
  //     cy.dataCy(selectorCardProgressStats).should('not.be.visible');
  //   });

  //   it('wraps items in card header', () => {
  //     cy.dataCy(selectorCardProgressHeader)
  //       .should('be.visible')
  //       .and('have.css', 'display', 'flex')
  //       .and('have.css', 'flex-direction', 'row')
  //       .and('have.css', 'flex-wrap', 'wrap')
  //       .and('have.css', 'gap', '16px');
  //   });
  // });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorCardProgressSlider)
      .should('be.visible')
      .and('have.css', 'border-radius', rideToWorkByBikeConfig.borderRadiusCard)
      .and('have.backgroundColor', primary);
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.dataCy(selectorCardProgressTitle)
        .should('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', white)
        .and('contain', card.title)
        .then(($title) => {
          expect($title.text()).to.equal(card.title);
        });
    });
  });

  it('renders title icon', () => {
    cy.dataCy(selectorCardProgressHeader)
      .find('.q-icon')
      .should('contain', card.icon)
      .and('have.color', blueGrey1)
      .and('have.css', 'width', '18px')
      .and('have.css', 'height', '18px');
  });

  it('renders timeline', () => {
    cy.dataCy(selectorCardProgressTimeline)
      .should('be.visible')
      .and('contain', card.duration.current)
      .and('contain', card.duration.total)
      .and('contain', i18n.global.t('index.cardProgressSlider.timeline'))
      .and('have.color', white)
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400');
  });

  it('renders percentage', () => {
    cy.dataCy(selectorCardProgressPercentage)
      .should('be.visible')
      .and('contain', card.progress)
      .and('contain', i18n.global.t('index.cardProgressSlider.toDate'));
    cy.dataCy(selectorCardProgressCircular).should('be.visible');
    cy.dataCy(selectorCardProgressPercentage)
      .find('.circular-progress-number')
      .should('be.visible');
  });

  it('renders card header horizontally', () => {
    cy.dataCy(selectorCardProgressHeader)
      .should('be.visible')
      .and('have.css', 'display', 'flex')
      .and('have.css', 'flex-direction', 'row')
      .and('have.css', 'justify-content', 'space-between')
      .and('have.css', 'align-items', 'center')
      .and('have.css', 'gap', '16px');
  });
}
