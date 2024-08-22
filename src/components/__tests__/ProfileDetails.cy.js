import { colors } from 'quasar';
import ProfileDetails from 'components/profile/ProfileDetails.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorEmail = 'profile-details-email';
const selectorFormEmail = 'profile-details-form-email';
const selectorFormGender = 'profile-details-form-gender';
const selectorFormNickname = 'profile-details-form-nickname';
const selectorGender = 'profile-details-gender';
const selectorLanguage = 'profile-details-language';
const selectorLanguageSwitcher = 'profile-details-language-switcher';
const selectorNickname = 'profile-details-nickname';
const selectorOrganizationType = 'profile-details-organization-type';
const selectorOrganization = 'profile-details-organization';
const selectorPersonalDetails = 'profile-details';
const selectorTitlePersonalDetails = 'profile-title-personal-details';
const selectorTitleChallengeDetails = 'profile-title-challenge-details';
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
const newGender = 'female';
const newEmail = 'ride@dopracenakole.cz';
const password = 'password';

describe('<ProfileDetails>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'descriptionNickname',
        'labelEmail',
        'labelEmailEmpty',
        'labelGender',
        'labelGenderEmpty',
        'labelLanguage',
        'labelLanguageEmpty',
        'labelNickname',
        'labelNicknameEmpty',
        'titleChallengeDetails',
        'titlePersonalDetails',
        'titleUpdateEmail',
        'titleUpdateGender',
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
    cy.fixture('formPersonalDetails').then((formPersonalDetails) => {
      // component
      cy.dataCy(selectorPersonalDetails).should('be.visible');
      // page title
      cy.dataCy(selectorTitlePersonalDetails)
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('profile.titlePersonalDetails'));
      // row nickname
      cy.dataCy(selectorNickname).should('be.visible');
      // row email
      cy.dataCy(selectorEmail).should('be.visible');
      // row gender
      cy.dataCy(selectorGender).should('be.visible');
      // row language
      cy.dataCy(selectorLanguage).should('be.visible');
      cy.dataCy(selectorLanguageSwitcher).should('be.visible');
      // title challenge details
      cy.dataCy(selectorTitleChallengeDetails)
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('profile.titleChallengeDetails'));
      // row organizationType
      cy.dataCy(selectorOrganizationType)
        .should('be.visible')
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.organizationType);
      // row organization
      cy.dataCy(selectorOrganization)
        .should('be.visible')
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.organization);
    });
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

  it('allows to edit email', () => {
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
      // save (enter)
      cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).type('{enter}');
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.email);
    });
  });

  it('allows to edit gender', () => {
    cy.fixture('formPersonalDetails').then((personalDetails) => {
      // gender value
      cy.dataCy(selectorGender)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.gender);
      // gender edit button
      cy.dataCy(selectorGender)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // gender edit form
      cy.dataCy(selectorFormGender).should('be.visible');
      // change gender
      cy.dataCy(selectorFormGender)
        .find('.q-radio__label')
        // female
        .first()
        .click();
      // cancel
      cy.dataCy(selectorFormGender).find(dataSelectorButtonCancel).click();
      // gender is the same
      cy.dataCy(selectorGender)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.gender);
      // gender edit button
      cy.dataCy(selectorGender)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // gender edit form
      cy.dataCy(selectorFormGender).should('be.visible');
      // change gender
      cy.dataCy(selectorFormGender)
        .find('.q-radio__label')
        // female
        .first()
        .click();
      // save
      cy.dataCy(selectorFormGender).find(dataSelectorButtonSave).click();
      // gender is different
      cy.dataCy(selectorGender)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', newGender);
      // reset gender
      cy.dataCy(selectorGender)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // gender edit form
      cy.dataCy(selectorFormGender).should('be.visible');
      // change gender
      cy.dataCy(selectorFormGender)
        .find('.q-radio__label')
        // male
        .last()
        .click();
      // save
      cy.dataCy(selectorFormGender).find(dataSelectorButtonSave).click();
    });
  });
}
