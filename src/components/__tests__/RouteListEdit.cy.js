import RouteListEdit from 'components/routes/RouteListEdit.vue';
import { i18n } from '../../boot/i18n';
import { testRouteListDayDate } from '../../../test/cypress/support/commonTests';

describe('<RouteListEdit>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'routes', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListEdit, {
          props: {
            routes,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders items in two columns', () => {
      cy.testElementPercentageWidth(cy.dataCy('route-list-item-wrapper'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListEdit, {
          props: {
            routes,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders items in one columns', () => {
      cy.testElementPercentageWidth(cy.dataCy('route-list-item-wrapper'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy('route-list-edit').should('be.visible');
    // items visible
    cy.dataCy('route-list-item').should('be.visible');
    // direction labels visible
    cy.dataCy('section-direction').should('be.visible');
  });

  // day date (title) styles
  testRouteListDayDate();

  it('renders route list transport methods', () => {
    cy.fixture('routeList').then((routeList) => {
      // for each route check if icon is correct
      cy.dataCy('route-list-item').each(($element, index) => {
        if (routeList[index].direction === 'toWork') {
          cy.wrap($element)
            .find('[data-cy="label-direction"]')
            .should('contain', i18n.global.t('routes.labelDirectionToWork'));
        }
        if (routeList[index].direction === 'fromWork') {
          cy.wrap($element)
            .find('[data-cy="label-direction"]')
            .should('contain', i18n.global.t('routes.labelDirectionFromWork'));
        }
      });
    });
  });

  it('renders save button with edit count', () => {
    cy.dataCy('button-save')
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('have.css', 'font-weight', '700')
      .and(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
      );
    // introduce a change
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .last()
      .click();
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // revert change
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .first()
      .click();
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
    // introduce two changes
    // change first route
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .last()
      .click();
    // change last route
    cy.dataCy('route-list-item')
      .last()
      .find('[data-cy="button-toggle-transport"]')
      .first()
      .click();
    // count changes
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 2, { count: 2 }),
    );
    // revert changes
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .first()
      .click();
    cy.dataCy('route-list-item')
      .last()
      .find('[data-cy="button-toggle-transport"]')
      .last()
      .click();
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );

    // test inputting distance value
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="input-distance"]')
      .clear();
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="input-distance"]')
      .type(1);
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="input-distance"]')
      .blur();
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // reset
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="input-distance"]')
      .clear();
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="input-distance"]')
      .type(10);
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="input-distance"]')
      .blur();
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );

    // test changing input type
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="select-action"]')
      .select(i18n.global.t('routes.actionTraceMap'));
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // reset
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="select-action"]')
      .select(i18n.global.t('routes.actionInputDistance'));
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
  });
}
