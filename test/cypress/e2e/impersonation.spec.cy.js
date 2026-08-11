import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Impersonation', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.viewport('macbook-16');
    });

    it('processes impersonation tokens and displays banner', () => {
      // mock JWT token with embedded user ID (format: header.payload.signature)
      const impersonatedUserId = 123;
      const impersonatedAccessToken = createMockJWT({
        user_id: impersonatedUserId,
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      const impersonatedRefreshToken = 'impersonated-refresh-token';
      // intercept API calls needed after impersonation
      cy.fixture('loginRegisterResponseChallengeActive').then(
        (loginResponse) => {
          cy.fixture('refreshTokensResponseChallengeActive').then(
            (refreshTokensResponse) => {
              cy.task('getAppConfig', process).then((config) => {
                // setup API intercepts for impersonated user
                cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                  config,
                  defLocale,
                  loginResponse,
                  null,
                  refreshTokensResponse,
                  null,
                  { has_user_verified_email_address: true },
                );
                // intercept register challenge API
                cy.fixture('apiGetRegisterChallengeEmpty.json').then(
                  (response) => {
                    cy.interceptRegisterChallengeGetApi(
                      config,
                      defLocale,
                      response,
                    );
                  },
                );
                // intercept coordinator status API
                cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                  (response) => {
                    cy.interceptIsUserOrganizationAdminGetApi(
                      config,
                      defLocale,
                      response,
                    );
                  },
                );
                // visit home page with impersonation tokens in URL
                cy.visit(
                  '#' +
                    routesConf['home']['path'] +
                    `?refreshToken=${encodeURIComponent(impersonatedRefreshToken)}&accessToken=${encodeURIComponent(impersonatedAccessToken)}`,
                );
                // wait for API calls
                cy.wait([
                  '@verifyEmailRequest',
                  '@thisCampaignRequest',
                  '@getRegisterChallenge',
                ]);
                // verify impersonation banner is visible
                cy.dataCy('impersonation-banner').should('be.visible');
                // verify banner shows correct user ID
                cy.dataCy('impersonation-banner').should(
                  'contain',
                  impersonatedUserId.toString(),
                );
                // verify tokens are removed from URL
                cy.url().should('not.include', 'refreshToken');
                cy.url().should('not.include', 'accessToken');
                // verify we're on home page
                cy.url().should('include', routesConf['home']['path']);
              });
            },
          );
        },
      );
    });

    it('allows navigation during impersonation', () => {
      const impersonatedUserId = 123;
      const impersonatedAccessToken = createMockJWT({
        user_id: impersonatedUserId,
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      const impersonatedRefreshToken = 'impersonated-refresh-token';
      cy.fixture('loginRegisterResponseChallengeActive').then(
        (loginResponse) => {
          cy.fixture('refreshTokensResponseChallengeActive').then(
            (refreshTokensResponse) => {
              cy.task('getAppConfig', process).then((config) => {
                cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                  config,
                  defLocale,
                  loginResponse,
                  null,
                  refreshTokensResponse,
                  null,
                  { has_user_verified_email_address: true },
                );
                cy.fixture('apiGetRegisterChallengeEmpty.json').then(
                  (response) => {
                    cy.interceptRegisterChallengeGetApi(
                      config,
                      defLocale,
                      response,
                    );
                  },
                );
                cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                  (response) => {
                    cy.interceptIsUserOrganizationAdminGetApi(
                      config,
                      defLocale,
                      response,
                    );
                  },
                );
                // start impersonation
                cy.visit(
                  '#' +
                    routesConf['home']['path'] +
                    `?refreshToken=${encodeURIComponent(impersonatedRefreshToken)}&accessToken=${encodeURIComponent(impersonatedAccessToken)}`,
                );
                cy.wait([
                  '@verifyEmailRequest',
                  '@thisCampaignRequest',
                  '@getRegisterChallenge',
                ]);
                // verify banner is visible
                cy.dataCy('impersonation-banner').should('be.visible');
                // navigate to another page
                cy.visit('#' + routesConf['prizes']['path']);
                // verify banner is still visible
                cy.dataCy('impersonation-banner').should('be.visible');
                cy.dataCy('impersonation-banner').should(
                  'contain',
                  impersonatedUserId.toString(),
                );
              });
            },
          );
        },
      );
    });

    it('exits impersonation by clicking exit button', () => {
      const impersonatedUserId = 123;
      const impersonatedAccessToken = createMockJWT({
        user_id: impersonatedUserId,
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      const impersonatedRefreshToken = 'impersonated-refresh-token';
      cy.fixture('loginRegisterResponseChallengeActive').then(
        (loginResponse) => {
          cy.fixture('refreshTokensResponseChallengeActive').then(
            (refreshTokensResponse) => {
              cy.task('getAppConfig', process).then((config) => {
                // setup API intercepts
                cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                  config,
                  defLocale,
                  loginResponse,
                  null,
                  refreshTokensResponse,
                  null,
                  { has_user_verified_email_address: true },
                );
                cy.fixture('apiGetRegisterChallengeEmpty.json').then(
                  (response) => {
                    cy.interceptRegisterChallengeGetApi(
                      config,
                      defLocale,
                      response,
                    );
                  },
                );
                cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                  (response) => {
                    cy.interceptIsUserOrganizationAdminGetApi(
                      config,
                      defLocale,
                      response,
                    );
                  },
                );
                // start impersonation
                cy.visit(
                  '#' +
                    routesConf['home']['path'] +
                    `?refreshToken=${encodeURIComponent(impersonatedRefreshToken)}&accessToken=${encodeURIComponent(impersonatedAccessToken)}`,
                );
                cy.wait([
                  '@verifyEmailRequest',
                  '@thisCampaignRequest',
                  '@getRegisterChallenge',
                ]);
                // verify impersonation is active
                cy.dataCy('impersonation-banner').should('be.visible');
                // click exit button
                cy.dataCy('impersonation-exit-button').click();
                // verify banner is hidden after a short delay
                cy.dataCy('impersonation-banner').should('not.exist');
              });
            },
          );
        },
      );
    });
  });
});

// create a mock JWT token with the given payload (format: base64(header).base64(payload).signature)
function createMockJWT(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.mock-signature`;
}
