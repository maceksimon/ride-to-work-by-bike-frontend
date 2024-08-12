import DetailsItem from 'components/profile/DetailsItem.vue';
import { i18n } from '../../boot/i18n';

const selectorDetailsItem = 'details-item';
const selectorDetailsItemDescription = 'details-item-description';
const selectorDetailsItemLabel = 'details-item-label';
const selectorDetailsItemValue = 'details-item-value';

describe('<DetailsItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['buttonEdit'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorDetailsItem).should('be.visible');
    cy.dataCy(selectorDetailsItemDescription).should('be.visible');
    cy.dataCy(selectorDetailsItemLabel).should('be.visible');
    cy.dataCy(selectorDetailsItemValue).should('be.visible');
  });
}
