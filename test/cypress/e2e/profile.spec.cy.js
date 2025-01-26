import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

// selectors
const selectorProfilePage = 'profile-page';
const selectorProfilePageTitle = 'profile-page-title';
const selectorNickname = 'profile-details-nickname';
// const selectorEmail = 'profile-details-email';
const selectorGender = 'profile-details-gender';
const selectorFormNickname = 'profile-details-form-nickname';
// const selectorFormEmail = 'profile-details-form-email';
const selectorFormGender = 'profile-details-form-gender';
const dataSelectorEdit = '[data-cy="details-item-edit"]';
const dataSelectorInput = '[data-cy="form-input"]';
// const dataSelectorInputEmail = '[data-cy="form-email"]';
// const dataSelectorInputPassword = '[data-cy="form-password"]';
const dataSelectorButtonSave = '[data-cy="form-button-save"]';
const dataSelectorValue = '[data-cy="details-item-value"]';

const selectorQDrawer = 'q-drawer';
const selectorButtonNotifications = 'profile-tabs-button-notifications';
const selectorPanelNotifications = 'profile-tabs-panel-notifications';
const selectorDrawerButtonNotifications = 'button-notifications';
const selectorNotificationsDialog = 'notifications-dialog';
const selectorNotificationItem = 'notification-item-';
const selectorNotificationIcon = 'notification-icon-';
const selectorNotificationRow = 'notification-row-';
const selectorNotificationState = 'notification-state';
const selectorNotificationsCountBadge = 'notifications-count-badge';
const selectorDialogCloseButton = 'dialog-close';
const selectorButtonMarkAllAsRead = 'button-mark-all-as-read';

// variables
// const newEmail = 'ride@dopracenakole.cz';
// const password = 'testpassword123';
const genderFemale = 'female';
const genderFemaleKey = 'global.woman';

describe('Profile page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.fixture('apiGetRegisterChallengeProfile.json').then(
          (responseRegisterChallenge) => {
            cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
              (responseHasOrganizationAdmin) => {
                cy.interceptRegisterChallengeGetApi(
                  config,
                  defLocale,
                  responseRegisterChallenge,
                );
                cy.interceptHasOrganizationAdminGetApi(
                  config,
                  defLocale,
                  responseRegisterChallenge.results[0].organization_id,
                  responseHasOrganizationAdmin,
                );
              },
            );
          },
        );
      });
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      cy.viewport('macbook-16');
      // load config and i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
    testDesktopSidebar();
  });
});

