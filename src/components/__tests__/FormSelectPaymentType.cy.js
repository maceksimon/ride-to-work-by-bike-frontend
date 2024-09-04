import { colors } from 'quasar';
import FormSelectPaymentType from 'components/register/FormSelectPaymentType.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');

// selectors
const selectorFormSelectPaymentType = 'form-select-payment-type';
const selectorFormSelectPaymentTypeTitle = 'form-select-payment-type-title';
const selectorFormSelectPaymentTypeOptionLabel =
  'form-select-payment-type-option-label';
const selectorFastTransferTitle = 'fast-transfer-title';
const selectorFastCardTitle = 'fast-card-title';
const selectorOtherPaymentsTitle = 'other-payments-title';
const selectorPaymentInfo = 'payment-info';
const selectorPaymentProvider = 'payment-provider';
const titleFontSize = '24px';
const titleFontWeight = '700';
const subtitleFontSize = '12px';
const labelFontSize = '14px';
const fontWeightRegular = '400';

describe('<FormSelectPaymentType>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormSelectPaymentType, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormSelectPaymentType, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorFormSelectPaymentType).should('be.visible');
    cy.dataCy(selectorFormSelectPaymentTypeTitle)
      .should('have.css', 'font-size', titleFontSize)
      .and('have.css', 'font-weight', titleFontWeight)
      .and('have.text', i18n.global.t('register.challenge.titlePaymentType'));
    cy.dataCy(selectorFastTransferTitle)
      .should('have.css', 'font-size', subtitleFontSize)
      .and('have.css', 'font-weight', titleFontWeight)
      .and('have.text', i18n.global.t('register.challenge.titleFastTransfer'));
    cy.dataCy(selectorFastCardTitle)
      .should('have.css', 'font-size', subtitleFontSize)
      .and('have.css', 'font-weight', titleFontWeight)
      .and('have.text', i18n.global.t('register.challenge.titleFastCard'));
    cy.dataCy(selectorOtherPaymentsTitle)
      .should('have.css', 'font-size', subtitleFontSize)
      .and('have.css', 'font-weight', titleFontWeight)
      .and('have.text', i18n.global.t('register.challenge.titleOtherPayments'));
    cy.dataCy(selectorPaymentInfo)
      .should('have.css', 'font-size', labelFontSize)
      .and('have.css', 'font-weight', fontWeightRegular)
      .and('have.color', grey8)
      .and('have.text', i18n.global.t('register.challenge.textPaymentInfo'));
    cy.dataCy(selectorPaymentProvider)
      .should('have.css', 'font-size', labelFontSize)
      .and('have.css', 'font-weight', fontWeightRegular)
      .and('have.color', grey8)
      .and(
        'have.text',
        i18n.global.t('register.challenge.textPaymentProvider'),
      );
    cy.dataCy(selectorFormSelectPaymentTypeOptionLabel)
      .should('have.css', 'font-size', labelFontSize)
      .and('have.css', 'font-weight', fontWeightRegular);
  });
}
