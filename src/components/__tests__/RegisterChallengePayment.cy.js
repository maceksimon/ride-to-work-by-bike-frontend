import { colors } from 'quasar';
import RegisterChallengePayment from 'components/register/RegisterChallengePayment.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// selectors
const selectorBannerPaymentMinimum = 'banner-payment-minimum';
const selectorCompany = 'form-field-company';
const selectorCompanyLabel = 'form-field-company-label';
const selectorCompanyPaymentText = 'payment-company-text';
const selectorDonation = 'form-field-donation';
const selectorDonationCheckbox = 'form-field-donation-checkbox';
const selectorPaymentAmount = 'form-field-payment-amount';
const selectorPaymentAmountCustom = 'form-field-payment-amount-custom';
const selectorPaymentAmountLabel = 'form-field-payment-amount-label';
const selectorPaymentSubject = 'form-field-payment-subject';
const selectorPaymentSubjectLabel = 'form-field-payment-subject-label';
const selectorRegisterChallengePayment = 'register-challenge-payment';
const selectorSliderNumberInput = 'form-field-slider-number-input';
const selectorSliderNumberSlider = 'form-field-slider-number-slider';
const selectorTextPaymentOrganizer = 'text-payment-organizer';
const selectorVoucherButtonRemove = 'voucher-button-remove';
const selectorVoucherInput = 'form-field-voucher-input';
const selectorVoucherSubmit = 'form-field-voucher-submit';

// variables
const borderRadiusCardSmall = rideToWorkByBikeConfig.borderRadiusCardSmall;
const defaultPaymentAmountMin = rideToWorkByBikeConfig.entryFeePaymentMin;
const defaultPaymentAmountMax = rideToWorkByBikeConfig.entryFeePaymentMax;
const optionCustom = 'custom';
const optionVoucher = 'voucher';
const optionCompany = 'company';
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
        'labelCompanyOrSchool',
        'labelPaymentAmount',
        'labelPaymentSubject',
        'labelPaymentSubjectCompany',
        'labelPaymentSubjectIndividual',
        'labelPaymentSubjectSchool',
        'labelPaymentSubjectVoucher',
        'textCompany',
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
    cy.dataCy(getRadioOption(optionCustom)).should('be.visible').click();
    cy.dataCy(selectorPaymentAmountCustom).should('be.visible');
    // switch to fixed payment amount
    cy.dataCy(getRadioOption(testNumberValue)).should('be.visible').click();
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // switch to custom payment amount
    cy.dataCy(getRadioOption(optionCustom)).should('be.visible').click();
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
      cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option with discounted amount is available
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // custom amount is set to discount value
      cy.dataCy(getRadioOption(optionCustom)).click();
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
    cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
    cy.dataCy(selectorVoucherInput).type('ABCD');
    cy.dataCy(selectorVoucherSubmit).click();
    cy.dataCy(selectorVoucherInput)
      .find('input')
      .should('have.value', 'ABCD');
    // option with default amount is available
    cy.dataCy(getRadioOption(defaultPaymentAmountMin)).click();
    cy.dataCy(getRadioOption(optionCustom)).click();
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
      cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option amount hidden
      cy.dataCy(selectorPaymentAmount).should('not.exist');
      // custom amount hidden
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // clear input
      cy.dataCy(selectorDonation).should('be.visible');

      // if voucher FULL is applied, user still has option to add donation
      testDonation();
    });
  });

  it.only('renders company select if company option is chosen', () => {
    cy.dataCy(selectorCompany).should('not.exist');
    cy.dataCy(getRadioOption(optionCompany)).should('be.visible').click();
    cy.dataCy(selectorCompany).should('be.visible');
    cy.dataCy(selectorCompanyLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('register.challenge.labelCompanyOrSchool'));
    // info text
    cy.dataCy(selectorCompanyPaymentText)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('register.challenge.textCompany'));

    // if company is paying the fee, user still has option to add donation
    testDonation();
  });
}

function getRadioOption(value) {
  return `radio-option-${value}`;
}

function testDonation() {
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
}
