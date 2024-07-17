import RoutesMapToolbar from 'components/routes/RoutesMapToolbar.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorAddRouteAvatar = 'add-route-avatar';
const selectorAddRouteButton = 'add-route-button';
const selectorAddRouteIcon = 'add-route-icon';
const selectorCurrentPositionAvatar = 'current-position-avatar';
const selectorCurrentPositionButton = 'current-position-button';
const selectorCurrentPositionIcon = 'current-position-icon';
const selectorDeleteRouteAvatar = 'delete-route-avatar';
const selectorDeleteRouteButton = 'delete-route-button';
const selectorDeleteRouteIcon = 'delete-route-icon';
const selectorUndoButton = 'undo-button';
const selectorUndoAvatar = 'undo-avatar';
const selectorUndoIcon = 'undo-icon';
const selectorSaveRouteAvatar = 'save-route-avatar';
const selectorSaveRouteButton = 'save-route-button';
const selectorSaveRouteIcon = 'save-route-icon';
const selectorToolbarTop = 'toolbar-top';
const selectorToolbarBottom = 'toolbar-bottom';

// variables
const avatarSize = 32;
const iconSize = 18;

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
    cy.dataCy(selectorToolbarTop).should('be.visible');
    cy.dataCy(selectorToolbarBottom).should('be.visible');
  });

  it('renders draw button', () => {
    cy.dataCy(selectorAddRouteButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorAddRouteAvatar).should('be.visible');
    cy.dataCy(selectorAddRouteAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorAddRouteAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorAddRouteIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorAddRouteIcon)
      .invoke('width')
      .should('be.equal', iconSize);
  });

  it('renders current location button', () => {
    cy.dataCy(selectorCurrentPositionButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorCurrentPositionAvatar).should('be.visible');
    cy.dataCy(selectorCurrentPositionAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorCurrentPositionAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorCurrentPositionIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorCurrentPositionIcon)
      .invoke('width')
      .should('be.equal', iconSize);
  });
}

function drawEnabledTests() {
  it('renders delete button', () => {
    cy.dataCy(selectorDeleteRouteButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorDeleteRouteAvatar).should('be.visible');
    cy.dataCy(selectorDeleteRouteAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorDeleteRouteAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorDeleteRouteIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorDeleteRouteIcon)
      .invoke('width')
      .should('be.equal', iconSize);
  });

  it('renders undo button', () => {
    cy.dataCy(selectorUndoButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorUndoAvatar).should('be.visible');
    cy.dataCy(selectorUndoAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorUndoAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorUndoIcon).invoke('height').should('be.equal', iconSize);
    cy.dataCy(selectorUndoIcon).invoke('width').should('be.equal', iconSize);
  });

  it('renders save route button', () => {
    cy.dataCy(selectorSaveRouteButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorSaveRouteAvatar).should('be.visible');
    cy.dataCy(selectorSaveRouteAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorSaveRouteAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorSaveRouteIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorSaveRouteIcon)
      .invoke('width')
      .should('be.equal', iconSize);
  });
}
