import RoutesMapToolbar from 'components/routes/RoutesMapToolbar.vue';
import { i18n } from '../../boot/i18n';

describe('<RoutesMapToolbar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('draw disabled', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          drawEnabled: false,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('draw enabled', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          drawEnabled: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    drawEnabledTests();
  });

  context('draw enabled + delete enabled', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          drawEnabled: true,
          deleteEnabled: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    drawEnabledTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('toolbar-top').should('be.visible');
    cy.dataCy('toolbar-bottom').should('be.visible');
  });

  it('renders draw button', () => {
    cy.dataCy('add-route-button')
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy('add-route-avatar').should('be.visible');
    cy.dataCy('add-route-avatar').invoke('height').should('be.equal', 32);
    cy.dataCy('add-route-avatar').invoke('width').should('be.equal', 32);
    cy.dataCy('add-route-icon').invoke('height').should('be.equal', 18);
    cy.dataCy('add-route-icon').invoke('width').should('be.equal', 18);
  });

  it('renders current location button', () => {
    cy.dataCy('current-position-button')
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy('current-position-avatar').should('be.visible');
    cy.dataCy('current-position-avatar')
      .invoke('height')
      .should('be.equal', 32);
    cy.dataCy('current-position-avatar').invoke('width').should('be.equal', 32);
    cy.dataCy('current-position-icon').invoke('height').should('be.equal', 18);
    cy.dataCy('current-position-icon').invoke('width').should('be.equal', 18);
  });
}

function drawEnabledTests() {
  it('renders delete button', () => {
    cy.dataCy('delete-route-button')
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy('delete-route-avatar').should('be.visible');
    cy.dataCy('delete-route-avatar').invoke('height').should('be.equal', 32);
    cy.dataCy('delete-route-avatar').invoke('width').should('be.equal', 32);
    cy.dataCy('delete-route-icon').invoke('height').should('be.equal', 18);
    cy.dataCy('delete-route-icon').invoke('width').should('be.equal', 18);
  });

  it('renders undo button', () => {
    cy.dataCy('undo-button')
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy('undo-avatar').should('be.visible');
    cy.dataCy('undo-avatar').invoke('height').should('be.equal', 32);
    cy.dataCy('undo-avatar').invoke('width').should('be.equal', 32);
    cy.dataCy('undo-icon').invoke('height').should('be.equal', 18);
    cy.dataCy('undo-icon').invoke('width').should('be.equal', 18);
  });

  it('renders save route button', () => {
    cy.dataCy('save-route-button')
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy('save-route-avatar').should('be.visible');
    cy.dataCy('save-route-avatar').invoke('height').should('be.equal', 32);
    cy.dataCy('save-route-avatar').invoke('width').should('be.equal', 32);
    cy.dataCy('save-route-icon').invoke('height').should('be.equal', 18);
    cy.dataCy('save-route-icon').invoke('width').should('be.equal', 18);
  });
}
