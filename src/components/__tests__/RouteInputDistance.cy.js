import { colors } from 'quasar';
import RouteInputDistance from 'components/routes/RouteInputDistance.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const iconTraceMapSelector = 'icon-trace-map';
const iconTraceMapSize = 24;

describe('<RouteInputDistance>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'actionInputDistance',
        'actionTraceMap',
        'buttonTraceMap',
        'labelDistance',
      ],
      'routes',
      i18n,
    );
    // not testing global.routeLengthUnit (identical across languages)
  });

  context('desktop - input number', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: 'input-number',
          modelValue: 0,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    inputTests();

    it('renders inputs side by side (align-bottom)', () => {
      // input type is input distance
      cy.dataCy('select-action')
        .should('be.visible')
        .find('input')
        .should('have.value', i18n.global.t('routes.actionInputDistance'));
      // input type and input distance are on the same line
      cy.testElementsSideBySide('section-input-action', 'section-input-number');
    });
  });

  context('desktop - input map', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: 'input-map',
          modelValue: 0,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    buttonMapTests();

    it('renders inputs side by side (align-bottom)', () => {
      // input type is input distance
      cy.dataCy('select-action')
        .should('be.visible')
        .find('input')
        .should('have.value', i18n.global.t('routes.actionTraceMap'));
      // input type and input distance are on the same line
      cy.testElementsSideBySide('section-input-action', 'section-input-map');
    });
  });

  context('mobile - input number', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: 'input-number',
          modelValue: 0,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    inputTests();
  });

  context('mobile - input map', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: 'input-map',
          modelValue: 0,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    buttonMapTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-input-distance').should('be.visible');
    cy.dataCy('label-distance')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    // select action
    cy.dataCy('select-action').should('be.visible');
  });
}

function inputTests() {
  it('renders distance input', () => {
    cy.dataCy('button-trace-map').should('not.exist');
    // input
    cy.dataCy('input-distance').should('be.visible');
    // input distance unit styles
    cy.dataCy('units-distance')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('global.routeLengthUnit'));
  });
}

function buttonMapTests() {
  it('renders map button', () => {
    cy.dataCy('input-distance').should('not.exist');
    cy.dataCy('button-trace-map')
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('contain', i18n.global.t('routes.buttonTraceMap'));
    cy.dataCy(iconTraceMapSelector).should('be.visible');
    cy.dataCy(iconTraceMapSelector)
      .invoke('width')
      .should('be.equal', iconTraceMapSize);
    cy.dataCy(iconTraceMapSelector)
      .invoke('height')
      .should('be.equal', iconTraceMapSize);
  });
}
