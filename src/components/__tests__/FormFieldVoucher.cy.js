import { setActivePinia, createPinia } from 'pinia';
import { colors } from 'quasar';
import FormFieldVoucher from 'components/form/FormFieldVoucher.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { couponAdapter } from '../../adapters/couponAdapter';
import { useFormatPrice, Currency } from 'src/composables/useFormatPrice';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// colors
const { getPaletteColor } = colors;
const grey2 = getPaletteColor('grey-2');

// selectors
const selectorFormFieldVoucher = 'form-field-voucher';
const selecotrFormFieldVoucherInput = 'form-field-voucher-input';
const selectorFormFieldVoucherSubmit = 'form-field-voucher-submit';
const selectorQNotifyMessage = '.q-notification__message';
const selectorVoucherBanner = 'voucher-banner';
const selectorVoucherBannerCode = 'voucher-banner-code';
const selectorVoucherBannerName = 'voucher-banner-name';
const selectorVoucherButtonRemove = 'voucher-button-remove';
const selectorVoucherWidget = 'voucher-widget';

// variables
const defaultPaymentAmountMin = parseInt(
  rideToWorkByBikeConfig.entryFeePaymentMin,
);
const voucherCodeInvalid = 'INVALID';
const amount = defaultPaymentAmountMin;
const amountAlt = 1000;
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
const { formatPriceCurrency } = useFormatPrice();

describe('<FormFieldVoucher>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonVoucherSubmit', 'labelVoucher', 'textVoucher'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(['discount'], 'global', i18n);
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getDiscountCoupon',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.interceptDiscountCouponGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  context('desktop - apply voucher FULL', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetDiscountCouponResponseFull').then((apiResponse) => {
        cy.interceptDiscountCouponGetApi(
          rideToWorkByBikeConfig,
          i18n,
          apiResponse.results[0].name,
        );
        cy.mount(FormFieldVoucher, {
          props: {
            amount,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('allows to use and then remove coupon FULL', () => {
      cy.fixture('apiGetDiscountCouponResponseFull').then((apiResponse) => {
        // submit voucher
        cy.dataCy(selecotrFormFieldVoucherInput).type(
          apiResponse.results[0].name,
        );
        cy.dataCy(selectorFormFieldVoucherSubmit).click();
        // wait for API response
        cy.waitForDiscountCouponApi();
        // display banner
        cy.dataCy(selectorVoucherBanner)
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadius)
          .and('have.backgroundColor', grey2);
        // banner code should be visible
        cy.dataCy(selectorVoucherBannerCode)
          .should('be.visible')
          .and('contain', apiResponse.results[0].name);
        // banner label should be visible
        cy.dataCy(selectorVoucherBannerName)
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('register.challenge.labelVoucherFreeRegistration'),
          );
        // remove button should be visible (click it)
        cy.dataCy(selectorVoucherButtonRemove).should('be.visible').click();
        // after removing voucher, input is visible
        cy.dataCy(selecotrFormFieldVoucherInput).should('be.visible');
      });
    });
  });

  context('desktop - apply voucher HALF', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetDiscountCouponResponseHalf').then((apiResponse) => {
        cy.interceptDiscountCouponGetApi(
          rideToWorkByBikeConfig,
          i18n,
          apiResponse.results[0].name,
          apiResponse,
        );
        cy.mount(FormFieldVoucher, {
          props: {
            amount,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('allows to use and then remove coupon HALF', () => {
      cy.fixture('apiGetDiscountCouponResponseHalf').then((apiResponse) => {
        // submit voucher
        cy.dataCy(selecotrFormFieldVoucherInput).type(
          apiResponse.results[0].name,
        );
        cy.dataCy(selectorFormFieldVoucherSubmit).click();
        // wait for API response
        cy.waitForDiscountCouponApi(apiResponse);
        // display banner
        cy.dataCy(selectorVoucherBanner)
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadius)
          .and('have.backgroundColor', grey2);
        // banner code should be visible
        const discountAmountInt = Math.round(
          (amount * apiResponse.results[0].discount) / 100,
        );
        cy.dataCy(selectorVoucherBannerCode)
          .should('be.visible')
          .and('contain', apiResponse.results[0].name);
        // banner label should be visible
        cy.dataCy(selectorVoucherBannerName)
          .should('be.visible')
          .and('contain', i18n.global.t('global.discount'))
          .and('contain', apiResponse.results[0].discount)
          .and('contain', formatPriceCurrency(discountAmountInt, Currency.CZK));
        // remove button should be visible (click it)
        cy.dataCy(selectorVoucherButtonRemove).should('be.visible').click();
        // after removing voucher, input is visible
        cy.dataCy(selecotrFormFieldVoucherInput).should('be.visible');
      });
    });
  });

  context('desktop - active voucher HALF', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {
          amount: amountAlt,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('apiGetDiscountCouponResponseHalf').then((response) => {
        const voucherHalf = couponAdapter.toValidatedCoupon(response);
        cy.wrap(useRegisterChallengeStore()).then((storeRegisterChallenge) => {
          // set voucher from store
          storeRegisterChallenge.setVoucher(voucherHalf);
          // calculate displayed discount
          const discountAmountInt = Math.round(
            (defaultPaymentAmountMin * response.results[0].discount) / 100,
          );
          // display banner
          cy.dataCy(selectorVoucherBannerCode)
            .should('be.visible')
            .and('contain', response.results[0].name);
          cy.dataCy(selectorVoucherBannerName)
            .should('be.visible')
            .and('contain', i18n.global.t('global.discount'))
            .and('contain', response.results[0].discount)
            .and(
              'contain',
              formatPriceCurrency(discountAmountInt, Currency.CZK),
            );
        });
      });
    });
  });

  context('desktop - active voucher FULL', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {
          amount,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('apiGetDiscountCouponResponseFull').then((response) => {
        const voucherFull = couponAdapter.toValidatedCoupon(response);
        cy.wrap(useRegisterChallengeStore()).then((storeRegisterChallenge) => {
          // set voucher from store
          storeRegisterChallenge.setVoucher(voucherFull);
          // display banner
          cy.dataCy(selectorVoucherBannerCode)
            .should('be.visible')
            .and('contain', response.results[0].name);
          cy.dataCy(selectorVoucherBannerName)
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('register.challenge.labelVoucherFreeRegistration'),
            );
        });
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormFieldVoucher).should('be.visible');
    // widget
    cy.dataCy(selectorVoucherWidget).should('be.visible');
    // input
    cy.dataCy(selecotrFormFieldVoucherInput).should('be.visible');
    // button
    cy.dataCy(selectorFormFieldVoucherSubmit)
      .should('be.visible')
      .and('contain', i18n.global.t('form.buttonVoucherSubmit'));
  });

  it('does not allow to submit invalid voucher', () => {
    cy.fixture('apiGetDiscountCouponResponseEmpty').then((responseEmpty) => {
      // intercept coupon INVALID
      cy.interceptDiscountCouponGetApi(
        rideToWorkByBikeConfig,
        i18n,
        voucherCodeInvalid,
        responseEmpty,
      );
      // submit voucher
      cy.dataCy(selecotrFormFieldVoucherInput).type(voucherCodeInvalid);
      cy.dataCy(selectorFormFieldVoucherSubmit).click();
      // banner
      cy.dataCy(selectorVoucherBanner).should('not.exist');
      // user message
      cy.get(selectorQNotifyMessage)
        .should('be.visible')
        .and('contain', i18n.global.t('notify.voucherApplyError'));
      // widget
      cy.dataCy(selectorVoucherWidget).should('be.visible');
    });
  });
}
