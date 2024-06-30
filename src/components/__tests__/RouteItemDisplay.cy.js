import { colors } from 'quasar';

import RouteItemDisplay from 'components/routes/RouteItemDisplay.vue';
import { i18n } from '../../boot/i18n';
import { hexToRgb } from 'app/test/cypress/utils';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');
const secondary = getPaletteColor('secondary');

describe('<RouteItemDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelDirectionFromWork', 'labelDirectionToWork'],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['bike', 'car', 'walk', 'bus', 'none'],
      'routes.transport',
      i18n,
    );
  });

  context('to work - with distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.wrap(routes.toWork).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: routes.toWork,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    toWorkTests();

    distanceTests();
  });

  context('from work - no distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.wrap(routes.fromWork).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: routes.fromWork,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    fromWorkTests();

    it('does not render distance', () => {
      // distance value empty
      cy.dataCy('label-distance').should('not.exist');
    });
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
    cy.dataCy('avatar-transport')
      .should('be.visible')
      .and('have.backgroundColor', secondary);
    cy.dataCy('avatar-transport').invoke('height').should('be.eq', 32);
    cy.dataCy('avatar-transport').invoke('width').should('be.eq', 32);
    // icon transport
    cy.dataCy('icon-transport')
      .should('be.visible')
      .and('have.css', 'font-size', '18px')
      .and('have.color', primary);
    cy.dataCy('icon-transport').invoke('height').should('be.eq', 18);
    cy.dataCy('icon-transport').invoke('width').should('be.eq', 18);
    // description transport styles
    cy.dataCy('description-transport')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
  });

  it('renders two sections stacked', () => {
    cy.testElementPercentageWidth(cy.dataCy('section-direction'), 100);
    cy.testElementPercentageWidth(cy.dataCy('section-distance'), 100);
  });
}

function toWorkTests() {
  it('renders label and icon "to work"', () => {
    // label to work
    cy.dataCy('label-direction')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.labelDirectionToWork'));
    // icon to work
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .and('contain', 'arrow_forward');
  });
}

function fromWorkTests() {
  it('renders label and icon "from work"', () => {
    // label from work
    cy.dataCy('label-direction')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.labelDirectionFromWork'));
    // icon from work
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .and('contain', 'arrow_back');
  });
}

function distanceTests() {
  it('renders correct distance value', () => {
    cy.get('@route').then((route) => {
      // distance value including units
      cy.dataCy('label-distance')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10)
        .and('contain', route.distance)
        .and('contain', i18n.global.t('global.routeLengthUnit'));
    });
  });
}
