/**
 * Switch to payment without reward
 */
Cypress.Commands.add('switchToPaymentWithoutReward', () => {
  cy.dataCy('checkbox-payment-with-reward')
    .should('be.visible')
    .find('.q-checkbox__inner')
    .click();
  cy.dataCy('checkbox-payment-with-reward')
    .find('.q-checkbox__inner')
    .should('have.class', 'q-checkbox__inner--falsy');
});

/**
 * Validate step Merch without reward
 * "I don't want merch" checkbox should be selected and disabled
 * Next step button should be visible and enabled
 */
Cypress.Commands.add('validateStepMerchWithoutReward', (phone) => {
  cy.dataCy('form-merch-no-merch-checkbox')
    .should('be.visible')
    .and('have.class', 'disabled')
    .find('.q-checkbox__inner')
    .should('have.class', 'q-checkbox__inner--truthy');
  // merch cards should not be visible
  cy.dataCy('list-merch').should('not.be.visible');
  // fill phone if needed
  if (phone) {
    cy.dataCy('form-merch-phone-input').find('input').type(phone);
  }
  // go to next step
  cy.dataCy('step-6-continue').should('be.visible').click();
  // on step 7
  cy.dataCy('step-7').find('.q-stepper__step-content').should('be.visible');
});
