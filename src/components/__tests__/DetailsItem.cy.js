import DetailsItem from 'components/profile/DetailsItem.vue';
import { i18n } from '../../boot/i18n';

const selectorDetailsItem = 'details-item';
const selectorDetailsItemDescription = 'details-item-description';
const selectorDetailsItemLabel = 'details-item-label';
const selectorDetailsItemValue = 'details-item-value';
const selectorDetailsItemEdit = 'details-item-edit';
const selectorDialogEdit = 'dialog-edit';

describe('<DetailsItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['buttonEdit'], 'global', i18n);
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
      cy.mount(DetailsItem, {
        props: {
          description: 'Description',
          editable: true,
          label: 'Label',
          value: 'Value',
          emptyLabel: 'EmptyLabel',
          dialogTitle: 'DialogTitle',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    editableTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props: {
          description: 'Description',
          editable: true,
          label: 'Label',
          value: 'Value',
          emptyLabel: 'EmptyLabel',
          dialogTitle: 'DialogTitle',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    editableTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorDetailsItem).should('be.visible');
    cy.dataCy(selectorDetailsItemDescription).should('be.visible');
    cy.dataCy(selectorDetailsItemLabel).should('be.visible');
    cy.dataCy(selectorDetailsItemValue).should('be.visible');
  });
}

function editableTests() {
  it('renders edit button and dialog', () => {
    cy.dataCy(selectorDetailsItemEdit).should('be.visible').click();
    cy.dataCy(selectorDialogEdit).should('be.visible');
    cy.dataCy(selectorDialogEdit).should('contain', 'DialogTitle');
  });
}
