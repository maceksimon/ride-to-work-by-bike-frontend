import { colors } from 'quasar';
import PageHeading from 'components/global/PageHeading.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorPageHeading = 'page-heading';
const selectorPageHeadingTitle = 'page-heading-title';
const selectorPageHeadingPerex = 'page-heading-perex';

// variables
const title = 'Page Title';
const perex = 'Page perex';
const titleFontSize = 34;
const titleFontWeight = 700;
const perexFontSize = 14;
const perexFontWeight = 400;
const perexMarginTop = 24;
const componentMarginBottom = 48;
const componentMarginTop = 24;
describe('<PageHeading>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(PageHeading, {
        props: {},
        slots: {
          default: title,
          perex: perex,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(PageHeading, {
        props: {},
        slots: {
          default: title,
          perex: perex,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorPageHeading).should('be.visible');
    cy.dataCy(selectorPageHeadingTitle)
      .should('be.visible')
      .and('contain', title)
      .and('have.css', 'font-size', `${titleFontSize}px`)
      .and('have.css', 'font-weight', `${titleFontWeight}`)
      .and('have.color', black)
      .and('contain', title)
      .and('have.css', 'margin-bottom', '0px')
      .and('have.css', 'margin-top', '0px');
    cy.dataCy(selectorPageHeadingPerex)
      .should('be.visible')
      .and('have.css', 'font-size', `${perexFontSize}px`)
      .and('have.css', 'font-weight', `${perexFontWeight}`)
      .and('have.color', grey10)
      .and('contain', perex)
      .and('have.css', 'margin-top', `${perexMarginTop}px`);
  });

  it('has correct margins', () => {
    cy.dataCy(selectorPageHeading).should(
      'have.css',
      'margin-bottom',
      `${componentMarginBottom}px`,
    );
    cy.dataCy(selectorPageHeading).should(
      'have.css',
      'margin-top',
      `${componentMarginTop}px`,
    );
  });
}
