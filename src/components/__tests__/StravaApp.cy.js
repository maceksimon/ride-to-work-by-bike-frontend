import StravaApp from 'components/routes/StravaApp.vue';
import { i18n } from '../../boot/i18n';

describe('<StravaApp>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelSyncAll', 'buttonLinkToApp', 'buttonDisconnect'],
      'routes',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(StravaApp, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(StravaApp, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('strava-app').should('be.visible');
    // title
    cy.dataCy('strava-app-title')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.appStrava'));
    // sync all toggle
    cy.dataCy('strava-app-sync-all-toggle')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.labelSyncAll'));
    // button not connected
    cy.dataCy('strava-app-connect-button')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.buttonLinkToApp'));
  });
}
