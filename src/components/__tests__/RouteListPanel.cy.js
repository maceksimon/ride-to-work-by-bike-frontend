import RouteCalendarPanel from 'components/routes/RouteCalendarPanel.vue';
import { i18n } from '../../boot/i18n';

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
