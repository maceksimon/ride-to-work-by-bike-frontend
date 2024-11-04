import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar, testMobileHeader } from '../support/commonTests';

describe('Become coordinator page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['become_coordinator']['path']);
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
      cy.visit('#' + routesConf['become_coordinator']['path']);
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
  it('renders title and description with icon', () => {
    cy.get('@i18n').then((i18n) => {
      // title
      cy.dataCy('company-coordinator-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(
            i18n.global.t('companyCoordinator.titleBecomeCoordinator'),
          ).then((translation) => {
            expect($el.text()).to.eq(translation);
          });
        });
      // text
      cy.dataCy('company-coordinator-text')
        .should('be.visible')
        .then(($el) => {
          cy.stripHtmlTags(
            i18n.global.t('companyCoordinator.textBecomeCoordinator'),
          ).then((translation) => {
            expect($el.text()).to.eq(translation);
          });
        });
      // image
      cy.dataCy('company-coordinator-icon').should('be.visible');
    });
  });
}
