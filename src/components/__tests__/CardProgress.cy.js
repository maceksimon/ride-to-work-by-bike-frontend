import { colors } from 'quasar';
import CardProgress from '../homepage/CardProgress.vue';
import { i18n } from '../../boot/i18n';
import { cardsProgress } from '../../mocks/homepage';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const blueGrey3 = getPaletteColor('blue-grey-3');

const cardFirst = cardsProgress[0];
const card = cardsProgress[1];

// variables
const iconSizeSm = 18;
const progressCircularSizeMobile = 128;
const progressCircularSize = 180;
const progressCircularFontSize = 36;

describe('<CardProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.cardProgress', i18n);
    cy.testLanguageStringsInContext(['buttonShare'], 'global', i18n);
  });

  context('desktop: dark', () => {
    beforeEach(() => {
      cy.mount(CardProgress, {
        props: {
          card: cardFirst,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders rounded card with the correct background', () => {
      cy.dataCy('card')
        .should('have.backgroundColor', primary)
        .and(
          'have.css',
          'border-radius',
          rideToWorkByBikeConfig.borderRadiusCard,
        );
    });

    it('renders white title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', white)
          .and('contain', cardFirst.title)
          .then(($title) => {
            expect($title.text()).to.equal(cardFirst.title);
          });
      });
    });

    it('renders prize icon', () => {
      cy.dataCy('card-progress-prizes-icon').and('have.color', white);
      cy.dataCy('card-progress-prizes-icon')
        .invoke('width')
        .should('be.eq', iconSizeSm);
      cy.dataCy('card-progress-prizes-icon')
        .invoke('height')
        .should('be.eq', iconSizeSm);
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .and('contain', cardFirst.progress);
      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .and('have.css', 'width', `${progressCircularSize}px`)
        .and('have.css', 'height', `${progressCircularSize}px`);
      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .and('have.css', 'font-size', `${progressCircularFontSize}px`);
    });

    it('renders larger placement number', () => {
      cy.dataCy('card-progress-prize-label')
        .should('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('have.color', white);
    });

    it('renders white separator', () => {
      cy.dataCy('card-progress-separator').should(
        'have.backgroundColor',
        white,
      );
    });

    it('renders white share link', () => {
      cy.dataCy('card-progress-share')
        .should('have.color', white)
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'font-weight', '700');
    });

    it('renders white share link icon', () => {
      cy.dataCy('card-progress-share-icon').should('have.color', white);
      cy.dataCy('card-progress-share-icon')
        .invoke('width')
        .should('be.eq', iconSizeSm);
      cy.dataCy('card-progress-share-icon')
        .invoke('height')
        .should('be.eq', iconSizeSm);
    });
  });

  context('desktop: light', () => {
    beforeEach(() => {
      cy.mount(CardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders dark title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', primary)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-title-icon')
        .should('be.visible')
        .and('have.color', primary);
      cy.dataCy('card-progress-title-icon')
        .invoke('width')
        .should('be.eq', iconSizeSm);
      cy.dataCy('card-progress-title-icon')
        .invoke('height')
        .should('be.eq', iconSizeSm);
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .and('contain', card.progress);
      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .and('have.css', 'width', `${progressCircularSize}px`)
        .and('have.css', 'height', `${progressCircularSize}px`);
      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .and('have.css', 'font-size', `${progressCircularFontSize}px`);
    });

    it('renders smaller placement number', () => {
      cy.dataCy('card-progress-prize-label')
        .should('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('have.color', primary);
    });

    it('renders light separator', () => {
      cy.dataCy('card-progress-separator').should(
        'have.backgroundColor',
        blueGrey3,
      );
    });

    it('renders dark share link', () => {
      cy.dataCy('card-progress-share')
        .should('have.color', primary)
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'font-weight', '700');
    });

    it('renders dark share link icon', () => {
      cy.dataCy('card-progress-share-icon').should('have.color', primary);
      cy.dataCy('card-progress-share-icon')
        .invoke('width')
        .should('be.eq', iconSizeSm);
      cy.dataCy('card-progress-share-icon')
        .invoke('height')
        .should('be.eq', iconSizeSm);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', primary)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-title-icon').and('have.color', primary);
      cy.dataCy('card-progress-title-icon')
        .invoke('width')
        .should('be.eq', iconSizeSm);
      cy.dataCy('card-progress-title-icon')
        .invoke('height')
        .should('be.eq', iconSizeSm);
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .and('contain', card.progress);
      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .and('have.css', 'width', `${progressCircularSizeMobile}px`)
        .and('have.css', 'height', `${progressCircularSizeMobile}px`);
      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .and('have.css', 'font-size', `${progressCircularFontSize}px`);
    });
  });
});
