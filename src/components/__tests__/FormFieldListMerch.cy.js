import { colors } from 'quasar';
import FormFieldListMerch from 'components/form/FormFieldListMerch.vue';
import { i18n } from '../../boot/i18n';
import { Gender } from 'components/types/Profile';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldListMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelNoMerch', 'hintNoMerch'],
      'form.merch',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [Gender.male, Gender.female],
      'global',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      // intercept API calls
      cy.interceptMerchandiseGetApi(rideToWorkByBikeConfig, i18n);

      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('macbook-16');

      // wait for API responses
      cy.waitForMerchandiseApi();
    });

    it('renders component', () => {
      cy.dataCy('no-merch-label')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey10);
      cy.dataCy('no-merch-hint')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey8);
      // component is visible
      cy.dataCy('list-merch').should('be.visible');
      // female cards are visible
      cy.dataCy('form-card-merch-female').should('be.visible');
      // tabs are visible
      cy.dataCy('list-merch-tab-female').should('be.visible');
      cy.dataCy('list-merch-tab-male').should('be.visible');
    });

    it('should render 3 cards in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        33,
      );
    });

    it('allows to hide merch options', () => {
      cy.dataCy('no-merch').click();
      cy.dataCy('list-merch').should('not.be.visible');
      cy.dataCy('no-merch').click();
      cy.dataCy('list-merch').should('be.visible');
    });

    it('allows to switch between tabs', () => {
      cy.dataCy('list-merch-tab-male').click();
      cy.dataCy('form-card-merch-female').should('not.exist');
      cy.dataCy('form-card-merch-male').should('be.visible');
      cy.dataCy('list-merch-tab-female').click();
      cy.dataCy('form-card-merch-female').should('be.visible');
      cy.dataCy('form-card-merch-male').should('not.exist');
    });

    it('allows user to select merch option (heading click)', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        const item = response.results[0];
        // open dialog
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="form-card-merch-link"]')
          .click();
        cy.dataCy('dialog-merch')
          .should('be.visible')
          .within(() => {
            // verify dialog content from fixture data
            cy.contains(item.name).should('be.visible');
            cy.contains(item.description).should('be.visible');
          });
        cy.dataCy('slider-merch').should('be.visible');
        // close dialog
        cy.dataCy('dialog-close').click();
        // first option is selected
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-selected"]')
          .should('be.visible');
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .should('not.exist');
      });
    });

    it('allows user to select merch option (button click)', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        const item = response.results[0];
        // open dialog
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .click();
        cy.dataCy('dialog-merch')
          .should('be.visible')
          .within(() => {
            // verify dialog content from fixture data
            cy.contains(item.name).should('be.visible');
            cy.contains(item.description).should('be.visible');
          });
        cy.dataCy('slider-merch').should('be.visible');
        // close dialog
        cy.dataCy('dialog-close').click();
        // first option is selected
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-selected"]')
          .should('be.visible');
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .should('not.exist');
      });
    });

    it('changes tabs when changing gender radio', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find((item) => item.id === 135);
        // select last merch option
        cy.contains(item.name).click();
        cy.dataCy('dialog-merch').should('be.visible');
        cy.dataCy('dialog-merch').within(() => {
          // select size (to make sure both gender options are available)
          cy.dataCy('form-field-merch-size')
            .contains(item.size)
            .should('be.visible')
            .click();
        });
        // change gender setting
        cy.dataCy('form-field-merch-gender')
          .contains(i18n.global.t('global.male'))
          .should('be.visible')
          .click();
        // close dialog
        cy.dataCy('dialog-close').click();
        // we should see male options
        cy.dataCy('form-card-merch-male').should('be.visible');
        cy.dataCy('form-card-merch-female').should('not.exist');
        // same merch type selected
        cy.get('[data-selected="true"]').should('contain', item.name);
      });
    });

    it('when option with sizes is selected, shows size selection under the cards', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find((item) => item.id === 135);
        cy.contains(item.name).click();
        cy.dataCy('dialog-merch').should('be.visible');
        cy.dataCy('dialog-merch').within(() => {
          cy.dataCy('form-field-merch-size').should('be.visible');
        });
        // close dialog
        cy.dataCy('dialog-close').click();
        // size selection is visible
        cy.dataCy('form-field-merch-size').should('be.visible');
        // select different size
        cy.dataCy('form-field-merch-size');
      });
    });

    it('when option is selected, disables the merch card interaction', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find((item) => item.id === 135);
        cy.contains(item.name).click();
        cy.dataCy('dialog-merch').should('be.visible');
        cy.dataCy('dialog-merch').within(() => {
          cy.dataCy('form-field-merch-size').should('be.visible');
        });
        // close dialog
        cy.dataCy('dialog-close').click();
        // option is selected
        cy.get('[data-selected="true"]').should('contain', item.name);
        // if title is clicked dialog is not shown
        cy.get('[data-selected="true"]').contains(item.name).click();
        cy.dataCy('dialog-merch').should('not.exist');
        // button is disabled
        cy.get('[data-selected="true"]').find('button').should('be.disabled');
      });
    });

    // DISABLED: Need to ensure that size is not selected at the beginning of the test.
    // it('validates dialog settings', () => {
    //   // open dialog
    //   cy.dataCy('form-card-merch-female')
    //     .first()
    //     .find('[data-cy="button-more-info"]')
    //     .click();
    //   cy.dataCy('dialog-merch').should('be.visible');
    //   // invalid settings (size not selected)
    //   cy.dataCy('dialog-body').scrollTo('bottom', { ensureScrollable: false });
    //   cy.dataCy('button-submit-merch').should('be.visible').click();
    //   // dialog does not close
    //   cy.dataCy('dialog-merch').should('be.visible');
    //   // scope size selection to dialog because input is duplicated in card
    //   cy.dataCy('dialog-merch').within(() => {
    //     // select size
    //     cy.dataCy('form-field-merch-size')
    //       .should('be.visible')
    //       .find('.q-radio')
    //       .first()
    //       .click();
    //   });
    //   // close dialog
    //   cy.dataCy('dialog-body').scrollTo('bottom', { ensureScrollable: false });
    //   cy.dataCy('button-submit-merch').should('be.visible').click();
    //   // dialog closes
    //   cy.dataCy('dialog-merch').should('not.exist');
    // });
  });

  context('mobile', () => {
    beforeEach(() => {
      // intercept API calls
      cy.interceptMerchandiseGetApi(rideToWorkByBikeConfig, i18n);

      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('iphone-6');

      // wait for API responses
      cy.waitForMerchandiseApi();
    });

    it('should render 1 card in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        100,
      );
    });
  });
});
