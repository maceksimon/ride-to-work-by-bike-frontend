import FormFieldVoucher from 'components/form/FormFieldVoucher.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorFormFieldVoucher = 'form-field-voucher';
const selecotrFormFieldVoucherInput = 'form-field-voucher-input';
const selectorFormFieldVoucherSubmit = 'form-field-voucher-submit';
const selectorQNotifyMessage = '.q-notification__message';

const codeFull = 'FULL';
const codeHalf = 'HALF';
const codeInvalid = 'ABCD';

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
    cy.dataCy(selectorFormFieldVoucher).should('be.visible');
    cy.dataCy(selecotrFormFieldVoucherInput).should('be.visible');
    cy.dataCy(selectorFormFieldVoucherSubmit)
      .should('be.visible')
      .and('contain', i18n.global.t('form.buttonVoucherSubmit'));
  });

  it('clears input after successful submit', () => {
    // submit voucher
    cy.dataCy(selecotrFormFieldVoucherInput).type(codeFull);
    cy.dataCy(selectorFormFieldVoucherSubmit).click();
    cy.dataCy(selecotrFormFieldVoucherInput)
      .find('input')
      .should('have.value', codeFull);
    // user message
    cy.get(selectorQNotifyMessage)
      .should('be.visible')
      .and('contain', i18n.global.t('notify.voucherApplySuccess'));
    cy.dataCy(selecotrFormFieldVoucherInput).clear();
    // submit voucher
    cy.dataCy(selecotrFormFieldVoucherInput).type(codeHalf);
    cy.dataCy(selectorFormFieldVoucherSubmit).click();
    cy.dataCy(selecotrFormFieldVoucherInput)
      .find('input')
      .should('have.value', codeHalf);
    // user message
    cy.get(selectorQNotifyMessage)
      .should('be.visible')
      .and('contain', i18n.global.t('notify.voucherApplySuccess'));
    cy.dataCy(selecotrFormFieldVoucherInput).clear();
    // submit invalid voucher
    cy.dataCy(selecotrFormFieldVoucherInput).type(codeInvalid);
    cy.dataCy(selectorFormFieldVoucherSubmit).click();
    cy.dataCy(selecotrFormFieldVoucherInput)
      .find('input')
      .should('have.value', codeInvalid);
    // user message
    cy.get(selectorQNotifyMessage)
      .should('be.visible')
      .and('contain', i18n.global.t('notify.voucherApplyError'));
    cy.dataCy(selecotrFormFieldVoucherInput).clear();
  });
}
