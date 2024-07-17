import { colors } from 'quasar';
import RegisterChallengePayment from 'components/register/RegisterChallengePayment.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const defaultPaymentAmountMin = rideToWorkByBikeConfig.entryFeePaymentMin;

const { getPaletteColor, lighten } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');
const primaryLight = lighten(primary, 90);

const optionsPaymentSubject = [
  'labelPaymentSubjectIndividual',
  'labelPaymentSubjectVoucher',
  'labelPaymentSubjectCompany',
  'labelPaymentSubjectSchool',
];

describe('<RegisterChallengePayment>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelPaymentAmount',
        'labelPaymentSubject',
        'labelPaymentSubjectCompany',
        'labelPaymentSubjectIndividual',
        'labelPaymentSubjectSchool',
        'labelPaymentSubjectVoucher',
        'textPaymentMinimum',
        'textPaymentOrganizer',
      ],
      'register.challenge',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('registerPaymentVoucherFull').then((voucherFull) => {
        cy.fixture('registerPaymentVoucherHalf').then((voucherHalf) => {
          cy.wrap(voucherFull).as('voucherFull');
          cy.wrap(voucherHalf).as('voucherHalf');
          cy.mount(RegisterChallengePayment, {
            props: {},
          });
          cy.viewport('macbook-16');
        });
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('registerPaymentVoucherFull').then((voucherFull) => {
        cy.fixture('registerPaymentVoucherHalf').then((voucherHalf) => {
          cy.wrap(voucherFull).as('voucherFull');
          cy.wrap(voucherHalf).as('voucherHalf');
          cy.mount(RegisterChallengePayment, {
            props: {},
          });
          cy.viewport('iphone-6');
        });
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('register-challenge-payment').should('be.visible');
    // text
    cy.dataCy('text-payment-organizer')
      .should('be.visible')
      .then(($element) => {
        cy.stripHtmlTags(
          i18n.global.t('register.challenge.textPaymentOrganizer'),
        ).then((text) => {
          expect($element.text()).to.equal(text);
        });
      });
    // banner
    cy.dataCy('banner-payment-minimum')
      .should('be.visible')
      .and('have.color', primary)
      .and('have.backgroundColor', primaryLight)
      .and('have.css', 'padding', '16px')
      .then(($element) => {
        cy.stripHtmlTags(
          i18n.global.t('register.challenge.textPaymentMinimum'),
        ).then((text) => {
          expect($element.text()).to.equal(text);
        });
      });
    // input subject
    cy.dataCy('form-field-payment-subject-label')
      .should('be.visible')
      .and('have.color', grey10)
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and(
        'have.text',
        i18n.global.t('register.challenge.labelPaymentSubject'),
      );
    cy.dataCy('form-field-payment-subject').should('be.visible');
    cy.dataCy('form-field-payment-subject')
      .find('[role="radio"]')
      .should('be.visible')
      .and('have.length', 4)
      .each((element, index) => {
        cy.wrap(element).should(
          'contain',
          i18n.global.t(`register.challenge.${optionsPaymentSubject[index]}`),
        );
      });
    // input amount
    cy.dataCy('form-field-payment-amount-label')
      .should('be.visible')
      .and('have.color', grey10)
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.text', i18n.global.t('register.challenge.labelPaymentAmount'));
    cy.dataCy('form-field-payment-amount').should('be.visible');
    cy.dataCy('form-field-payment-amount')
      .find('[role="radio"]')
      .should('be.visible')
      .and('have.length', 4);
  });

  it('renders custom payment amount if selected', () => {
    // enable custom payment amount
    cy.dataCy('radio-option-custom').should('be.visible').click();
    cy.dataCy('form-field-payment-amount-custom').should('be.visible');
    // switch to fixed payment amount
    cy.dataCy('radio-option-500').should('be.visible').click();
    cy.dataCy('form-field-payment-amount-custom').should('not.exist');
    // switch to custom payment amount
    cy.dataCy('radio-option-custom').should('be.visible').click();
    // custom amount is set to last selected
    cy.dataCy('form-field-slider-number-input').should('have.value', '500');
  });

  it('allows to apply voucher (HALF)', () => {
    cy.get('@voucherHalf').then((voucher) => {
      cy.dataCy('radio-option-voucher').should('be.visible').click();
      cy.dataCy('form-field-voucher-input').type(voucher.code);
      cy.dataCy('form-field-voucher-submit').click();
      cy.dataCy('form-field-voucher-input')
        .find('input')
        .should('have.value', voucher.code);
      // new option with discount is available
      cy.dataCy(`radio-option-${voucher.amount}`).should('be.visible');
      cy.dataCy('radio-option-custom').click();
      // custom amount is set to discount value
      cy.dataCy('form-field-slider-number-input').should(
        'have.value',
        voucher.amount.toString(),
      );
      cy.dataCy(`radio-option-${voucher.amount}`).should('be.visible');
      // clear input
      cy.dataCy('form-field-voucher-input').clear();
      // invalid voucher is input
      cy.dataCy('form-field-voucher-input').type('ABCD');
      cy.dataCy('form-field-voucher-submit').click();
      cy.dataCy('form-field-voucher-input')
        .find('input')
        .should('have.value', 'ABCD');
      // new option with discount is available
      cy.dataCy(`radio-option-${defaultPaymentAmountMin}`).click();
      cy.dataCy('radio-option-custom').click();
      // custom amount is set to discount value
      cy.dataCy('form-field-slider-number-input').should(
        'have.value',
        defaultPaymentAmountMin.toString(),
      );
    });
  });
}
