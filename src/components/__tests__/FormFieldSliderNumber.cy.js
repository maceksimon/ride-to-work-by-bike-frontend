import { colors } from 'quasar';
import FormFieldTestWrapper from '../global/FormFieldTestWrapper.vue';
import FormFieldSliderNumber from 'components/form/FormFieldSliderNumber.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldSliderNumber>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['currencyUnitCzk'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldSliderNumber, {
        props: {
          modelValue: 500,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldSliderNumber, {
        props: {
          modelValue: 500,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  context('dynamic', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldSliderNumber',
          defaultValue: 500,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('form-field-slider-number').should('be.visible');
    // input
    cy.dataCy('form-field-slider-number-input')
      .should('be.visible')
      .and('have.value', '500');
    cy.dataCy('form-field-slider-number-unit')
      .should('be.visible')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('global.currencyUnitCzk'));
    // slider
    cy.dataCy('form-field-slider-number-slider').should('be.visible');
    cy.dataCy('form-field-slider-number-slider').matchImageSnapshot(
      `${Cypress.currentTest.titlePath}-slider-default`,
      {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
        timeout: 4000,
        customDiffConfig: { threshold: 0.4 },
        retries: 2,
      },
    );
  });

  it('reacts to user interaction', () => {
    cy.dataCy('form-field-slider-number-input').clear();
    cy.dataCy('form-field-slider-number-input').type('1000');
    cy.dataCy('form-field-slider-number-input').blur();
    cy.dataCy('form-field-slider-number-input').should('have.value', '1000');
    // slider
    cy.dataCy('form-field-slider-number-slider').should('be.visible');
    cy.dataCy('form-field-slider-number-slider').matchImageSnapshot(
      `${Cypress.currentTest.titlePath}-slider-input`,
      {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
        timeout: 4000,
        customDiffConfig: { threshold: 0.4 },
        retries: 2,
      },
    );
  });

  it('renders slider and input side by side', () => {
    cy.testElementsSideBySide(
      'form-field-slider-number-slider',
      'form-field-slider-number-input',
    );
  });
}
