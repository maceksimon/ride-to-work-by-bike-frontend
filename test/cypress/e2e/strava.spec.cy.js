// libraries
import { routesConf } from '../../../src/router/routes_conf';
import { StravaScope } from 'src/components/enums/StravaScope';

const validCode = 'example_valid_code';
const invalidCode = 'example_invalid_code';
describe('Strava Integration', () => {
  beforeEach(() => {
    cy.visit(`#${routesConf['routes_list']['children']['fullPath']}`);
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

  describe('Make a connection to Strava account', () => {
    it('should connect to Strava account (scope read)', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for account
          cy.interceptGetStravaAccount(
            config,
            i18n,
            'apiGetStravaAccountEmpty.json',
          );
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // wait for GET request
          cy.wait('@getStravaAccount');
          // intercept GET request for connect with scope
          // !auth_url in fixture response contains ?strava=test
          cy.interceptGetStravaConnectAccount(
            config,
            i18n,
            'apiGetStravaConnectExists.json',
            StravaScope.read,
          );
          // shows connect button
          cy.dataCy('strava-app-connect-button').should('be.visible').click();
          // wait for GET request
          cy.wait('@getStravaConnectAccount');
          // validate redirect - url contains ?strava=test
          cy.url().should('include', '?strava=test');
        });
      });
    });

    it('should connect to Strava account (scope read_all)', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for account
          cy.interceptGetStravaAccount(
            config,
            i18n,
            'apiGetStravaAccountEmpty.json',
          );
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // wait for GET request
          cy.wait('@getStravaAccount');
          // intercept GET request for connect with scope
          // !auth_url in fixture response contains ?strava=test
          cy.interceptGetStravaConnectAccount(
            config,
            i18n,
            'apiGetStravaConnectExists.json',
            StravaScope.readAll,
          );
          // shows toggle button for scope
          cy.dataCy('strava-app-sync-all-toggle').should('be.visible').check();
          // shows connect button
          cy.dataCy('strava-app-connect-button').should('be.visible').click();
          // wait for GET request
          cy.wait('@getStravaConnectAccount');
          // validate redirect - url contains ?strava=test
          cy.url().should('include', '?strava=test');
        });
      });
    });
  });

  describe('Successfully create new Strava account', () => {
    it('should successfully create new Strava account', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for auth with valid code
          cy.interceptGetStravaAuthWithParam(
            config,
            i18n,
            'apiGetStravaAuthCreated.json',
            validCode,
          );
          // visit connect-apps page with valid code
          cy.visit(
            `#${routesConf['routes_connect_apps']['children']['fullPath']}?code=${validCode}`,
          );
          // verify loading state
          cy.dataCy('spinner-routes-connect-apps-page').should('be.visible');
          // await GET request
          cy.wait('@getStravaAuthWithParam');
          // verify success notification
          cy.contains(i18n.global.t('authStravaAccount.apiMessageSuccess'));
          // verify successful redirect
          cy.url().should(
            'include',
            routesConf['routes_app']['children']['fullPath'],
          );
        });
      });
    });
  });

  describe('Successfully update existing Strava account', () => {
    it('should successfully update existing Strava account', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for auth with valid code
          cy.interceptGetStravaAuthWithParam(
            config,
            i18n,
            'apiGetStravaAuthUpdated.json',
            validCode,
          );
          // visit connect-apps page with valid code
          cy.visit(
            `#${routesConf['routes_connect_apps']['children']['fullPath']}?code=${validCode}`,
          );
          // verify loading state
          cy.dataCy('spinner-routes-connect-apps-page').should('be.visible');
          // await GET request
          cy.wait('@getStravaAuthWithParam');
          // verify success notification
          cy.contains(i18n.global.t('authStravaAccount.apiMessageSuccess'));
          // verify successful redirect
          cy.url().should(
            'include',
            routesConf['routes_app']['children']['fullPath'],
          );
        });
      });
    });
  });

  describe('Error during auth to Strava account - invalid code', () => {
    it('should handle invalid auth code', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for auth with invalid code
          cy.interceptGetStravaAuthWithParam(
            config,
            i18n,
            'apiGetStravaAuthError.json',
            invalidCode,
          );
          // visit connect-apps page with invalid code
          cy.visit(
            `#${routesConf['routes_connect_apps']['children']['fullPath']}?code=${invalidCode}`,
          );
          // verify loading state
          cy.dataCy('spinner-routes-connect-apps-page').should('be.visible');
          // await GET request
          cy.wait('@getStravaAuthWithParam');
          // verify error notification
          cy.contains(
            i18n.global.t('authStravaAccount.apiMessageErrorWithMessage'),
          );
          // verify redirect to app page
          cy.url().should(
            'include',
            routesConf['routes_app']['children']['fullPath'],
          );
        });
      });
    });
  });

  describe('Error during auth to Strava account - missing code', () => {
    it('should handle missing auth code', () => {
      cy.get('@i18n').then((i18n) => {
        // visit connect-apps page without code
        cy.visit(
          `#${routesConf['routes_connect_apps']['children']['fullPath']}`,
        );
        // verify error notification
        cy.contains(i18n.global.t('routes.messageStravaNoAuthCode')).should(
          'be.visible',
        );
        // verify redirect to app page
        cy.url().should(
          'include',
          routesConf['routes_app']['children']['fullPath'],
        );
      });
    });
  });

  describe('Manage connect to and disconnect from Strava account', () => {
    beforeEach(() => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for account
          cy.interceptGetStravaAccount(
            config,
            i18n,
            'apiGetStravaAccountExists.json',
          );
        });
      });
    });

    it('should successfully disconnect Strava account', () => {
      // mock successful disconnect response
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // mock successful disconnect response
          cy.interceptGetStravaDisconnect(
            config,
            i18n,
            'apiGetStravaDeleteAccountSuccess.json',
          );
          cy.wait('@getStravaAccount');
          // click disconnect button
          cy.dataCy('strava-app-disconnect-button')
            .should('be.visible')
            .click();
          // wait for disconnect request
          cy.wait('@getStravaDisconnect');
          // verify account is disconnected
          cy.dataCy('strava-app-connect-button').should('be.visible');
        });
      });
    });

    it('should handle disconnect error', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // mock error disconnect response
          cy.interceptGetStravaDisconnect(
            config,
            i18n,
            'apiGetStravaDeleteAccountError.json',
          );
          // click disconnect button
          cy.dataCy('strava-app-disconnect-button')
            .should('be.visible')
            .click();
          // wait for disconnect request
          cy.wait('@getStravaDisconnect');
          // verify error notification
          cy.contains(
            i18n.global.t('disconnectStravaAccount.apiMessageError'),
          ).should('be.visible');
        });
      });
    });
  });
});
