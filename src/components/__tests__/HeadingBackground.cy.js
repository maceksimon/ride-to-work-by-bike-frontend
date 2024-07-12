import { colors } from 'quasar';
import { i18n } from '../../boot/i18n';

import HeadingBackground from '../homepage/HeadingBackground.vue';

const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');

describe('<HeadingBackground>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['highlightCommunity', 'imageAltText', 'titleCommunity'],
      'index.headingBackground',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(HeadingBackground, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders sections side-by-side', () => {
      cy.dataCy('section-text').then((element) => {
        const offsetTop = element[0].offsetTop;
        const offsetHeight = element[0].offsetHeight;
        cy.dataCy('section-image').then((sibling) => {
          const siblingOffsetTop = sibling[0].offsetTop;
          const siblingOffsetHeight = sibling[0].offsetHeight;
          expect(Math.round(offsetTop + offsetHeight / 2)).to.be.equal(
            Math.round(siblingOffsetTop + siblingOffsetHeight / 2),
          );
        });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(HeadingBackground, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders sections stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy('section-text'), 100);
      cy.testElementPercentageWidth(cy.dataCy('section-image'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('heading-background').should('be.visible');
    // highlight
    cy.dataCy('heading-background-highlight')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', primary)
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(
          i18n.global.t('index.headingBackground.highlightCommunity'),
        ).then((text) => {
          expect(textContent).to.equal(text);
        });
      });
    // title
    cy.dataCy('heading-background-title')
      .should('be.visible')
      .and('have.css', 'font-size', '40px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', primary)
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(
          i18n.global.t('index.headingBackground.titleCommunity'),
        ).then((text) => {
          expect(textContent).to.equal(text);
        });
      });
    // image
    cy.dataCy('heading-background-image')
      .should('be.visible')
      .find('img')
      .invoke('attr', 'alt')
      .should('eq', i18n.global.t('index.headingBackground.imageAltText'));
    // image snapshot
    cy.dataCy('heading-background-image').then((element) => {
      cy.wrap(element).matchImageSnapshot({
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
        timeout: 5000,
        customDiffConfig: { threshold: 0.5 },
        screenshotsFolder: 'test/cypress/snapshots',
        retries: 2,
        name: `heading-background-image-${Cypress.currentTest.titlePath[0]}`,
      });
    });
  });
}
