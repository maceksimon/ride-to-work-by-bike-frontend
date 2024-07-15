import FormFieldVoucher from 'components/form/FormFieldVoucher.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldVoucher>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonVoucherSubmit', 'labelVoucher'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-field-voucher').should('be.visible');
    cy.dataCy('form-field-voucher-input').should('be.visible');
    cy.dataCy('form-field-voucher-submit')
      .should('be.visible')
      .and('contain', i18n.global.t('form.buttonVoucherSubmit'));
  });

  it('clears input after successful submit', () => {
    cy.dataCy('form-field-voucher-input').type('AB-CDEFGH');
    cy.dataCy('form-field-voucher-submit').click();
    cy.dataCy('form-field-voucher-input').should('have.value', '');
  });
}
