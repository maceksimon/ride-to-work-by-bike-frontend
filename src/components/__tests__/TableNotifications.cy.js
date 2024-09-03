import { date } from 'quasar';
import TableNotifications from 'components/profile/TableNotifications.vue';
import { i18n } from '../../boot/i18n';

// selectors
const dataSelectorNotificationTitle = '[data-cy="notification-title"]';
const dataSelectorNotificationTimestamp = '[data-cy="notification-timestamp"]';
const dataSelectorNotificationUnread = '[data-cy="notification-unread"]';
const dataSelectorNotificationAction = '[data-cy="notification-action"]';
const selectorTableNotifications = 'table-notifications';
const selectorNotificationRow = 'notification-row';

describe('<TableNotifications>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelAction',
        'labelDate',
        'labelRead',
        'labelState',
        'labelTitle',
        'labelUnread',
      ],
      'notifications',
      i18n,
    );
  });

  let notifications;

  before(() => {
    cy.fixture('tableNotifications').then((data) => {
      notifications = data;
    });
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

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorTableNotifications).should('be.visible');
    });

    it('renders notifications', () => {
      cy.dataCy(selectorNotificationRow)
        .should('be.visible')
        .should('have.length', 5);
      cy.dataCy(selectorTableNotifications) // scroll to the right
        .find('.scroll')
        .scrollTo('right', {
          ensureScrollable: false,
        });
      cy.dataCy(selectorNotificationRow).each((row, index) => {
        const notification = notifications[index];
        cy.wrap(row)
          .find(dataSelectorNotificationTitle)
          .should('be.visible')
          .should('contain', notification.verb);
        cy.wrap(row)
          .find(dataSelectorNotificationTimestamp)
          .should('be.visible')
          .should(
            'contain',
            date.formatDate(
              new Date(String(notification.timestamp)),
              'D. MMM. YYYY',
            ),
          );
        cy.wrap(row)
          .find(dataSelectorNotificationUnread)
          .should('be.visible')
          .should(
            'contain',
            notification.unread
              ? i18n.global.t('notifications.labelUnread')
              : i18n.global.t('notifications.labelRead'),
          );

        cy.wrap(row).find(dataSelectorNotificationAction).should('be.visible');
      });
    });
  }
});
