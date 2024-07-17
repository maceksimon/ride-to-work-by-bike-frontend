import FormFieldDonation from 'components/form/FormFieldDonation.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorFormFieldDonation = 'form-field-donation';
const selectorFormFieldDonationCheckbox = 'form-field-donation-checkbox';
const selectorformFieldDonationSlider = 'form-field-donation-slider';

describe('<FormFieldDonation>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelVoucherEntryFeeDonation'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldDonation, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldDonation, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormFieldDonation)
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelVoucherEntryFeeDonation'));
    // checkbox
    cy.dataCy(selectorFormFieldDonationCheckbox).should('be.visible');
    // slider (show/hide)
    cy.dataCy(selectorformFieldDonationSlider).should('not.exist');
    cy.dataCy(selectorFormFieldDonationCheckbox).click();
    cy.dataCy(selectorformFieldDonationSlider).should('be.visible');
    cy.dataCy(selectorFormFieldDonationCheckbox).click();
    cy.dataCy(selectorformFieldDonationSlider).should('not.exist');
  });
}
