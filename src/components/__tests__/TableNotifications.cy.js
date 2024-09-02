import TableNotifications from 'components/profile/TableNotifications.vue';
import { i18n } from '../../boot/i18n';

// selectors
const tableNotifications = 'table-notifications';

describe('<TableNotifications>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(TableNotifications, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(TableNotifications, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(tableNotifications).should('be.visible');
  });
}
