import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Routes calendar page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
      });
      cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        // alias i18n
        cy.wrap(win.i18n).as('i18n');
      });
      cy.waitForCommuteModeApi();
      cy.waitForTripsApi();
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
