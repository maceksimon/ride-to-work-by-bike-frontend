import {
  testLanguageSwitcher,
  testBackgroundImage,
  httpInternalServerErrorStatus,
  systemTimeChallengeActive,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

// selectors
const selectorLogoutButton = 'logout-button';
const selectorUserSelectDesktop = 'user-select-desktop';
const selectorUserSelectInput = 'user-select-input';
const selectorEmailVerificationRegisterLink =
  'email-verification-register-link';

describe('Register page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['register']['path']);
      cy.viewport('macbook-16');
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

    testBackgroundImage();

    it('renders page header', () => {
      cy.dataCy('login-register-header').should('be.visible');
    });

    testLanguageSwitcher();

    it('renders register form', () => {
      cy.dataCy('form-register').should('be.visible');
    });

    it('renders page title', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('form-register-title')
          .should('be.visible')
          .and('have.css', 'font-size', '24px')
          .and('have.css', 'font-weight', '700')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.titleRegister')).then(
              (translation) => {
                expect($el.text()).to.equal(translation);
              },
            );
          });
      });
    });

    it('renders login link', () => {
      cy.dataCy('form-register-login-link')
        .should('be.visible')
        .invoke('attr', 'href')
        .should('contain', routesConf['login']['path']);
    });
  });

  context('inactive challenge', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['register']['path']);

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

    it('shows error message on registration failure', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // intercept register request
          cy.interceptRegisterApi(
            config,
            i18n,
            {
              message: 'Registration failed',
            },
            httpInternalServerErrorStatus,
          );
          // fill and submit form
          cy.fillAndSubmitRegisterForm();
          // wait for request to complete
          cy.wait('@registerRequest');
          // check error message
          cy.get('@i18n').then((i18n) => {
            cy.contains(
              i18n.global.t('register.apiMessageErrorWithMessage'),
            ).should('be.visible');
          });
        });
      });
    });
  });

  context('active challenge', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.visit('#' + routesConf['register']['path']);
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
      //cy.reload();
    });

    // ! router redirection rules are enabled for this file in /router/index.ts
    it('allows user to register with valid credentials and requires email verification to access other pages', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.interceptRegisterVerifyEmailApi(config, i18n);

          // fill and submit form
          cy.fillAndSubmitRegisterForm();
          // wait for request to complete
          cy.wait('@registerRequest').then((interception) => {
            cy.fixture('registerUserRequest').then((registerUserFormData) => {
              expect(interception.request.body).to.deep.equal(
                registerUserFormData,
              );
            });
            cy.fixture('registerResponse.json').then((registerResponse) => {
              expect(interception.response.body).to.deep.equal(
                registerResponse,
              );
            });
          });
          // redirect to verify email page
          cy.url().should('contain', routesConf['verify_email']['path']);
          cy.wait('@verifyEmailRequest').then((interception) => {
            expect(interception.response.body).to.deep.equal({
              has_user_verified_email_address: false,
            });
          });

          // test navigating to app pages (logged in and email not verified)
          cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
          cy.url().should(
            'not.contain',
            routesConf['routes_calendar']['children']['fullPath'],
          );
          cy.url().should('contain', routesConf['verify_email']['path']);
          // results page
          cy.visit('#' + routesConf['results']['path']);
          cy.url().should('not.contain', routesConf['results']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
          // community page
          cy.visit('#' + routesConf['community']['path']);
          cy.url().should('not.contain', routesConf['community']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
          // prizes page
          cy.visit('#' + routesConf['prizes']['path']);
          cy.url().should('not.contain', routesConf['prizes']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
          // profile page
          cy.visit('#' + routesConf['profile_details']['path']);
          cy.url().should('not.contain', routesConf['profile_details']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
          // test navigating to login and register page (this is NOT allowed when email not verified and logged in)
          cy.visit('#' + routesConf['login']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
          cy.visit('#' + routesConf['register']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
          // test navigating to verify email page (this is allowed when email not verified)
          cy.visit('#' + routesConf['verify_email']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
        });
      });
    });

    it('displays a logout button on the verify email page and allows to logout', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.interceptRegisterVerifyEmailApi(config, i18n);
          // fill and submit form
          cy.fillAndSubmitRegisterForm();
          // wait for request to complete
          cy.fixture('registerResponse.json').then((registerResponse) => {
            cy.wait('@registerRequest').then((interception) => {
              cy.fixture('registerUserRequest').then((registerUserFormData) => {
                expect(interception.request.body).to.deep.equal(
                  registerUserFormData,
                );
              });
              expect(interception.response.body).to.deep.equal(
                registerResponse,
              );
            });
          });
          // redirect to verify email page
          cy.url().should('contain', routesConf['verify_email']['path']);
          // wait for email verification request to complete
          cy.wait('@verifyEmailRequest').then((interception) => {
            expect(interception.response.body).to.deep.equal({
              has_user_verified_email_address: false,
            });
          });
          // it shows logout button
          cy.dataCy(selectorLogoutButton).should('be.visible');
          // click logout button
          cy.dataCy(selectorLogoutButton).click();
          // redirected to login page
          cy.url().should('not.include', routesConf['verify_email']['path']);
          cy.url().should('include', routesConf['login']['path']);
          // logout button is no longer visible
          cy.dataCy(selectorLogoutButton).should('not.exist');
        });
      });
    });

    it('redirects to home page after registering and verifying email and allows logout', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.interceptRegisterVerifyEmailVerifyCampaignPhaseApi(config, i18n);
          // fill form
          cy.fillAndSubmitRegisterForm();
          // wait for request to complete
          cy.fixture('registerResponse.json').then((registerResponse) => {
            cy.wait('@registerRequest').then((interception) => {
              cy.fixture('registerUserRequest').then((registerUserFormData) => {
                expect(interception.request.body).to.deep.equal(
                  registerUserFormData,
                );
              });
              expect(interception.response.body).to.deep.equal(
                registerResponse,
              );
            });
          });
          // redirect to verify email page
          cy.url().should('contain', routesConf['verify_email']['path']);
          // wait for email verification request to complete
          cy.wait('@verifyEmailRequest').then((interception) => {
            expect(interception.response.body).to.deep.equal({
              has_user_verified_email_address: false,
            });
          });
          cy.url().should('contain', routesConf['verify_email']['path']);

          // update verification request - verified
          cy.interceptVerifyEmailApi(config, i18n, {
            has_user_verified_email_address: true,
          });
          cy.reload();
          cy.wait('@verifyEmailRequest').then((interception) => {
            expect(interception.response.body).to.deep.equal({
              has_user_verified_email_address: true,
            });
          });
          cy.reload();
          cy.fixture('apiGetThisCampaign').then((apiGetThisCampaign) => {
            cy.wait('@thisCampaignRequest').then((interception) => {
              expect(interception.response.body).to.deep.equal(
                apiGetThisCampaign,
              );
            });
          });

          // redirected to home page
          cy.url().should('contain', routesConf['home']['path']);
          // click user select
          cy.dataCy(selectorUserSelectDesktop).within(() => {
            cy.dataCy(selectorUserSelectInput).should('be.visible').click();
          });
          // logout
          cy.dataCy('menu-item')
            .contains(i18n.global.t('userSelect.logout'))
            .click();
          // redirected to login page
          cy.url().should('include', routesConf['login']['path']);
        });
      });
    });

    it('allows user to stop registration process before email verification and register again', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.fixture('registerResponse.json').then((registerResponse) => {
            cy.interceptRegisterApi(config, i18n);
            // fill form
            cy.fillAndSubmitRegisterForm();
            cy.wait('@registerRequest').then((interception) => {
              cy.fixture('registerUserRequest').then((registerUserFormData) => {
                expect(interception.request.body).to.deep.equal(
                  registerUserFormData,
                );
              });
              expect(interception.response.body).to.deep.equal(
                registerResponse,
              );
            });
          });
          // redirect to verify email page
          cy.url().should('contain', routesConf['verify_email']['path']);
          // test access to register page
          cy.visit('#' + routesConf['register']['path']);
          // register page should not be accessible
          cy.url().should('not.contain', routesConf['register']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);
          // click register again link (logs out user)
          cy.dataCy(selectorEmailVerificationRegisterLink)
            .should('be.visible')
            .click();
          // redirected to register page
          cy.url().should('contain', routesConf['register']['path']);
        });
      });
    });
  });
});
