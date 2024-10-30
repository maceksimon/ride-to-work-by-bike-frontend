import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import LoginRegisterMobileMenu from 'components/global/LoginRegisterMobileMenu.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

// selectors
const selectorMobileMenu = 'login-register-mobile-menu';
const selectorMenuButton = 'mobile-menu-button';
const selectorMenuDropdown = 'mobile-menu-dropdown';
const selectorMenuHelp = 'mobile-menu-help';
const selectorDialogHelp = 'dialog-help';
const selectorMenuLanguageHeader = 'mobile-menu-language-header';
const selectorMenuLanguageSwitcher = 'mobile-menu-language-switcher';
const selectorMenuUserInfo = 'mobile-menu-user-info';

describe('<LoginRegisterMobileMenu>', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelHelp', 'labelLanguage', 'labelLoggedInAs', 'labelLogOut'],
      'loginRegisterMobileMenu',
      i18n,
    );
  });

  context('logged out', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterMobileMenu, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders component', () => {
      cy.dataCy(selectorMobileMenu).should('be.visible');
    });

    it('renders menu button with correct styling', () => {
      cy.dataCy(selectorMenuButton)
        .should('be.visible')
        .and('have.backgroundColor', white)
        .and('have.color', primary);
    });

    it('shows menu with correct items when clicked', () => {
      // menu initially hidden
      cy.dataCy(selectorMenuDropdown).should('not.exist');
      cy.dataCy(selectorMenuUserInfo).should('not.exist');
      // click menu button
      cy.dataCy(selectorMenuButton).click();
      // menu dropdown
      cy.dataCy(selectorMenuDropdown).should('be.visible');
      // help button
      cy.dataCy(selectorMenuHelp).should('be.visible');
      // language header
      cy.dataCy(selectorMenuLanguageHeader)
        .should('be.visible')
        .and('contain', i18n.global.t('loginRegisterMobileMenu.labelLanguage'));
      // language switcher
      cy.dataCy(selectorMenuLanguageSwitcher).should('be.visible');
    });

    it('renders help button', () => {
      // open menu
      cy.dataCy(selectorMenuButton).click();
      // help button
      cy.dataCy(selectorMenuHelp)
        .should('be.visible')
        .and('contain', i18n.global.t('loginRegisterMobileMenu.labelHelp'));
      // click help button
      cy.dataCy(selectorMenuHelp).click();
      // help dialog
      cy.dataCy(selectorDialogHelp).should('be.visible');
    });

    it('renders language switcher', () => {
      // open menu
      cy.dataCy(selectorMenuButton).click();
      // language switcher
      cy.dataCy(selectorMenuLanguageSwitcher)
        .should('be.visible')
        .find('[data-cy="language-switcher"]')
        .should('exist');
    });
  });
});
