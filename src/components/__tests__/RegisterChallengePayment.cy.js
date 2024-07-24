import { colors } from 'quasar';
import RegisterChallengePayment from 'components/register/RegisterChallengePayment.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// selectors
const selectorDonation = 'form-field-donation';
const selectorDonationCheckbox = 'form-field-donation-checkbox';
const selectorRegisterChallengePayment = 'register-challenge-payment';
const selectorTextPaymentOrganizer = 'text-payment-organizer';
const selectorBannerPaymentMinimum = 'banner-payment-minimum';
const selectorPaymentAmount = 'form-field-payment-amount';
const selectorPaymentAmountCustom = 'form-field-payment-amount-custom';
const selectorPaymentAmountLabel = 'form-field-payment-amount-label';
const selectorPaymentSubject = 'form-field-payment-subject';
const selectorPaymentSubjectLabel = 'form-field-payment-subject-label';
const selectorRadioOptionCustom = 'radio-option-custom';
const selectorSliderNumberInput = 'form-field-slider-number-input';
const selectorVoucherInput = 'form-field-voucher-input';
const selectorVoucherSubmit = 'form-field-voucher-submit';
const selectorRadioOptionVoucher = 'radio-option-voucher';
const selectorVoucherButtonRemove = 'voucher-button-remove';
const selectorSliderNumberSlider = 'form-field-slider-number-slider';

// variables
const defaultPaymentAmountMin = rideToWorkByBikeConfig.entryFeePaymentMin;
const defaultPaymentAmountMax = rideToWorkByBikeConfig.entryFeePaymentMax;
const borderRadiusCardSmall = rideToWorkByBikeConfig.borderRadiusCardSmall;
const sliderClickTolerance = 10;
const testNumberValue = 500;

// colors
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
    cy.dataCy(selectorRegisterChallengePayment).should('be.visible');
    // text
    cy.dataCy(selectorTextPaymentOrganizer)
      .should('be.visible')
      .then(($element) => {
        cy.stripHtmlTags(
          i18n.global.t('register.challenge.textPaymentOrganizer'),
        ).then((text) => {
          expect($element.text()).to.equal(text);
        });
      });
    // banner
    cy.dataCy(selectorBannerPaymentMinimum)
      .should('be.visible')
      .and('have.color', primary)
      .and('have.backgroundColor', primaryLight)
      .and('have.css', 'padding', '16px')
      .and('have.css', 'border-radius', borderRadiusCardSmall)
      .then(($element) => {
        cy.stripHtmlTags(
          i18n.global.t('register.challenge.textPaymentMinimum'),
        ).then((text) => {
          expect($element.text()).to.equal(text);
        });
      });
    // input subject
    cy.dataCy(selectorPaymentSubjectLabel)
      .should('be.visible')
      .and('have.color', grey10)
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and(
        'have.text',
        i18n.global.t('register.challenge.labelPaymentSubject'),
      );
    cy.dataCy(selectorPaymentSubject).should('be.visible');
    cy.dataCy(selectorPaymentSubject)
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
    cy.dataCy(selectorPaymentAmountLabel)
      .should('be.visible')
      .and('have.color', grey10)
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.text', i18n.global.t('register.challenge.labelPaymentAmount'));
    cy.dataCy(selectorPaymentAmount).should('be.visible');
    cy.dataCy(selectorPaymentAmount)
      .find('[role="radio"]')
      .should('be.visible')
      .and('have.length', 4);
  });

  it('renders custom payment amount if selected', () => {
    // enable custom payment amount
    cy.dataCy(selectorRadioOptionCustom).should('be.visible').click();
    cy.dataCy(selectorPaymentAmountCustom).should('be.visible');
    // switch to fixed payment amount
    cy.dataCy(getRadioOption(testNumberValue)).should('be.visible').click();
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // switch to custom payment amount
    cy.dataCy(selectorRadioOptionCustom).should('be.visible').click();
    // custom amount is set to last selected
    cy.dataCy(selectorSliderNumberInput).should('have.value', testNumberValue.toString());
  });

  it('allows to apply voucher (HALF)', () => {
    cy.get('@voucherHalf').then((voucher) => {
      // option default amount is active
      cy.dataCy(getRadioOption(defaultPaymentAmountMin))
        .should('be.visible')
        .click();
      // option voucher payment is active
      cy.dataCy(selectorRadioOptionVoucher).should('be.visible').click();
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option with discounted amount is available
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // custom amount is set to discount value
      cy.dataCy(selectorRadioOptionCustom).click();
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // clear input
      cy.dataCy(selectorVoucherButtonRemove).click();
      // invalid voucher is input
      cy.dataCy(selectorVoucherInput).should('be.visible');
    });
  });

  it('does not allow to apply invalid voucher', () => {
    // option default amount is active
    cy.dataCy(getRadioOption(defaultPaymentAmountMin))
      .should('be.visible')
      .click();
    // option voucher payment is active
    cy.dataCy(selectorRadioOptionVoucher).should('be.visible').click();
    cy.dataCy(selectorVoucherInput).type('ABCD');
    cy.dataCy(selectorVoucherSubmit).click();
    cy.dataCy(selectorVoucherInput)
      .find('input')
      .should('have.value', 'ABCD');
    // option with default amount is available
    cy.dataCy(getRadioOption(defaultPaymentAmountMin)).click();
    cy.dataCy(selectorRadioOptionCustom).click();
    // custom amount is set to default value
    cy.dataCy(selectorSliderNumberInput).should(
      'have.value',
      defaultPaymentAmountMin.toString(),
    );
  });

  it('allows to apply voucher (FULL)', () => {
    cy.get('@voucherFull').then((voucher) => {
      // option default amount is active
      cy.dataCy(getRadioOption(defaultPaymentAmountMin))
        .should('be.visible')
        .click();
      // option voucher payment is active
      cy.dataCy(selectorRadioOptionVoucher).should('be.visible').click();
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option amount hidden
      cy.dataCy(selectorPaymentAmount).should('not.exist');
      // custom amount hidden
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // clear input
      cy.dataCy(selectorDonation).should('be.visible');

      /**
       * If voucher FULL is applied, user still has option to add donation
       */
      cy.dataCy(selectorDonationCheckbox).click();
      cy.dataCy(selectorSliderNumberInput)
        .should('be.visible')
        .and('have.value', defaultPaymentAmountMin.toString());
      // click in the middle of slider
      cy.dataCy(selectorSliderNumberSlider)
        .should('be.visible')
        .click();
      cy.dataCy(selectorSliderNumberInput)
        .invoke('val').then(value => {
          const intValue = parseInt(value);
          const midValue = parseInt(Math.round((parseInt(defaultPaymentAmountMax) + parseInt(defaultPaymentAmountMin)) / 2))
          // clicking on the slider is not entirely precise - we define tolerance
          expect(Math.abs(intValue - midValue)).to.be.lessThan(sliderClickTolerance);
        })
    });
  });
}

function getRadioOption(value) {
  return `radio-option-${value}`;
}
