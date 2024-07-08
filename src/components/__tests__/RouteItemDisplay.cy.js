import { colors } from 'quasar';

import RouteItemDisplay from 'components/routes/RouteItemDisplay.vue';
import { i18n } from '../../boot/i18n';
import { hexToRgb } from 'app/test/cypress/utils';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { useRoutes } from 'src/composables/useRoutes';
import {
  testLabelFromWork,
  testLabelToWork,
} from 'app/test/cypress/support/commonTests';

const { getPaletteColor } = colors;
const grey2 = getPaletteColor('grey-2');
const grey7 = getPaletteColor('grey-7');
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');
const secondary = getPaletteColor('secondary');
const { getTransportLabel } = useRoutes();

describe('<RouteItemDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelDirectionFromWork', 'labelDirectionToWork'],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['bike', 'car', 'walk', 'bus', 'none', 'unknown'],
      'routes.transport',
      i18n,
    );
  });

  context('to work - with distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.toWork;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelToWork();
  });

  context('from work - with distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.fromWork;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelFromWork();
  });

  context('to work - empty', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.toWork;
        route.transport = null;
        route.distance = null;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelToWork();
  });

  context('from work - empty', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.fromWork;
        route.transport = null;
        route.distance = null;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelFromWork();
  });

  context('from work - no distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.fromWork;
        // set distance to 0 for test purposes
        route.distance = 0;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelFromWork();
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy('route-item-display')
      .should('be.visible')
      .and(
        'have.css',
        'border',
        `1px solid ${hexToRgb(rideToWorkByBikeConfig.colorGray)}`,
      )
      .and(
        'have.css',
        'border-radius',
        rideToWorkByBikeConfig.borderRadiusCard,
      );
    // label direction styles
    cy.dataCy('label-direction')
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('have.css', 'font-weight', '700')
      .and('have.css', 'padding', '16px')
      .and('have.color', grey10);
    // icon direction
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 18);
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 18);
    // avatar transport
    cy.dataCy('avatar-transport').should('be.visible');
    cy.dataCy('avatar-transport').invoke('height').should('be.eq', 32);
    cy.dataCy('avatar-transport').invoke('width').should('be.eq', 32);
    // icon transport
    cy.dataCy('icon-transport')
      .should('be.visible')
      .and('have.css', 'font-size', '18px');
    cy.dataCy('icon-transport').invoke('height').should('be.eq', 18);
    cy.dataCy('icon-transport').invoke('width').should('be.eq', 18);
    // description transport styles
    cy.dataCy('description-transport')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
  });

  it('renders correct transport value', () => {
    cy.get('@route').then((route) => {
      // test styles if transport value is logged
      if (route.transport) {
        // transport value
        cy.dataCy('avatar-transport')
          .should('be.visible')
          .and('have.backgroundColor', secondary);
        // icon transport
        cy.dataCy('icon-transport')
          .should('be.visible')
          .and('have.color', primary);
      } else {
        // transport value empty
        cy.dataCy('avatar-transport')
          .should('be.visible')
          .and('have.backgroundColor', grey2);
        // icon transport question mark
        cy.dataCy('icon-transport')
          .should('be.visible')
          .and('have.color', grey7);
      }
      cy.dataCy('description-transport').then((description) => {
        cy.wrap(getTransportLabel(route.transport)).should(
          'eq',
          description.text(),
        );
      });
    });
  });

  it('renders two sections stacked', () => {
    cy.testElementPercentageWidth(cy.dataCy('section-direction'), 100);
    cy.testElementPercentageWidth(cy.dataCy('section-distance'), 100);
  });

  it('renders correct distance value', () => {
    cy.get('@route').then((route) => {
      if (route.distance) {
        // distance value including units
        cy.dataCy('label-distance')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', route.distance)
          .and('contain', i18n.global.t('global.routeLengthUnit'));
      } else {
        // distance value empty
        cy.dataCy('label-distance').should('not.exist');
      }
    });
  });

  it('renders icons correctly', () => {
    // icon direction
    cy.dataCy('label-direction-icon', { timeout: 4000 })
      .should('be.visible')
      .matchImageSnapshot(`${Cypress.currentTest.titlePath}-direction`, {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
        timeout: 4000,
        customDiffConfig: { threshold: 0.4 },
        retries: 2,
      });
    // icon transport
    cy.dataCy('icon-transport', { timeout: 4000 })
      .should('be.visible')
      .matchImageSnapshot(`${Cypress.currentTest.titlePath}-transport`, {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
        timeout: 4000,
        customDiffConfig: { threshold: 0.4 },
        retries: 2,
      });
  });
}
