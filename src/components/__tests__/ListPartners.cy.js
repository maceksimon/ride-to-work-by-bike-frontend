import ListPartners from 'components/global/ListPartners.vue';
import { i18n } from '../../boot/i18n';

describe('<ListPartners>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ListPartners, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders correct grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('partners-local-item'), 8.3);
      cy.testElementPercentageWidth(cy.dataCy('partners-general-item'), 16.7);
      cy.testElementPercentageWidth(cy.dataCy('partners-national-item'), 16.7);
      cy.testElementPercentageWidth(cy.dataCy('partners-media-item'), 8.3);
      cy.testElementPercentageWidth(
        cy.dataCy('partners-organizers-item'),
        16.7,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ListPartners, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders correct grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('partners-local-item'), 25);
      cy.testElementPercentageWidth(cy.dataCy('partners-general-item'), 50);
      cy.testElementPercentageWidth(cy.dataCy('partners-national-item'), 50);
      cy.testElementPercentageWidth(cy.dataCy('partners-media-item'), 25);
      cy.testElementPercentageWidth(cy.dataCy('partners-organizers-item'), 50);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('list-partners').should('be.visible');
    // title
    cy.dataCy('list-partners-title')
      .should('be.visible')
      .and('contain', i18n.global.t('listPartners.titlePartners'));
    // local partners
    cy.dataCy('partners-local').should('be.visible');
    // general partners
    cy.dataCy('partners-general').should('be.visible');
    // national partners
    cy.dataCy('partners-national').should('be.visible');
    // media partners
    cy.dataCy('partners-media').should('be.visible');
    // organizers
    cy.dataCy('partners-organizers').should('be.visible');
  });
}
