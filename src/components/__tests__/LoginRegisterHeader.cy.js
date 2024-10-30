import { colors } from 'quasar';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

// selectors
const selectorButtonHelp = 'button-help';
const selectorIconHelp = 'icon-help';
const selectorLanguageSwitcher = 'language-switcher';
const selectorLogo = 'header-logo';
const selectorLoginRegisterMobileMenu = 'login-register-mobile-menu';

// variables
const helpButtonFontSize = '15px';
const helpButtonSize = 45;
const iconHelpSize = 38;
const logoHeightDesktop = 80;
const logoHeightMobile = 48;

describe('<LoginRegisterHeader>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['siteTitle'], 'header', i18n);
    cy.testLanguageStringsInContext(['logoAltText'], 'index', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterHeader, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders logo in desktop size', () => {
      cy.dataCy(selectorLogo)
        .should('be.visible')
        .invoke('height')
        .should('be.equal', logoHeightDesktop);
    });

    it('renders help button', () => {
      // button
      cy.dataCy(selectorButtonHelp)
        .should('be.visible')
        .and('have.css', 'font-size', helpButtonFontSize)
        .and('have.css', 'font-weight', '500')
        .and('have.backgroundColor', white)
        .and('have.css', 'border-radius', '50%');
      cy.dataCy(selectorButtonHelp)
        .invoke('height')
        .should('be.equal', helpButtonSize);
      cy.dataCy(selectorButtonHelp)
        .invoke('width')
        .should('be.equal', helpButtonSize);
      // icon
      cy.dataCy(selectorIconHelp).should('have.color', primary);
      cy.dataCy(selectorIconHelp)
        .invoke('height')
        .should('be.equal', iconHelpSize);
      cy.dataCy(selectorIconHelp)
        .invoke('width')
        .should('be.equal', iconHelpSize);
    });

    it('renders language switcher', () => {
      cy.dataCy(selectorLanguageSwitcher).should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterHeader, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders logo in mobile size', () => {
      cy.dataCy(selectorLogo)
        .should('be.visible')
        .invoke('height')
        .should('be.equal', logoHeightMobile);
    });

    it('renders login register mobile menu', () => {
      cy.dataCy(selectorLoginRegisterMobileMenu).should('be.visible');
    });
  });
});
