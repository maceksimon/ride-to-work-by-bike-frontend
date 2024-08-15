import { colors } from 'quasar';
import ProfileDetails from 'components/profile/ProfileDetails.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorEmail = 'profile-details-email';
const selectorFormEmail = 'profile-details-form-email';
const selectorFormNickname = 'profile-details-form-nickname';
const selectorNickname = 'profile-details-nickname';
const selectorPersonalDetails = 'profile-details';
const selectorTitle = 'profile-details-title';
const dataSelectorButtonCancel = '[data-cy="form-button-cancel"]';
const dataSelectorButtonSave = '[data-cy="form-button-save"]';
const dataSelectorEdit = '[data-cy="details-item-edit"]';
const dataSelectorEmpty = '[data-cy="details-item-empty"]';
const dataSelectorInput = '[data-cy="form-input"]';
const dataSelectorInputEmail = '[data-cy="form-email"]';
const dataSelectorInputPassword = '[data-cy="form-password"]';
const dataSelectorValue = '[data-cy="details-item-value"]';

// variables
const newNickname = 'Cyklobaron';
const newEmail = 'ride@dopracenakole.cz';
const password = 'password';

describe('<ProfileDetails>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'descriptionNickname',
        'labelNickname',
        'labelNicknameEmpty',
        'titlePersonalDetails',
        'titleUpdateNickname',
      ],
      'profile',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ProfileDetails, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ProfileDetails, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorPersonalDetails).should('be.visible');
    // title
    cy.dataCy(selectorTitle)
      .should('be.visible')
      .and('have.css', 'font-size', '20px')
      .and('have.css', 'font-weight', '500')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('profile.titlePersonalDetails'));
    // nickname row
    cy.dataCy(selectorNickname).should('be.visible');
  });

  it('allows to edit nickname', () => {
    cy.fixture('formPersonalDetails').then((personalDetails) => {
      // nickname value
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
      // nickname edit button
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // nickname edit form
      cy.dataCy(selectorFormNickname).should('be.visible');
      // change nickname
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname).find(dataSelectorInput).type(newNickname);
      // cancel
      cy.dataCy(selectorFormNickname).find(dataSelectorButtonCancel).click();
      // nickname is the same
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
      // change nickname
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname).find(dataSelectorInput).type(newNickname);
      // save
      cy.dataCy(selectorFormNickname).find(dataSelectorButtonSave).click();
      // nickname is different
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', newNickname);
      // delete nickname
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname).find(dataSelectorButtonSave).click();
      // nickname is empty
      cy.dataCy(selectorNickname).find(dataSelectorValue).should('not.exist');
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorEmpty)
        .should('be.visible')
        .and('have.text', i18n.global.t('profile.labelNicknameEmpty'));
      // reset nickname
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .type(personalDetails.nickname);
      // save (enter)
      cy.dataCy(selectorFormNickname).find(dataSelectorInput).type('{enter}');
      // nickname is original value
      cy.dataCy(selectorNickname).find(dataSelectorEmpty).should('not.exist');
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
    });
  });

  it.only('allows to edit email', () => {
    cy.fixture('formPersonalDetails').then((personalDetails) => {
      // email value
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.email);
      // email edit button
      cy.dataCy(selectorEmail)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // email edit form
      cy.dataCy(selectorFormEmail).should('be.visible');
      // change email
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputEmail)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).type(newEmail);
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputPassword)
        .type(password);
      // cancel
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonCancel).click();
      // email is the same
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.email);
      // change email
      cy.dataCy(selectorEmail)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputEmail)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).type(newEmail);
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputPassword)
        .type(password);
      // save
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
      // email is different
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', newEmail);
      // deleting email is not possible
      cy.dataCy(selectorEmail)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormEmail)
        .should('be.visible')
        .find(dataSelectorInputEmail)
        .clear();
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
      cy.dataCy(selectorFormEmail).should('be.visible');
      // fill in original email
      cy.dataCy(selectorFormEmail)
        .should('be.visible')
        .find(dataSelectorInputEmail)
        .type(personalDetails.email);
      // cannot save without password
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
      cy.dataCy(selectorFormEmail).should('be.visible');
      // fill in password
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputPassword)
        .type(password);
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.email);
    });
  });
}
