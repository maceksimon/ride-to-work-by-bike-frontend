import RegisterChallengeSummary from 'components/register/RegisterChallengeSummary.vue';
import { i18n } from '../../boot/i18n';

describe('<RegisterChallengeSummary>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RegisterChallengeSummary, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RegisterChallengeSummary, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('component').should('be.visible');
  });
}
