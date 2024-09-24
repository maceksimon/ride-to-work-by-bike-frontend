import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';

describe('Results page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
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
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('routes-calendar').should('be.visible');
  });
}
