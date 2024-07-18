import RoutesMap from 'components/routes/RoutesMap.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorRoutesMap = 'routes-map';
const selectorRoutesMapMap = 'routes-map-map';
const selectorToolbarTop = 'toolbar-top';
const selectorToolbarBottom = 'toolbar-bottom';
const selectorAddRouteButton = 'add-route-button';
const selectorSaveRouteButton = 'save-route-button';
const selectorRoutesList = 'routes-list';
const selectorRoutesListHeader = 'routes-list-header';
const selectorUndoButton = 'undo-button';
const selectorDeleteRouteButton = 'delete-route-button';
const selectorRouteItemLength = 'route-item-length';
const selectorRouteItemNameStart = 'route-item-name-start';
const selectorRouteItemNameFinish = 'route-item-name-finish';
const selectorRouteListItem = 'route-list-item';

const routePoint1 = [100, 100];
const routePoint2 = [300, 100];
const routePoint3 = [300, 200];
const routePoint4 = [600, 200];

describe('<RoutesMap>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['titleYourRoutes'], 'routes', i18n);
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
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorRoutesMap).should('be.visible');
    cy.dataCy(selectorRoutesMapMap).should('be.visible');
    cy.dataCy(selectorToolbarTop).should('be.visible');
    cy.dataCy(selectorToolbarBottom).should('be.visible');
    cy.dataCy(selectorRoutesList).should('be.visible');
    cy.dataCy(selectorRoutesListHeader)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.titleYourRoutes'));

    /**
     * Test drawing routes.
     * We are testing differently drawn routes with the same coordinates
     * and comparing the resulting length and names.
     */
    toggleDrawTool();
    drawFeature();
    saveRoute();
    // save parameters of route 0
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemLength}"]`)
      .should('be.visible')
      .then((element) => {
        const length = element.text().replace(/\D/g, '');
        cy.wrap(parseInt(length)).as('routeLength');
      });
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameStart}"]`)
      .should('be.visible')
      .then((element) => {
        cy.wrap(element.text()).as('startName');
      });
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameFinish}"]`)
      .should('be.visible')
      .then((element) => {
        cy.wrap(element.text()).as('finishName');
      });
    toggleDrawTool();
    drawFeature();
    toggleDeleteTool();
    deleteFeaturePoints();
    saveRoute();
    // has shorter route, since it is a straight line
    cy.dataCy(`${selectorRouteListItem}-1`)
      .find(`[data-cy="${selectorRouteItemLength}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@routeLength').then((routeLength) => {
          const length = element.text().replace(/\D/g, '');
          cy.wrap(parseInt(length)).should('be.lessThan', routeLength);
          cy.wrap(parseInt(length)).as('shorterRouteLength');
        });
      });
    // new route matches old routes' start and finish name
    cy.dataCy(`${selectorRouteListItem}-1`)
      .find(`[data-cy="${selectorRouteItemNameStart}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@startName').then((startName) => {
          cy.wrap(element.text()).should('equal', startName);
        });
      });
    cy.dataCy(`${selectorRouteListItem}-1`)
      .find(`[data-cy="${selectorRouteItemNameFinish}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@finishName').then((finishName) => {
          cy.wrap(element.text()).should('equal', finishName);
        });
      });
    toggleDrawTool();
    drawFeature();
    toggleDeleteTool();
    deleteFeaturePoints();
    undo();
    undo();
    saveRoute();
    cy.dataCy(`${selectorRouteListItem}-2`)
      .find(`[data-cy="${selectorRouteItemLength}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@routeLength').then((routeLength) => {
          const length = element.text().replace(/\D/g, '');
          cy.wrap(parseInt(length)).should('be.equal', routeLength);
        });
      });
    // new route matches old routes' start and finish name
    cy.dataCy(`${selectorRouteListItem}-2`)
      .find(`[data-cy="${selectorRouteItemNameStart}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@startName').then((startName) => {
          cy.wrap(element.text()).should('equal', startName);
        });
      });
    cy.dataCy(`${selectorRouteListItem}-2`)
      .find(`[data-cy="${selectorRouteItemNameFinish}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@finishName').then((finishName) => {
          cy.wrap(element.text()).should('equal', finishName);
        });
      });
    toggleDrawTool();
    drawFeature();
    // overwrite route with a different shorter route
    cy.dataCy(selectorRoutesMapMap).click(routePoint2[0], routePoint2[1]);
    cy.dataCy(selectorRoutesMapMap).dblclick(routePoint3[0], routePoint3[1]);
    saveRoute();
    // has shorter route, since it is a straight line
    cy.dataCy(`${selectorRouteListItem}-3`)
      .find(`[data-cy="${selectorRouteItemLength}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@shorterRouteLength').then((routeLength) => {
          const length = element.text().replace(/\D/g, '');
          // length is shorter because it is only the middle part of the line
          cy.wrap(parseInt(length)).should('be.lessThan', routeLength);
        });
      });
    // new route does not match old routes' start and finish name
    cy.dataCy(`${selectorRouteListItem}-3`)
      .find(`[data-cy="${selectorRouteItemNameStart}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@startName').then((startName) => {
          cy.wrap(element.text()).should('not.equal', startName);
        });
      });
    cy.dataCy(`${selectorRouteListItem}-3`)
      .find(`[data-cy="${selectorRouteItemNameFinish}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@finishName').then((finishName) => {
          cy.wrap(element.text()).should('not.equal', finishName);
        });
      });
  });
}

function toggleDeleteTool() {
  cy.dataCy(selectorDeleteRouteButton).click();
}

function toggleDrawTool() {
  cy.dataCy(selectorAddRouteButton).click();
}

function drawFeature() {
  cy.dataCy(selectorRoutesMapMap).click(routePoint1[0], routePoint1[1]);
  cy.dataCy(selectorRoutesMapMap).click(routePoint2[0], routePoint2[1]);
  cy.dataCy(selectorRoutesMapMap).click(routePoint3[0], routePoint3[1]);
  cy.dataCy(selectorRoutesMapMap).dblclick(routePoint4[0], routePoint4[1]);
}

function deleteFeaturePoints() {
  cy.dataCy(selectorRoutesMapMap).click(routePoint2[0], routePoint2[1]);
  cy.dataCy(selectorRoutesMapMap).click(routePoint3[0], routePoint3[1]);
}

function saveRoute() {
  cy.dataCy(selectorSaveRouteButton).click();
}

function undo() {
  cy.dataCy(selectorUndoButton).click();
}
