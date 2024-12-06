import { routesConf } from '../../../src/router/routes_conf';
import {
  systemTimeChallengeActive,
  systemTimeChallengeInactive,
} from '../support/commonTests';

describe('Router rules', () => {
  context('challenge inactive', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeInactive, ['Date']);
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['login']['path']);

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.fixture('refreshTokensResponseChallengeInactive').then(
            (refreshTokensResponseChallengeInactive) => {
              cy.fixture('loginRegisterResponseChallengeInactive').then(
                (loginRegisterResponseChallengeInactive) => {
                  cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                    config,
                    win.i18n,
                    loginRegisterResponseChallengeInactive,
                    null,
                    refreshTokensResponseChallengeInactive,
                    null,
                    { has_user_verified_email_address: true },
                  );
                },
              );
            },
          );
        });
      });
    });

    it('after login, redirects to challenge inactive page', () => {
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
      // try to access other pages
      cy.visit('#' + routesConf['prizes']['path']);
      cy.url().should('not.include', routesConf['prizes']['path']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
    });
  });

  context('challenge active', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['login']['path']);

      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.fixture('refreshTokensResponseChallengeActive').then(
            (refreshTokensResponseChallengeActive) => {
              cy.fixture('loginRegisterResponseChallengeActive').then(
                (loginRegisterResponseChallengeActive) => {
                  cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                    config,
                    win.i18n,
                    loginRegisterResponseChallengeActive,
                    null,
                    refreshTokensResponseChallengeActive,
                    null,
                    { has_user_verified_email_address: true },
                  );
                },
              );
            },
          );
        });
      });
    });

    it('after login, redirects to home page', () => {
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('not.include', routesConf['login']['path']);
      cy.url().should('not.include', routesConf['verify_email']['path']);
      cy.url().should('not.include', routesConf['challenge_inactive']['path']);
      cy.url().should('include', routesConf['home']['path']);
    });
  });
});
