import { colors } from 'quasar';
import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import TableFeeApproval from 'components/coordinator/TableFeeApproval.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import testData from '../../../test/cypress/fixtures/headerOrganizationTestData.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useTable } from 'src/composables/useTable';
import { deepObjectWithSimplePropsCopy } from '../../utils';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

// composables
const { formatPrice } = useTable();

// selectors
const selectorTableFeeApproval = 'table-fee-approval';
const selectorTable = 'table-fee-approval-table';
const selectorTableSubsidiaryHeader = 'table-fee-approval-address-header';
const selectorTableRow = 'table-fee-approval-row';
const selectorTableCheckbox = 'table-fee-approval-checkbox';
const selectorTableAmount = 'table-fee-approval-amount';
const selectorTableName = 'table-fee-approval-name';
const selectorTableReward = 'table-fee-approval-reward';
const selectorTableRewardCheckbox = 'table-fee-approval-reward-checkbox';
const selectorTableEmail = 'table-fee-approval-email';
const selectorTableNickname = 'table-fee-approval-nickname';
const selectorTableDate = 'table-fee-approval-date';
const selectorApproveButton = 'table-fee-approval-button';
const selectorDisapproveButton = 'table-fee-disapproval-button';
const selectorDisapproveDialog = 'dialog-disapprove-payments';
const selectorDisapproveCancel = 'dialog-disapprove-cancel';
const selectorDisapproveConfirm = 'dialog-disapprove-confirm';

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

