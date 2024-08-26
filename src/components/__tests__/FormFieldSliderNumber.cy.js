import { colors } from 'quasar';
import FormFieldTestWrapper from '../global/FormFieldTestWrapper.vue';
import FormFieldSliderNumber from 'components/form/FormFieldSliderNumber.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorFormFieldSliderNumber = 'form-field-slider-number';
const selectorFormFieldSliderNumberInput = 'form-field-slider-number-input';
const selectorFormFieldSliderNumberUnit = 'form-field-slider-number-unit';
const selectorFormFieldSliderNumberSlider = 'form-field-slider-number-slider';

// variables
const defaultValue = 500;

describe('<FormFieldSliderNumber>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['currencyUnitCzk'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldSliderNumber, {
        props: {
          modelValue: defaultValue,
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
          modelValue: defaultValue,
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
          defaultValue: defaultValue,
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
    cy.dataCy(selectorFormFieldSliderNumber).should('be.visible');
    // input
    cy.dataCy(selectorFormFieldSliderNumberInput)
      .should('be.visible')
      .and('have.value', '500');
    cy.dataCy(selectorFormFieldSliderNumberUnit)
      .should('be.visible')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('global.currencyUnitCzk'));
    // slider
    cy.dataCy(selectorFormFieldSliderNumberSlider).should('be.visible');
    cy.matchImageSnapshotNamed(
      selectorFormFieldSliderNumberSlider,
      `${Cypress.currentTest.titlePath}-slider-default`,
    );
    cy.dataCy(selectorFormFieldSliderNumberSlider).matchImageSnapshot(
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
    cy.dataCy(selectorFormFieldSliderNumberInput).clear();
    cy.dataCy(selectorFormFieldSliderNumberInput).type('1000');
    cy.dataCy(selectorFormFieldSliderNumberInput).blur();
    cy.dataCy(selectorFormFieldSliderNumberInput).should('have.value', '1000');
    // slider
    cy.dataCy(selectorFormFieldSliderNumberSlider).should('be.visible');
    cy.dataCy(selectorFormFieldSliderNumberSlider).matchImageSnapshot(
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
      selectorFormFieldSliderNumberSlider,
      selectorFormFieldSliderNumberInput,
    );
  });
}
