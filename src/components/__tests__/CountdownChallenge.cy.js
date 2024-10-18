import { colors } from 'quasar';
import CountdownChallenge from '../homepage/CountdownChallenge.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor, changeAlpha } = colors;
const grey10 = getPaletteColor('grey-10');
const secondary = getPaletteColor('secondary');
const secondaryOpacity = changeAlpha(
  secondary,
  rideToWorkByBikeConfig.colorSecondaryBackgroundOpacity,
);

// variables
const { borderRadiusCard } = rideToWorkByBikeConfig;

describe('<CountdownChallenge>', () => {
  const currentTime = new Date('2023-10-24T12:00:00');
  const dateEnd = new Date('2023-10-27T12:00:00');

  it('has translation for component strings', () => {
    cy.testLanguageStringsInContext(
      ['title'],
      'index.countdownChallenge',
      i18n,
    );
  });

  it('has translation for time strings', () => {
    cy.testLanguageStringsInContext(['day'], 'time', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CountdownChallenge, {
        props: {
          dateEnd,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CountdownChallenge, {
        props: {
          dateEnd,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  function coreTests() {
    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('countdown-challenge-title')
          .should('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '700')
          .and('have.css', 'margin-top', '16px')
          .and('have.css', 'margin-bottom', '16px')
          .and('have.color', grey10);
      });
    });

    it('renders wrapper with padding', () => {
      cy.dataCy('countdown-challenge')
        .should('have.css', 'padding', '24px')
        .and('have.css', 'border-radius', borderRadiusCard)
        .and('have.backgroundColor', secondaryOpacity);
    });

    it('counts down correctly', () => {
      // set local time to get correct values
      cy.clock(currentTime.getTime()).then(() => {
        cy.dataCy('countdown-days').should('have.text', '3');
        cy.dataCy('countdown-hours').should('have.text', '0');
        cy.dataCy('countdown-minutes').should('have.text', '0');
        cy.dataCy('countdown-seconds').should('have.text', '0');
        // wait 1 second
        cy.tick(1000);
        cy.dataCy('countdown-days').should('have.text', '2');
        cy.dataCy('countdown-hours').should('have.text', '23');
        cy.dataCy('countdown-minutes').should('have.text', '59');
        cy.dataCy('countdown-seconds').should('have.text', '59');
        // wait 1 minute
        cy.tick(60 * 1000);
        cy.dataCy('countdown-days').should('have.text', '2');
        cy.dataCy('countdown-hours').should('have.text', '23');
        cy.dataCy('countdown-minutes').should('have.text', '58');
        cy.dataCy('countdown-seconds').should('have.text', '59');
        // wait 1 hour
        cy.tick(60 * 60 * 1000);
        cy.dataCy('countdown-days').should('have.text', '2');
        cy.dataCy('countdown-hours').should('have.text', '22');
        cy.dataCy('countdown-minutes').should('have.text', '58');
        cy.dataCy('countdown-seconds').should('have.text', '59');
      });
    });
  }
});