describe('<TableFeeApproval>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonFeeApproval',
        'buttonFeeDisapproval',
        'buttonConfirmDisapprove',
        'titleDialogDisapprovePayments',
        'labelDisapprovePaymentsDescription',
        'labelAmount',
        'labelDateRegistered',
        'labelEmail',
        'labelName',
        'labelNickname',
        'labelReward',
        'labelTeam',
        'textNoData',
      ],
      'table',
      i18n,
    );
  });

  context('desktop non-approved variant', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableFeeApproval, {
        props: { approved: false },
      });
      cy.viewport('macbook-16');
    });

    testData.forEach((test) => {
      it(`${test.description} - non-approved variant`, () => {
        // initiate store state
        cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
          const adminOrganisations = computed(
            () => adminOrganisationStore.getAdminOrganisations,
          );
          adminOrganisationStore.setAdminOrganisations(test.storeData);
          cy.wrap(adminOrganisations)
            .its('value')
            .should('deep.equal', test.storeData);
        });
        // test DOM component
        cy.dataCy(selectorTableFeeApproval).should('exist');

        const subsidiaries = test.storeData[0].subsidiaries;
        if (subsidiaries.length === 0) {
          // no subsidiaries - no table rows
          cy.dataCy(selectorTableRow).should('not.exist');
          return;
        }
        // count non-approved members
        let nonApprovedMemberCount = 0;
        subsidiaries.forEach((subsidiary) => {
          subsidiary.teams.forEach((team) => {
            nonApprovedMemberCount +=
              team.members_without_paid_entry_fee_by_org_coord.length;
          });
        });
        const displayedSubsidiaries = subsidiaries.filter((subsidiary) => {
          return subsidiary.teams.some((team) => {
            return team.members_without_paid_entry_fee_by_org_coord.length > 0;
          });
        });
        if (nonApprovedMemberCount === 0) {
          // no non-approved members
          cy.dataCy(selectorTableRow).should('not.exist');
          // empty table state
          cy.get('.q-table__bottom--nodata')
            .should('be.visible')
            .and('contain', i18n.global.t('table.textNoData'));
        } else {
          // test table rows and subsidiary headers
          cy.dataCy(selectorTable)
            .should('be.visible')
            .and('have.css', 'border-radius', borderRadius);
          // checkboxes are visible
          cy.dataCy(selectorTableRow).should('exist');
          cy.dataCy(selectorTableCheckbox).should('be.visible');
          // count table rows with name
          cy.dataCy(selectorTableName).should(
            'have.length',
            nonApprovedMemberCount,
          );
          // subsidiary headers are visible
          cy.dataCy(selectorTableSubsidiaryHeader)
            .should('be.visible')
            .and('have.backgroundColor', primary)
            .and('have.color', white)
            .and('have.length', displayedSubsidiaries.length);
          // test each subsidiary header
          cy.dataCy(selectorTableSubsidiaryHeader).each((header, index) => {
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street_number);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].city);
          });
        }
      });
    });

    it('display members with correct data for non-approved variant', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              const adminOrganisations = computed(
                () => adminOrganisationStore.getAdminOrganisations,
              );
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
              cy.wrap(adminOrganisations)
                .its('value')
                .should('deep.equal', tableFeeApprovalTestData.storeData);
            },
          );
          const display =
            tableFeeApprovalTestData.displayData.nonApprovedMembers;

          // test each member row
          cy.dataCy(selectorTableRow).each((table, index) => {
            if (display[index]) {
              cy.wrap(table).within(() => {
                // checkbox
                cy.dataCy(selectorTableCheckbox).should('be.visible');
                // amount
                cy.dataCy(selectorTableAmount)
                  .should('be.visible')
                  .and('contain', formatPrice(display[index].amount));
                // name
                cy.dataCy(selectorTableName)
                  .should('be.visible')
                  .and('contain', display[index].name);
                // email
                cy.dataCy(selectorTableEmail)
                  .should('be.visible')
                  .and('contain', display[index].email);
                // nickname
                if (display[index].nickname) {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('contain', display[index].nickname);
                } else {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('be.empty');
                }
                // date
                if (display[index].dateCreated) {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and(
                      'contain',
                      i18n.global.d(
                        new Date(display[index].dateCreated),
                        'numeric',
                      ),
                    );
                } else {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and('be.empty');
                }
                // reward
                cy.dataCy(selectorTableReward).should('be.visible');
                cy.dataCy(selectorTableRewardCheckbox)
                  .should('be.visible')
                  .and('not.have.class', 'disabled');
                if (display[index].reward === true) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--truthy');
                } else if (display[index].reward === false) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--falsy');
                } else {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--indet');
                }
              });
            }
          });
        },
      );
    });

    it('should show disapprove and approve buttons with correct state', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
            },
          );
          // buttons visible
          cy.dataCy(selectorDisapproveButton).should('be.visible');
          cy.dataCy(selectorApproveButton).should('be.visible');
          // buttons disabled (no members selected)
          cy.dataCy(selectorDisapproveButton).should('be.disabled');
          cy.dataCy(selectorApproveButton).should('be.disabled');
          // select a payment
          cy.dataCy(selectorTableCheckbox).first().click();
          // buttons enabled
          cy.dataCy(selectorDisapproveButton).should('not.be.disabled');
          cy.dataCy(selectorApproveButton).should('not.be.disabled');
        },
      );
    });

    it('should open disapprove confirmation dialog when disapprove button is clicked', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
            },
          );
          // dialog not visible initially
          cy.dataCy(selectorDisapproveDialog).should('not.exist');
          // select a payment
          cy.dataCy(selectorTableCheckbox).first().click();
          // click disapprove button
          cy.dataCy(selectorDisapproveButton).click();
          // dialog visible
          cy.dataCy(selectorDisapproveDialog).should('be.visible');
          // verify title
          cy.dataCy(selectorDisapproveDialog)
            .contains(i18n.global.t('table.titleDialogDisapprovePayments'))
            .should('be.visible');
          // verify cancel and confirm buttons
          cy.dataCy(selectorDisapproveCancel).should('be.visible');
          cy.dataCy(selectorDisapproveConfirm).should('be.visible');
          // click cancel
          cy.dataCy(selectorDisapproveCancel).click();
          // dialog should close
          cy.dataCy(selectorDisapproveDialog).should('not.exist');
        },
      );
    });

    it('shows approved payment reward state based on the local state', () => {
      cy.fixture('apiGetAdminOrganisationResponseAlt2').then(
        (tableFeeApprovalTestData) => {
          // full list of displayed payments
          const payments =
            tableFeeApprovalTestData.results[0].subsidiaries[0].teams[0]
              .members_without_paid_entry_fee_by_org_coord;
          // payments that will be changed manually
          const payment = payments[0];
          // store payment reward state based on the API data
          const paymentRewardState = payments.reduce((acc, payment) => {
            acc[payment.id] = payment.is_payment_with_reward;
            return acc;
          }, {});
          const paymentRewardStateUpdated =
            deepObjectWithSimplePropsCopy(paymentRewardState);
          paymentRewardStateUpdated[payment.id] =
            !paymentRewardStateUpdated[payment.id];
          // store payment amount state based on the API data
          const paymentAmountState = payments.reduce((acc, payment) => {
            acc[payment.id] = parseFloat(payment.payment_amount);
            return acc;
          }, {});
          const paymentAmountStateUpdated =
            deepObjectWithSimplePropsCopy(paymentAmountState);
          // set arbitrary updated amount (different from original)
          paymentAmountStateUpdated[payment.id] = 999;
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.results,
              );
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', paymentRewardState);
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', paymentAmountState);
            },
          );
          // set local state different to the API data
          cy.wrap(useAdminOrganisationStore())
            .then((adminOrganisationStore) => {
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              adminOrganisationStore.setPaymentReward(
                payment.id,
                !paymentRewardState[payment.id],
              );
              adminOrganisationStore.setPaymentAmount(
                payment.id,
                paymentAmountStateUpdated[payment.id],
              );
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', paymentRewardStateUpdated);
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', paymentAmountStateUpdated);
            })
            .then(() => {
              // wait for animation
              return new Cypress.Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 500);
              });
            })
            .then(() => {
              // store has been altered via store - UI shows it
              cy.dataCy('table-fee-approval-table').within(() => {
                cy.contains(payment.email)
                  .parent('tr')
                  .within(() => {
                    // reward checkbox
                    cy.dataCy('table-fee-approval-reward-checkbox')
                      .find('.q-checkbox__inner')
                      .should((checkbox) => {
                        // UI shows the altered value, not the API value
                        if (paymentRewardState[payment.id] === true) {
                          expect(checkbox).to.have.class(
                            'q-checkbox__inner--falsy',
                          );
                        } else {
                          expect(checkbox).to.have.class(
                            'q-checkbox__inner--truthy',
                          );
                        }
                      });
                    // amount
                    cy.dataCy('table-fee-approval-amount').should(
                      'contain',
                      formatPrice(paymentAmountStateUpdated[payment.id]),
                    );
                  });
              });
            });
        },
      );
    });
  });

  context('desktop approved variant', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableFeeApproval, {
        props: { approved: true },
      });
      cy.viewport('macbook-16');
    });

    testData.forEach((test) => {
      it(`${test.description} - approved variant`, () => {
        // initiate store state
        cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
          const adminOrganisations = computed(
            () => adminOrganisationStore.getAdminOrganisations,
          );
          adminOrganisationStore.setAdminOrganisations(test.storeData);
          cy.wrap(adminOrganisations)
            .its('value')
            .should('deep.equal', test.storeData);
        });
        // test DOM component
        cy.dataCy(selectorTableFeeApproval).should('exist');

        const subsidiaries = test.storeData[0].subsidiaries;
        if (subsidiaries.length === 0) {
          // no subsidiaries - no table rows
          cy.dataCy(selectorTableRow).should('not.exist');
          return;
        }
        // count approved members
        let approvedMemberCount = 0;
        subsidiaries.forEach((subsidiary) => {
          subsidiary.teams.forEach((team) => {
            approvedMemberCount +=
              team.members_with_paid_entry_fee_by_org_coord.length;
          });
        });
        const displayedSubsidiaries = subsidiaries.filter((subsidiary) => {
          return subsidiary.teams.some((team) => {
            return team.members_with_paid_entry_fee_by_org_coord.length > 0;
          });
        });
        if (approvedMemberCount === 0) {
          // no approved members
          cy.dataCy(selectorTableRow).should('not.exist');
          // empty table state
          cy.get('.q-table__bottom--nodata')
            .should('be.visible')
            .and('contain', i18n.global.t('table.textNoData'));
        } else {
          // table is visible
          cy.dataCy(selectorTable)
            .should('be.visible')
            .and('have.css', 'border-radius', borderRadius);
          // checkboxes are NOT visible
          cy.dataCy(selectorTableCheckbox).should('not.exist');
          // count table rows with name
          cy.dataCy(selectorTableName).should(
            'have.length',
            approvedMemberCount,
          );
          // subsidiary headers are visible
          cy.dataCy(selectorTableSubsidiaryHeader)
            .should('be.visible')
            .and('have.backgroundColor', primary)
            .and('have.color', white)
            .and('have.length', displayedSubsidiaries.length);
          // test each subsidiary header
          cy.dataCy(selectorTableSubsidiaryHeader).each((header, index) => {
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street_number);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].city);
          });
        }
      });
    });

    it('display members with correct data for approved variant', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              const adminOrganisations = computed(
                () => adminOrganisationStore.getAdminOrganisations,
              );
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
              cy.wrap(adminOrganisations)
                .its('value')
                .should('deep.equal', tableFeeApprovalTestData.storeData);
            },
          );
          const display = tableFeeApprovalTestData.displayData.approvedMembers;

          // test each member row
          cy.dataCy(selectorTableRow).each((table, index) => {
            if (display[index]) {
              cy.wrap(table).within(() => {
                // checkbox is NOT visible
                cy.dataCy(selectorTableCheckbox).should('not.exist');
                // amount
                cy.dataCy(selectorTableAmount)
                  .should('be.visible')
                  .and('contain', formatPrice(display[index].amount));
                // name
                cy.dataCy(selectorTableName)
                  .should('be.visible')
                  .and('contain', display[index].name);
                // email
                cy.dataCy(selectorTableEmail)
                  .should('be.visible')
                  .and('contain', display[index].email);
                // nickname
                if (display[index].nickname) {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('contain', display[index].nickname);
                } else {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('be.empty');
                }
                // date
                if (display[index].dateCreated) {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and(
                      'contain',
                      i18n.global.d(
                        new Date(display[index].dateCreated),
                        'numeric',
                      ),
                    );
                } else {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and('be.empty');
                }
                // reward
                cy.dataCy(selectorTableReward).should('be.visible');
                cy.dataCy(selectorTableRewardCheckbox)
                  .should('be.visible')
                  .and('have.class', 'disabled');
                if (display[index].reward === true) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--truthy');
                } else if (display[index].reward === false) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--falsy');
                } else {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--indet');
                }
              });
            }
          });
        },
      );
    });

    it('should not show action buttons for approved variant', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
            },
          );
          // approve and disapprove buttons should not exist
          cy.dataCy(selectorDisapproveButton).should('not.exist');
          cy.dataCy(selectorApproveButton).should('not.exist');
        },
      );
    });

    it('shows approved payment reward state independent of the local state', () => {
      cy.fixture('apiGetAdminOrganisationResponseAlt2').then(
        (tableFeeApprovalTestData) => {
          // full list of displayed payments
          const payments =
            tableFeeApprovalTestData.results[0].subsidiaries[0].teams[1]
              .members_with_paid_entry_fee_by_org_coord;
          // payments that will be changed manually
          const payment = payments[0];
          // store payment reward state based on the API data
          const paymentRewardState = payments.reduce((acc, payment) => {
            acc[payment.id] = payment.is_payment_with_reward;
            return acc;
          }, {});
          const paymentRewardStateUpdated =
            deepObjectWithSimplePropsCopy(paymentRewardState);
          paymentRewardStateUpdated[payment.id] =
            !paymentRewardStateUpdated[payment.id];
          // store payment amount state based on the API data
          const paymentAmountState = payments.reduce((acc, payment) => {
            acc[payment.id] = parseFloat(payment.payment_amount);
            return acc;
          }, {});
          const paymentAmountStateUpdated =
            deepObjectWithSimplePropsCopy(paymentAmountState);
          // set arbitrary updated amount (different from original)
          paymentAmountStateUpdated[payment.id] = 999;
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.results,
              );
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', paymentRewardState);
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', paymentAmountState);
            },
          );
          // set local state different to the API data
          cy.wrap(useAdminOrganisationStore())
            .then((adminOrganisationStore) => {
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              adminOrganisationStore.setPaymentReward(
                payment.id,
                !paymentRewardState[payment.id],
              );
              adminOrganisationStore.setPaymentAmount(
                payment.id,
                paymentAmountStateUpdated[payment.id],
              );
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', paymentRewardStateUpdated);
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', paymentAmountStateUpdated);
            })
            .then(() => {
              // wait for animation
              return new Cypress.Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 500);
              });
            })
            .then(() => {
              // store has been altered via store - UI shows API data, not altered
              cy.dataCy('table-fee-approval-table').within(() => {
                cy.contains(payment.email)
                  .parent('tr')
                  .within(() => {
                    // reward checkbox shows API value (not local state)
                    cy.dataCy('table-fee-approval-reward-checkbox')
                      .find('.q-checkbox__inner')
                      .should((checkbox) => {
                        // UI shows the API value, not the altered value
                        if (paymentRewardState[payment.id] === true) {
                          expect(checkbox).to.not.have.class(
                            'q-checkbox__inner--falsy',
                          );
                        } else {
                          expect(checkbox).to.not.have.class(
                            'q-checkbox__inner--truthy',
                          );
                        }
                      });
                    // amount shows API value (not local state)
                    cy.dataCy('table-fee-approval-amount').should(
                      'contain',
                      formatPrice(paymentAmountState[payment.id]),
                    );
                  });
              });
            });
        },
      );
    });
  });
});
