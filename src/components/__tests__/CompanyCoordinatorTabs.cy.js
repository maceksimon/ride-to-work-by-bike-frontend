import CompanyCoordinatorTabs from 'components/coordinator/CompanyCoordinatorTabs.vue';
import { i18n } from '../../boot/i18n';

describe('<CompanyCoordinatorTabs>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CompanyCoordinatorTabs, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CompanyCoordinatorTabs, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('company-coordinator-tabs').should('be.visible');
  });
}
