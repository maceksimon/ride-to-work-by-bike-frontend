import { colors } from 'quasar';
import DetailsItem from 'components/profile/DetailsItem.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const grey7 = getPaletteColor('grey-7');

// selectors
const selectorDetailsItem = 'details-item';
const selectorDetailsItemDescription = 'details-item-description';
const selectorDetailsItemLabel = 'details-item-label';
const selectorDetailsItemValue = 'details-item-value';
const selectorDetailsItemEdit = 'details-item-edit';
const selectorDetailsItemEmpty = 'details-item-empty';
const selectorDialogEdit = 'dialog-edit';

describe('<DetailsItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['edit'], 'navigation', i18n);
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

  context('desktop - empty', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props: {
          description: 'Description',
          editable: true,
          label: 'Label',
          value: '',
          emptyLabel: 'EmptyLabel',
          dialogTitle: 'DialogTitle',
        },
      });
      cy.viewport('macbook-16');
    });

    emptyTests();
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
    cy.dataCy(selectorDetailsItemLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
    cy.dataCy(selectorDetailsItemValue)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    cy.dataCy(selectorDetailsItemDescription)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey7);
  });
}

function emptyTests() {
  it('renders component', () => {
    cy.dataCy(selectorDetailsItem).should('be.visible');
    cy.dataCy(selectorDetailsItemLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
    cy.dataCy(selectorDetailsItemEmpty)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.css', 'font-style', 'italic')
      .and('have.color', grey7);
    cy.dataCy(selectorDetailsItemDescription)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey7);
  });
}

function editableTests() {
  it('renders edit button and dialog', () => {
    cy.dataCy(selectorDetailsItemEdit).should('be.visible').click();
    cy.dataCy(selectorDialogEdit).should('be.visible');
    cy.dataCy(selectorDialogEdit).should('contain', 'DialogTitle');
  });
}
