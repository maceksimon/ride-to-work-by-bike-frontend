import RoutesMap from 'components/routes/RoutesMap.vue';
import { i18n } from '../../boot/i18n';

describe('<RoutesMap>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RoutesMap, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RoutesMap, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('routes-map').should('be.visible');
    cy.dataCy('routes-map-map').should('be.visible');
    cy.dataCy('toolbar-top').should('be.visible');
    cy.dataCy('toolbar-bottom').should('be.visible');
  });
}
