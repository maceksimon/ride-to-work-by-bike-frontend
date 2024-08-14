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

// variables
const slotButton = 'Slot Button';
const slotForm = 'Slot Form';
const slotLabel = 'Slot Label';
const slotValue = 'Slot Value';
const props = {
  description: 'Description',
  editable: true,
  label: 'Label',
  value: 'Value',
  emptyLabel: 'EmptyLabel',
  dialogTitle: 'DialogTitle',
};

describe('<DetailsItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['edit'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          form: `<div>${slotForm}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    propLabelTests();
    propValueTests();
    propDescriptionTests();
    editableTests();
  });

  context('desktop - slot label', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          label: `<div>${slotLabel}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    slotLabelTests();
    propValueTests();
    propDescriptionTests();
  });

  context('desktop - slot value', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          value: `<div>${slotValue}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    propLabelTests();
    slotValueTests();
  });

  context('desktop - slot button', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          button: `<span>${slotButton}</span>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    propLabelTests();
    propValueTests();
    propDescriptionTests();
    slotButtonTests();
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
        slots: {
          form: `<div>${slotForm}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    emptyTests();
    editableTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          form: `<div>${slotForm}</div>`,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    propLabelTests();
    propValueTests();
    propDescriptionTests();
    editableTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorDetailsItem).should('be.visible');
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

function propDescriptionTests() {
  it('renders description', () => {
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
    cy.dataCy(selectorDialogEdit).should('contain', slotForm);
  });
}

function slotButtonTests() {
  it('renders slot button', () => {
    cy.dataCy(selectorDetailsItemEdit).should('contain', slotButton);
  });
}

function propLabelTests() {
  it('renders prop label', () => {
    cy.dataCy(selectorDetailsItemLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', props.label);
  });
}

function slotLabelTests() {
  it('renders slot label', () => {
    cy.dataCy(selectorDetailsItemLabel).should('contain', slotLabel);
  });
}

function propValueTests() {
  it('renders prop value', () => {
    cy.dataCy(selectorDetailsItemValue)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', props.value);
  });
}

function slotValueTests() {
  it('renders slot value', () => {
    cy.dataCy(selectorDetailsItemValue).should('contain', slotValue);
  });
}
