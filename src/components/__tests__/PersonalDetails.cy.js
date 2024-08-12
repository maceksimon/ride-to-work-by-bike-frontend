import { colors } from 'quasar';
import PersonalDetails from 'components/profile/PersonalDetails.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorPersonalDetails = 'personal-details';
const selectorTitle = 'personal-details-title';
const selectorNickname = 'personal-details-nickname';
const selectorFormNickname = 'personal-details-form-nickname';
const dataSelectorNicknameValue = '[data-cy="details-item-value"]';
const dataSelectorNicknameEdit = '[data-cy="details-item-edit"]';
const dataSelectorNicknameEmpty = '[data-cy="details-item-empty"]';
const dataSelectorNicknameInput = '[data-cy="form-input"]';
const dataSelectorNicknameButtonCancel = '[data-cy="form-button-cancel"]';
const dataSelectorNicknameButtonSave = '[data-cy="form-button-save"]';

// variables
const newNickname = 'Cyklobaron';

describe('<PersonalDetails>', () => {
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
      cy.mount(PersonalDetails, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(PersonalDetails, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('formPersonalDetails').then((personalDetails) => {
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
      // nickname value
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
      // nickname edit button
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameEdit)
        .should('be.visible')
        .click();
      // nickname edit form
      cy.dataCy(selectorFormNickname).should('be.visible');
      // change nickname
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .type(newNickname);
      // cancel
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameButtonCancel)
        .click();
      // nickname is the same
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
      // change nickname
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .type(newNickname);
      // save
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameButtonSave)
        .click();
      // nickname is different
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameValue)
        .should('be.visible')
        .and('have.text', newNickname);
      // delete nickname
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameButtonSave)
        .click();
      // nickname is empty
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameValue)
        .should('not.exist');
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameEmpty)
        .should('be.visible')
        .and('have.text', i18n.global.t('profile.labelNicknameEmpty'));
      // reset nickname
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .type(personalDetails.nickname);
      // save (enter)
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorNicknameInput)
        .type('{enter}');
      // nickname is original value
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameEmpty)
        .should('not.exist');
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
    });
  });
}
