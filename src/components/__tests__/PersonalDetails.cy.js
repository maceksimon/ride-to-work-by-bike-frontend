import PersonalDetails from 'components/profile/PersonalDetails.vue';
import { i18n } from '../../boot/i18n';

describe('<PersonalDetails>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'profile', i18n);
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
    cy.dataCy('personal-details').should('be.visible');
  });
}
