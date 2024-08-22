import { colors } from 'quasar';
import BannerRoutes from '../homepage/BannerRoutes.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');

// selectors
const selectorBannerRoutes = 'banner-routes-card';
const selectorTitle = 'banner-routes-title';
const selectorButton = 'banner-routes-button-add-routes';

// variables
const { borderRadiusCard, colorSecondaryOpacity } = rideToWorkByBikeConfig;
const routesCount = 3;

describe('<BannerRoutes>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'titleStart', 'addRoutes', 'addFirstRoutes'],
      'index.bannerRoutes',
      i18n,
    );
  });

  context('desktop default variant', () => {
    beforeEach(() => {
      cy.mount(BannerRoutes, {
        props: {
          routesCount,
          variant: 'default',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders title with the number of missing routes', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title').should('contain', routesCount);
      });
    });

    it('renders "add routes" button', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .should('be.visible')
        .and('contain', i18n.global.t('index.bannerRoutes.addRoutes'));
    });

    it('renders button icon with correct spacing', () => {
      cy.dataCy('banner-routes-button-icon')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'margin-right', '8px')
        .and('contain', 'add');
      cy.dataCy('banner-routes-button-icon')
        .invoke('height')
        .should('equal', 24);
      cy.dataCy('banner-routes-button-icon')
        .invoke('width')
        .should('equal', 24);
    });

    it('renders title section and button section side to side', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-title'),
        67,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-button'),
        33,
      );
    });
  });

  context('desktop start variant', () => {
    beforeEach(() => {
      cy.mount(BannerRoutes, {
        props: {
          routesCount,
          variant: 'start',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders title width the "start" message', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title').should(
          'contain',
          i18n.global.t('index.bannerRoutes.titleStart'),
        );
      });
    });

    it('renders "first routes" button', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .should('be.visible')
        .and('contain', i18n.global.t('index.bannerRoutes.addFirstRoutes'));
    });

    it('renders button icon with correct spacing', () => {
      cy.dataCy('banner-routes-button-icon')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'margin-right', '8px')
        .and('contain', 'add');
      cy.dataCy('banner-routes-button-icon')
        .invoke('height')
        .should('equal', 24);
      cy.dataCy('banner-routes-button-icon')
        .invoke('width')
        .should('equal', 24);
    });

    it('renders title section and button section stacked', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-title'),
        100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-button'),
        100,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerRoutes, {
        props: {
          routesCount,
          variant: 'default',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders title with the number of missing routes', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title').should('contain', routesCount);
      });
    });

    it('renders "add routes" button', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .should('be.visible')
        .and('contain', i18n.global.t('index.bannerRoutes.addRoutes'));
    });

    it('renders button icon with correct spacing', () => {
      cy.dataCy('banner-routes-button-icon')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'margin-right', '8px')
        .and('contain', 'add');
      cy.dataCy('banner-routes-button-icon')
        .invoke('height')
        .should('equal', 24);
      cy.dataCy('banner-routes-button-icon')
        .invoke('width')
        .should('equal', 24);
    });

    it('renders title section and button section stacked', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-title'),
        100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-button'),
        100,
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorBannerRoutes)
      .should('be.visible')
      .and('have.css', 'border-radius', borderRadiusCard)
      .and('have.backgroundColor', colorSecondaryOpacity);
    // title
    cy.dataCy(selectorTitle)
      .should('have.css', 'font-size', '24px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    // button
    cy.dataCy(selectorButton)
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('have.css', 'font-weight', '700')
      .and('have.css', 'text-transform', 'uppercase')
      .and('have.color', white)
      .and('have.backgroundColor', primary)
      .and('have.css', 'border-radius', '28px')
      .and('have.css', 'padding-top', '16px')
      .and('have.css', 'padding-left', '24px')
      .and('have.css', 'padding-bottom', '16px')
      .and('have.css', 'padding-right', '24px');
  });

  it('renders button icon with correct spacing', () => {
    cy.dataCy('banner-routes-button-icon')
      .should('be.visible')
      .and('have.color', white)
      .and('have.css', 'margin-right', '8px')
      .and('contain', 'add');
    cy.dataCy('banner-routes-button-icon').invoke('height').should('equal', 24);
    cy.dataCy('banner-routes-button-icon').invoke('width').should('equal', 24);
  });
}