function coreTests() {
  it('has translation for all strings', () => {
    cy.get('@i18n').then((i18n) => {
      cy.testLanguageStringsInContext(['titleProfile'], 'profile', i18n);
    });
  });

  it('renders page', () => {
    cy.get('@i18n').then((i18n) => {
      cy.dataCy(selectorProfilePage).should('be.visible');
      // title
      cy.dataCy(selectorProfilePageTitle)
        .should('be.visible')
        .and('contain', i18n.global.t('profile.titleProfile'));
    });
  });

  it('allows user to change nickname, and gender', () => {
    cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
      cy.fixture('apiGetRegisterChallengeProfileUpdatedNickname.json').then(
        (responseNickname) => {
          cy.fixture('apiGetRegisterChallengeProfileUpdatedGender.json').then(
            (responseGender) => {
              cy.get('@config').then((config) => {
                cy.get('@i18n').then((i18n) => {
                  // wait for GET request
                  cy.waitForRegisterChallengeGetApi(response);
                  const newNickname =
                    responseNickname.results[0].personal_details.nickname;
                  // Change nickname
                  cy.dataCy(selectorNickname).find(dataSelectorEdit).click();
                  cy.dataCy(selectorFormNickname)
                    .find(dataSelectorInput)
                    .clear();
                  cy.dataCy(selectorFormNickname)
                    .find(dataSelectorInput)
                    .type(newNickname);
                  // intercept POST request
                  cy.interceptRegisterChallengePostApi(
                    config,
                    i18n,
                    responseNickname,
                  );
                  // override intercept GET request
                  cy.interceptRegisterChallengeGetApi(
                    config,
                    i18n,
                    responseNickname,
                  );
                  // submit form
                  cy.dataCy(selectorFormNickname)
                    .find(dataSelectorButtonSave)
                    .click();
                  // wait for GET request
                  cy.waitForRegisterChallengeGetApi(responseNickname);
                  cy.dataCy(selectorNickname)
                    .find(dataSelectorValue)
                    .should('have.text', newNickname);

                  // Change email
                  // cy.dataCy(selectorEmail).find(dataSelectorEdit).click();
                  // cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).clear();
                  // cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).type(newEmail);
                  // cy.dataCy(selectorFormEmail)
                  //   .find(dataSelectorInputPassword)
                  //   .type(password);
                  // cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
                  // cy.dataCy(selectorEmail)
                  //   .find(dataSelectorValue)
                  //   .should('have.text', newEmail);

                  // Change gender
                  cy.dataCy(selectorGender).find(dataSelectorEdit).click();
                  cy.dataCy(selectorFormGender)
                    .find('.q-radio__label')
                    .contains(i18n.global.t(genderFemaleKey))
                    .click();
                  // intercept POST request
                  cy.interceptRegisterChallengePostApi(
                    config,
                    i18n,
                    responseGender,
                  );
                  // override intercept GET request
                  cy.interceptRegisterChallengeGetApi(
                    config,
                    i18n,
                    responseGender,
                  );
                  cy.dataCy(selectorFormGender)
                    .find(dataSelectorButtonSave)
                    .click();
                  cy.dataCy(selectorGender)
                    .find(dataSelectorValue)
                    .should('have.text', genderFemale);
                });
              });
            },
          );
        },
      );
    });
  });

  it.skip('navigates to notifications tab and marks a notification as read', () => {
    cy.fixture('notifications').then((notifications) => {
      cy.get('@i18n').then((i18n) => {
        // open notifications tab
        cy.dataCy(selectorButtonNotifications).click();
        cy.dataCy(selectorPanelNotifications).should('be.visible');
        // open dialog (button selector is scoped in sidebar - repeats on mobile)
        cy.dataCy(selectorQDrawer).within(() => {
          cy.dataCy(selectorDrawerButtonNotifications).click();
        });
        cy.dataCy(selectorNotificationsDialog).should('be.visible');
        // mark first dialog item as read
        const firstUnreadNotificationId = notifications.filter(
          (notification) => notification.unread === true,
        )[0].id;
        // same item has state "unread" in table
        cy.dataCy(
          `${selectorNotificationRow}${firstUnreadNotificationId}`,
        ).within(() => {
          cy.dataCy(selectorNotificationState).should(
            'contain',
            i18n.global.t('notifications.labelUnread'),
          );
        });
        // click the notification icon
        cy.dataCy(
          `${selectorNotificationItem}${firstUnreadNotificationId}`,
        ).within(() => {
          cy.dataCy(
            `${selectorNotificationIcon}${firstUnreadNotificationId}`,
          ).click();
        });
        // item disappears from dialog
        cy.dataCy(
          `${selectorNotificationItem}${firstUnreadNotificationId}`,
        ).should('not.exist');
        // same item has state "read" in table
        cy.dataCy(
          `${selectorNotificationRow}${firstUnreadNotificationId}`,
        ).within(() => {
          cy.dataCy(selectorNotificationState).should(
            'contain',
            i18n.global.t('notifications.labelRead'),
          );
        });
        cy.dataCy(selectorDialogCloseButton).click();
        // mark all notifications as read
        cy.dataCy(selectorButtonMarkAllAsRead).click();
        // badge disappears
        cy.dataCy(selectorQDrawer).within(() => {
          cy.dataCy(selectorNotificationsCountBadge).should('not.exist');
        });
      });
    });
  });
}
