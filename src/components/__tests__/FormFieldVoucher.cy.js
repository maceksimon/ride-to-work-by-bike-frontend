import { setActivePinia, createPinia } from 'pinia';
import { colors } from 'quasar';
import FormFieldVoucher from 'components/form/FormFieldVoucher.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { couponAdapter } from '../../adapters/couponAdapter';
import { useFormatPrice, Currency } from 'src/composables/useFormatPrice';

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
const codeInvalid = 'ABCD';
const amount = 390;
const amountAlt = 1000;
const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
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
        props: {
          amount,
        },
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
        // create spy for the emit
        const onUpdateSpyAdd = cy.spy().as('onUpdateSpyAdd');
        const onUpdateSpyRemove = cy.spy().as('onUpdateSpyRemove');
        cy.mount(FormFieldVoucher, {
          props: {
            amount,
            'onUpdate:voucher': onUpdateSpyAdd,
            'onRemove:voucher': onUpdateSpyRemove,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('allows to use and then remove coupon FULL (+ correct emits)', () => {
      cy.fixture('apiGetDiscountCouponResponseFull').then((apiResponse) => {
        const expectedEmit = couponAdapter.toValidatedCoupon(apiResponse);
        // submit voucher
        cy.dataCy(selecotrFormFieldVoucherInput).type(
          apiResponse.results[0].name,
        );
        cy.dataCy(selectorFormFieldVoucherSubmit).click();
        // wait for API response
        cy.waitForDiscountCouponApi();
        // verify emit
        cy.get('@onUpdateSpyAdd').should('have.been.calledWith', expectedEmit);
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
        // verify emit
        cy.get('@onUpdateSpyRemove').should('have.been.called');
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
        // create spy for the emit
        const onUpdateSpyAdd = cy.spy().as('onUpdateSpyAdd');
        const onUpdateSpyRemove = cy.spy().as('onUpdateSpyRemove');
        cy.mount(FormFieldVoucher, {
          props: {
            amount,
            'onUpdate:voucher': onUpdateSpyAdd,
            'onRemove:voucher': onUpdateSpyRemove,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('allows to use and then remove coupon HALF (+ correct emits)', () => {
      cy.fixture('apiGetDiscountCouponResponseHalf').then((apiResponse) => {
        const expectedEmit = couponAdapter.toValidatedCoupon(apiResponse);
        // submit voucher
        cy.dataCy(selecotrFormFieldVoucherInput).type(
          apiResponse.results[0].name,
        );
        cy.dataCy(selectorFormFieldVoucherSubmit).click();
        // wait for API response
        cy.waitForDiscountCouponApi(apiResponse);
        // verify emit
        cy.get('@onUpdateSpyAdd').should('have.been.calledWith', expectedEmit);
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
        // verify emit
        cy.get('@onUpdateSpyRemove').should('have.been.called');
      });
    });
  });

  context('desktop - active voucher HALF', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetDiscountCouponResponseHalf').then((response) => {
        const voucherHalf = couponAdapter.toValidatedCoupon(response);
        cy.mount(FormFieldVoucher, {
          props: {
            activeVoucher: voucherHalf,
            amount: amountAlt,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('apiGetDiscountCouponResponseHalf').then((response) => {
        const discountAmountInt = Math.round(
          (amountAlt * response.results[0].discount) / 100,
        );
        cy.dataCy(selectorVoucherBannerCode)
          .should('be.visible')
          .and('contain', response.results[0].name);
        cy.dataCy(selectorVoucherBannerName)
          .should('be.visible')
          .and('contain', i18n.global.t('global.discount'))
          .and('contain', response.results[0].discount)
          .and('contain', formatPriceCurrency(discountAmountInt, Currency.CZK));
      });
    });
  });

  context('desktop - active voucher FULL', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetDiscountCouponResponseFull').then((response) => {
        const voucherFull = couponAdapter.toValidatedCoupon(response);
        cy.mount(FormFieldVoucher, {
          props: {
            activeVoucher: voucherFull,
            amount,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('apiGetDiscountCouponResponseFull').then((response) => {
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
    // submit voucher
    cy.dataCy(selecotrFormFieldVoucherInput).type(codeInvalid);
    cy.dataCy(selectorFormFieldVoucherSubmit).click();
    // banner
    cy.dataCy(selectorVoucherBanner).should('not.exist');
    // user message
    cy.get(selectorQNotifyMessage)
      .should('be.visible')
      .and('contain', i18n.global.t('getDiscountCoupon.apiMessageError'));
    // widget
    cy.dataCy(selectorVoucherWidget).should('be.visible');
  });
}
