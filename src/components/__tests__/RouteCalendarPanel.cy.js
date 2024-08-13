import RouteCalendarPanel from 'components/routes/RouteCalendarPanel.vue';
import { i18n } from '../../boot/i18n';

// variables
const routeCountSingle = 1;
// const routeCountMultiple = 5;

describe('<RouteCalendarPanel>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RouteCalendarPanel, {
        props: {
          modelValue: true,
          routes: [
            {
              id: '1',
            },
          ],
        },
        slots: {
          title: i18n.global.t('routes.titleBottomPanel', routeCountSingle, { count: routeCountSingle }),
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RouteCalendarPanel, {
        props: {
          modelValue: true,
          routes: [
            {
              id: '2',
            },
          ],
        },
        slots: {
          title: i18n.global.t('routes.titleBottomPanel', routeCountSingle, { count: routeCountSingle }),
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-calendar-panel').should('be.visible');
  });
}
