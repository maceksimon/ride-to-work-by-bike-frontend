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
        .and('contain', personalDetails.nickname);
      // nickname edit button
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorNicknameEdit)
        .should('be.visible')
        .click();
      // nickname edit form
      cy.dataCy(selectorFormNickname).should('be.visible');
    });
  });
}
