import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar, testMobileHeader } from '../support/commonTests';

describe('Results page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['results']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
    testDesktopSidebar();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['results']['path']);
      cy.viewport('iphone-6');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
    testMobileHeader();
  });
});

function coreTests() {
  it('renders page heading section', () => {
    cy.get('@i18n').then((i18n) => {
      // title
      cy.dataCy('results-page-title')
        .should('be.visible')

        .then(($el) => {
          cy.wrap(i18n.global.t('results.titleResults')).then((translation) => {
            expect($el.text()).to.equal(translation);
          });
        });
    });
  });

  it('renders upcoming challenges section', () => {
    // upcoming challenges
    cy.dataCy('results-challenge-upcoming').should('be.visible');
  });
}
