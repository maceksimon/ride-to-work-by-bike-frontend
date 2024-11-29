import FormSelectTeam from 'components/form/FormSelectTeam.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorFormSelectTeam = 'form-select-team';
const selectorFormSelectTableTeam = 'form-select-table-team';
const selectorFormSelectTeamInfo = 'form-select-team-info';
describe('<FormSelectTeam>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['textTeamInfo'],
      'register.challenge',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormSelectTeam, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormSelectTeam, {
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
    cy.dataCy(selectorFormSelectTeam).should('be.visible');
    // info text
    cy.dataCy(selectorFormSelectTeamInfo)
      .should('be.visible')
      .should('have.text', i18n.global.t('register.challenge.textTeamInfo'));
    // select table
    cy.dataCy(selectorFormSelectTableTeam).should('be.visible');
  });
}
