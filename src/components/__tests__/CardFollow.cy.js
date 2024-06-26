import { colors } from 'quasar';

import CardFollow from '../homepage/CardFollow.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const blueGrey7 = getPaletteColor('blue-grey-7');

const { borderRadiusCard } = rideToWorkByBikeConfig;

describe('<CardFollow>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.cardFollow', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listCardsFollow').then((listCardsFollow) => {
        cy.wrap(listCardsFollow[0]).as('card');
        cy.mount(CardFollow, {
          props: {
            card: listCardsFollow[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listCardsFollow').then((listCardsFollow) => {
        cy.wrap(listCardsFollow[0]).as('card');
        cy.mount(CardFollow, {
          props: {
            card: listCardsFollow[0],
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('has white background', () => {
    cy.window().then(() => {
      cy.dataCy('card-follow').should('have.backgroundColor', white);
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card-follow').should(
        'have.css',
        'border-radius',
        borderRadiusCard,
      );
    });
  });

  it('has border', () => {
    cy.window().then(() => {
      cy.dataCy('card-follow').should(
        'have.css',
        'border',
        '1px solid rgb(220, 225, 237)', // config colorGrayMiddle
      );
    });
  });

  it('has no shadow', () => {
    cy.window().then(() => {
      cy.dataCy('card-follow').should('have.css', 'box-shadow', 'none');
    });
  });

  it('has padding 16px', () => {
    cy.window().then(() => {
      cy.dataCy('card-follow').should('have.css', 'padding', '16px');
    });
  });

  it('has wrapper with top padding', () => {
    cy.window().then(() => {
      cy.dataCy('card-follow-wrapper').should(
        'have.css',
        'padding-top',
        '48px',
      );
    });
  });

  it('renders title', () => {
    cy.get('@card').then((card) => {
      cy.window().then(() => {
        cy.dataCy('card-follow-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '500')
          .and('have.color', grey10)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });
  });

  it('renders handle', () => {
    cy.get('@card').then((card) => {
      cy.window().then(() => {
        cy.dataCy('card-follow-handle')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', blueGrey7)
          .and('contain', card.handle)
          .then(($title) => {
            expect($title.text()).to.equal(card.handle);
          });
      });
    });
  });

  it('renders image', () => {
    cy.get('@card').then((card) => {
      cy.window().then(() => {
        cy.dataCy('card-follow-avatar')
          .should('be.visible')
          .find('.q-avatar')
          .should('have.css', 'border-radius', '50%')
          .and('have.css', 'width', '96px')
          .and('have.css', 'height', '96px')
          .and('have.css', 'margin-top', '-64px');
        cy.dataCy('card-follow-image')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(card.image.src);
          });
        cy.dataCy('card-follow-image').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });
  });
}
