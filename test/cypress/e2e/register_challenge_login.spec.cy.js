import { systemTimeChallengeActive } from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Register Challenge registration with login', () => {
  beforeEach(() => {
    cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        // intercept register challenge API
        cy.fixture('refreshTokensResponseChallengeActive').then(
          (refreshTokensResponseChallengeActive) => {
            cy.fixture('loginRegisterResponseChallengeActive').then(
              (loginRegisterResponseChallengeActive) => {
                cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                  config,
                  defLocale,
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
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        cy.interceptMyTeamGetApi(config, defLocale);
        cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
      });
      // go to login page
      cy.visit('#' + routesConf['login']['children']['fullPath']);
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
      // log in
      cy.fillAndSubmitLoginForm();
      // wait for register challenge page to load
      cy.url().should(
        'include',
        routesConf['register_challenge']['children']['fullPath'],
      );
    });
  });

  context('login and registration', () => {
    it('allows register from blank state and redirect to homepage', () => {
      cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
        cy.waitForRegisterChallengeGetApi(response);
      });
      cy.passToStep7();
      cy.dataCy('step-7-continue').should('be.visible').click();
      cy.dataCy('index-title').should('be.visible');
    });

    it('should not be redirected to homepage after refreshing on step merch', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
          cy.waitForRegisterChallengeGetApi(response);
        });
        // intercept register challenge GET API based on filled data
        cy.fixture('apiGetRegisterChallengeMissingMerch.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.passToStep6();
        // select merch
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="form-card-merch-link"]')
          .click();
        // close dialog
        cy.dataCy('dialog-close').click();
        // verify dialog is closed
        cy.dataCy('dialog-merch').should('not.exist');
        // refresh page
        cy.visit('#' + routesConf['home']['children']['fullPath']);
        // wait for register challenge page to load
        cy.url().should(
          'include',
          routesConf['register_challenge']['children']['fullPath'],
        );
      });
    });
  });
});
