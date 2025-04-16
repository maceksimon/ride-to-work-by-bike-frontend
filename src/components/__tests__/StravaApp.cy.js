import { createPinia, setActivePinia } from 'pinia';
import StravaApp from 'components/routes/StravaApp.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import stravaAppStateTestData from '../../../test/cypress/fixtures/stravaAppStateTestData.json';

describe('<StravaApp>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelLastSync',
        'labelSyncAll',
        'buttonLinkToApp',
        'buttonDisconnect',
        'buttonSync',
        'labelSyncError',
        'statusSyncErrorWithMessage',
        'statusConnectedUser',
        'statusSyncSuccess',
        'statusSyncedTrips',
        'instructionStravaHowItWorks',
        'instructionSyncTripsFromStrava',
        'instructionSyncReadAllSettings',
        'instructionSyncWarnUser',
        'instructionStravaNotConnected',
        'titleStravaHowItWorks',
        'titleStravaNotConnected',
        'titleUserActivities',
      ],
      'routes',
      i18n,
    );
  });

  // context('desktop', () => {
  //   beforeEach(() => {
  //     cy.mount(StravaApp, {
  //       props: {},
  //     });
  //     cy.viewport('macbook-16');
  //   });

  //   coreTests();
  // });

  context('mobile', () => {
    stravaAppStateTestData.forEach((testData) => {
      // if (testData.description !== 'User is connected to Strava no trips but some activities') {
      //   return;
      // }
      it(testData.description, () => {
        setActivePinia(createPinia());
        cy.viewport('iphone-6');
        cy.mount(StravaApp, {
          props: {},
        });
        // set store state
        cy.interceptGetStravaAccount(
          rideToWorkByBikeConfig,
          i18n,
          testData.fixture,
        );
        // check component is visible
        cy.dataCy('strava-app').should('be.visible');
        // open expansion item
        cy.dataCy('strava-app-expansion-item-header')
          .should('be.visible')
          .click();
        // check visible elements
        testData.visibleElements.forEach((element) => {
          cy.dataCy(element.selector)
            .should('be.visible')
            .then(($el) => {
              const content = $el.text();
              cy.stripHtmlTags(
                i18n.global.t(element.contain, element.containTranslationData),
              ).then((text) => {
                expect(content).to.contain(text);
              });
            });
        });
      });
    });
  });
});
