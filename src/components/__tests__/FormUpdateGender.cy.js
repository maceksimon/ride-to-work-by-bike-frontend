import FormUpdateGender from 'components/form/FormUpdateGender.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorFormUpdateGender = 'form-update-gender';
const selectorFormLabel = 'form-label';
const selectorFormGender = 'form-gender';
const selectorFormButtonCancel = 'form-button-cancel';
const selectorFormButtonSave = 'form-button-save';

describe('<FormUpdateGender>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelGender'], 'form', i18n);
    cy.testLanguageStringsInContext(
      ['discardChanges', 'edit'],
      'navigation',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormUpdateGender, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormUpdateGender, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorFormUpdateGender).should('be.visible');
    cy.dataCy(selectorFormLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelGender'));
    cy.dataCy(selectorFormGender).should('be.visible');
    cy.dataCy(selectorFormButtonCancel)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.discardChanges'));
    cy.dataCy(selectorFormButtonSave)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.edit'));
  });
}
