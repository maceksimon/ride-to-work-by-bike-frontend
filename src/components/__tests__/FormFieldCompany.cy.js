import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';
import { httpSuccessfullStatus } from '../../../test/cypress/support/commonTests';

// variables
const { apiBase, apiDefaultLang, urlApiOrganizations } = rideToWorkByBikeConfig;

describe('<FormFieldCompany>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelCompany',
        'labelCompanyShort',
        'messageFieldRequired',
        'messageNoCompany',
      ],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddCompany', 'titleAddCompany'],
      'form.company',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddCompany'],
      'register.challenge',
      i18n,
    );
    cy.testLanguageStringsInContext(['discard'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      // get API base URL
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiOrganizationsUrl = `${apiBaseUrl}${urlApiOrganizations}`;
      // intercept organizations API call (before mounting component)
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        cy.intercept('GET', apiOrganizationsUrl, {
          statusCode: httpSuccessfullStatus,
          body: formFieldCompanyResponse,
        }).as('getOrganizations');
      });
      // mount component
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldCompany',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders input with label', () => {
      // input wrapper
      cy.dataCy('form-company')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input label
      cy.dataCy('form-company')
        .find('label')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCompany'));
      // input
      cy.dataCy('form-company').find('input').should('be.visible');
    });

    it('allows user to select option', () => {
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        cy.wait('@getOrganizations').then((interception) => {
          expect(interception.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(interception.response.body).to.deep.equal(
            formFieldCompanyResponse,
          );
        });
      });

      cy.dataCy('form-company').find('input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // test selected option
      cy.dataCy('form-company')
        .find('input')
        .invoke('val')
        .should('eq', 'Company 1');
    });

    it('allows to search through options', () => {
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        cy.wait('@getOrganizations').then((interception) => {
          expect(interception.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(interception.response.body).to.deep.equal(
            formFieldCompanyResponse,
          );
        });
      });

      // search for option
      cy.dataCy('form-company').find('input').focus();
      cy.dataCy('form-company').find('input').type('2');
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // test selected option
      cy.dataCy('form-company')
        .find('input')
        .invoke('val')
        .should('eq', 'Company 2');
    });

    it('validates company field correctly', () => {
      cy.dataCy('form-company').find('input').focus();
      cy.dataCy('form-company').find('input').blur();
      cy.dataCy('form-company')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelCompanyShort'),
          }),
        );
      cy.dataCy('form-company').find('input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      cy.dataCy('form-company').find('.q-field__messages').should('not.exist');
    });

    it('renders input and button in a column layout', () => {
      cy.testElementsSideBySide('col-input', 'col-button');
    });

    it('renders dialog when for adding a new company', () => {
      cy.dataCy('button-add-company').click();
      cy.dataCy('dialog-add-company').should('be.visible');
      cy.dataCy('dialog-add-company')
        .find('h3')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('contain', i18n.global.t('form.company.titleAddCompany'));
      cy.dataCy('dialog-button-cancel')
        .should('be.visible')
        .and('have.text', i18n.global.t('navigation.discard'));
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('have.text', i18n.global.t('form.company.buttonAddCompany'));
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      // get API base URL
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiOrganizationsUrl = `${apiBaseUrl}${urlApiOrganizations}`;
      // intercept organizations API call (before mounting component)
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        cy.intercept('GET', apiOrganizationsUrl, {
          statusCode: httpSuccessfullStatus,
          body: formFieldCompanyResponse,
        }).as('getOrganizations');
      });
      // mount component
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldCompany',
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders input and button in a stacked layout', () => {
      cy.testElementPercentageWidth(cy.dataCy('col-input'), 100);
      cy.testElementPercentageWidth(cy.dataCy('col-button'), 100);
    });
  });
});
