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
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
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

    it('after login, redirects to register-challenge page', () => {
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('not.include', routesConf['login']['path']);
      cy.url().should('not.include', routesConf['verify_email']['path']);
      cy.url().should('not.include', routesConf['challenge_inactive']['path']);
      cy.url().should('include', routesConf['register_challenge']['path']);
    });

    it('when registration is empty (not started), does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeEmpty').then((emptyResponse) => {
            // intercept register-challenge GET request with incomplete registration
            cy.interceptRegisterChallengeGetApi(
              config,
              i18n,
              emptyResponse,
              null,
            );
          });
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when company registration with no admission, does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeCompanyNoAdmission.json').then(
            (response) => {
              // intercept register-challenge GET request with incomplete registration
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when company registration waiting for payment, does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when individual registration is not paid, does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeIndividualNotPaid.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when individual registration is complete, allows to access all pages but not register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeIndividualPaid').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('not.include', routesConf['register_challenge']['path']);
      // test that we are on home page
      cy.dataCy('index-title').should('be.visible');
      // try accessing register-challenge page
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.url().should('not.include', routesConf['register_challenge']['path']);
      // redirects to home page
      cy.dataCy('index-title').should('be.visible');
      // go to profile page
      cy.visit('#' + routesConf['profile']['path']);
      cy.url().should('include', routesConf['profile']['path']);
      cy.dataCy('profile-page-title').should('be.visible');
      // try accessing register-challenge page again
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.url().should('not.include', routesConf['register_challenge']['path']);
      // redirects to home page
      cy.dataCy('index-title').should('be.visible');
    });
  });
});
