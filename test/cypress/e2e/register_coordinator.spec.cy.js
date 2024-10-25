import {
  fillFormRegisterCoordinator,
  httpSuccessfullStatus,
  interceptOrganizationsApi,
  interceptRegisterCoordinatorApi,
  testLanguageSwitcher,
  testBackgroundImage,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

describe('Login page', () => {
  context('desktop', () => {
    beforeEach(() => {
      /**
       * Visit home so that we can setup the API intercepts.
       * The setup needs i18n object to be initialized.
       */
      cy.visit('#' + routesConf['login']['path']);
      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
          // intercept organizations API call (before mounting component)
          interceptOrganizationsApi(config, win.i18n);
          // intercept register coordinator API call (before mounting component)
          interceptRegisterCoordinatorApi(config, win.i18n);
          // specify data for register coordinator request body
          cy.fixture('formRegisterCoordinator').then(
            (formRegisterCoordinatorData) => {
              cy.fixture('formFieldCompany').then(
                (formFieldCompanyResponse) => {
                  cy.wrap({
                    firstName: formRegisterCoordinatorData.firstName,
                    jobTitle: formRegisterCoordinatorData.jobTitle,
                    lastName: formRegisterCoordinatorData.lastName,
                    newsletter: formRegisterCoordinatorData.newsletter,
                    organizationId: formFieldCompanyResponse.results[0].id,
                    phone: formRegisterCoordinatorData.phone,
                    responsibility: true,
                    terms: true,
                  }).as('registerRequestBody');
                },
              );
            },
          );
        });
      });
      /**
       * Visit register coordinator page to run tests.
       * Intercepts need to be setup as organizations load on mount.
       */
      cy.visit('#' + routesConf['register_coordinator']['path']);
      cy.viewport('macbook-16');
    });

    testBackgroundImage();

    it('renders login register header component', () => {
      cy.dataCy('login-register-header').should('be.visible');
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('language-switcher').should('be.visible');
    });

    // switching between languages can only be tested in E2E context
    testLanguageSwitcher();

    it('renders page title', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.dataCy('register-coordinator-title')
            .should('be.visible')
            .and('have.color', config.colorWhite)
            .and('have.css', 'font-size', '24px')
            .and('have.css', 'font-weight', '700')
            .then(($el) => {
              cy.wrap(
                i18n.global.t(
                  `register.coordinator.title.${config.challengeMonth}`,
                ),
              ).then((translation) => {
                // test v-html content
                const htmlContent = $el.html();
                expect(htmlContent).to.equal(translation);
              });
            });
        });
      });
    });

    it('renders info card', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.dataCy('info-card')
            .should('be.visible')
            .and('have.backgroundColor', config.colorSecondary)
            .and('have.css', 'border-radius', config.borderRadiusCard);
          cy.dataCy('info-title')
            .should('be.visible')
            .and('have.css', 'font-size', '16px')
            .and('have.css', 'font-weight', '700')
            .then(($el) => {
              cy.wrap(i18n.global.t('register.coordinator.titleInfo')).then(
                (translation) => {
                  expect($el.text()).to.equal(translation);
                },
              );
            });
          cy.dataCy('info-content')
            .should('be.visible')
            .and('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .then(($el) => {
              cy.wrap(i18n.global.t('register.coordinator.info')).then(
                (translation) => {
                  // test v-html content
                  const htmlContent = $el.html();
                  expect(htmlContent).to.equal(translation);
                },
              );
            });
        });
      });
    });

    it('fills in the form, submits it, and redirects to homepage on success', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
          cy.wait('@getOrganizations').then((interception) => {
            expect(interception.request.headers.authorization).to.include(
              'Bearer',
            );
            expect(interception.response.statusCode).to.equal(
              httpSuccessfullStatus,
            );
            expect(interception.response.body).to.deep.equal(
              formFieldCompanyResponse,
            );
            // fill in the form
            fillFormRegisterCoordinator();
            // check responsibility checkbox
            cy.dataCy('form-register-coordinator-responsibility')
              .find('.q-checkbox')
              .click();
            // check terms checkbox
            cy.dataCy('form-register-coordinator-terms')
              .find('.q-checkbox')
              .click();
            // submit form
            cy.dataCy('form-register-coordinator-submit').click();
            // wait for the API call to complete
            cy.wait('@registerCoordinator').then((interception) => {
              cy.get('@registerRequestBody').then((registerRequestBody) => {
                expect(interception.request.body).to.deep.equal(
                  registerRequestBody,
                );
                expect(interception.response.statusCode).to.equal(
                  httpSuccessfullStatus,
                );
                // check if the success message is displayed
                cy.contains(
                  i18n.global.t('registerCoordinator.apiMessageSuccess'),
                ).should('be.visible');
                // check if redirected to homepage
                cy.url().should('include', routesConf['home']['path']);
              });
            });
          });
        });
      });
    });
  });
});
