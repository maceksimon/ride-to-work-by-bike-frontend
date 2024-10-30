import LoginRegisterMobileMenu from 'components/global/LoginRegisterMobileMenu.vue';
import { i18n } from '../../boot/i18n';

describe('<LoginRegisterMobileMenu>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('default', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterMobileMenu, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('component').should('be.visible');
  });
}
