import { colors } from 'quasar';
import FormInviteToTeam from 'components/profile/FormInviteToTeam.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorFormInviteToTeam = 'form-invite-to-team';
const selectorInput = 'invite-email-addresses-input';
const selectorLabel = 'form-label';
const selectorButtonCancel = 'form-button-cancel';
const selectorButtonSave = 'form-button-save';
const selectorAddEmailField = 'add-email-field';
const selectorRemoveEmailField = 'remove-email-field';

// variables
const remainingSlots = 4;

describe('<FormInviteToTeam>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelEmailAddresses'], 'form', i18n);
    cy.testLanguageStringsInContext(
      ['buttonAddEmailField', 'buttonRemoveEmailField', 'inviteTeamMembers'],
      'profile',
      i18n,
    );
    cy.testLanguageStringsInContext(['back', 'submit'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormInviteToTeam, {
        props: {
          onClose: () => {},
          remainingSlots,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormInviteToTeam, {
        props: {
          onClose: () => {},
          remainingSlots,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormInviteToTeam).should('be.visible');
    // label
    cy.dataCy(selectorLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelEmailAddresses'));
    // input
    cy.dataCy(selectorInput).should('be.visible');
    // cancel
    cy.dataCy(selectorButtonCancel)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.back'));
    // save
    cy.dataCy(selectorButtonSave)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.submit'));
  });

  it('renders buttons side by side', () => {
    cy.testElementsSideBySide(selectorButtonCancel, selectorButtonSave);
  });

  it('validates email fields and allows adding/removing fields', () => {
    // initially shows one email field
    cy.dataCy(selectorInput).should('have.length', 1);
    // can add more fields up to remaining slots
    cy.dataCy(selectorAddEmailField).click();
    cy.dataCy(selectorInput).should('have.length', 2);
    cy.dataCy(selectorAddEmailField).click();
    cy.dataCy(selectorInput).should('have.length', 3);
    cy.dataCy(selectorAddEmailField).click();
    cy.dataCy(selectorInput).should('have.length', 4);
    cy.dataCy(selectorAddEmailField).should('not.exist');
    // can remove fields
    cy.dataCy(selectorRemoveEmailField).first().click();
    cy.dataCy(selectorInput).should('have.length', 3);
    cy.dataCy(selectorRemoveEmailField).first().click();
    cy.dataCy(selectorInput).should('have.length', 2);
    cy.dataCy(selectorRemoveEmailField).first().click();
    cy.dataCy(selectorInput).should('have.length', 1);
    cy.dataCy(selectorAddEmailField).should('exist');
    // validates email format
    cy.dataCy(selectorInput).first().find('input').clear();
    // validates email format
    cy.dataCy(selectorInput).first().find('input').type('invalid-email');
    cy.dataCy(selectorButtonSave).click();
    cy.get('.q-field__messages').should(
      'contain',
      i18n.global.t('form.messageEmailInvalid'),
    );
    // validates required field
    cy.dataCy(selectorInput).first().find('input').clear();
    cy.dataCy(selectorButtonSave).click();
    cy.get('.q-field__messages').should(
      'contain',
      i18n.global.t('form.messageFieldRequired', {
        fieldName: i18n.global.t('form.labelEmail'),
      }),
    );
  });
}
