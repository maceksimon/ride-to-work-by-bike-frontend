import { colors } from 'quasar';
import BannerRoutes from '../homepage/BannerRoutes.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { routesConf } from '../../router/routes_conf';

// colors
const { getPaletteColor, changeAlpha } = colors;
const grey10 = getPaletteColor('grey-10');
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const secondary = getPaletteColor('secondary');
const secondaryOpacity = changeAlpha(
  secondary,
  rideToWorkByBikeConfig.colorSecondaryBackgroundOpacity,
);

// selectors
const selectorBannerRoutes = 'banner-routes-card';
const selectorImage = 'banner-routes-image';
const selectorTitle = 'banner-routes-title';
const selectorButton = 'banner-routes-button-add-routes';
const selectorButtonIcon = 'banner-routes-button-icon';
const selectorSectionTitle = 'banner-routes-section-title';
const selectorSectionButton = 'banner-routes-section-button';

// variables
const { borderRadiusCard } = rideToWorkByBikeConfig;
const routesCount = 3;
const iconSize = 24;

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
        cy.dataCy(selectorTitle).should('contain', routesCount);
      });
    });

    it('renders "add routes" button', () => {
      cy.dataCy(selectorButton)
        .should('be.visible')
        .and('contain', i18n.global.t('index.bannerRoutes.addRoutes'));
    });

    it('renders title section and button section side to side', () => {
      cy.testElementPercentageWidth(cy.dataCy(selectorSectionTitle), 50);
      cy.testElementPercentageWidth(cy.dataCy(selectorSectionButton), 50);
      cy.testElementsSideBySide(selectorSectionTitle, selectorSectionButton);
    });

    it('renders image and title side to side', () => {
      cy.testElementsSideBySide(selectorImage, selectorTitle);
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
        cy.dataCy(selectorTitle).should(
          'contain',
          i18n.global.t('index.bannerRoutes.titleStart'),
        );
      });
    });

    it('renders "first routes" button', () => {
      cy.dataCy(selectorButton)
        .should('be.visible')
        .and('contain', i18n.global.t('index.bannerRoutes.addFirstRoutes'));
    });

    it('renders title section and button section stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy(selectorSectionTitle), 100);
      cy.testElementPercentageWidth(cy.dataCy(selectorSectionButton), 100);
      cy.testElementsStacked(selectorSectionTitle, selectorSectionButton);
    });

    it('renders image and title side to side', () => {
      cy.testElementsSideBySide(selectorImage, selectorTitle);
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
        cy.dataCy(selectorTitle).should('contain', routesCount);
      });
    });

    it('renders "add routes" button', () => {
      cy.dataCy(selectorButton)
        .should('be.visible')
        .and('contain', i18n.global.t('index.bannerRoutes.addRoutes'));
    });

    it('renders title section and button section stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy(selectorSectionTitle), 100);
      cy.testElementPercentageWidth(cy.dataCy(selectorSectionButton), 100);
    });

    it('renders image and title stacked', () => {
      cy.testElementsStacked(selectorImage, selectorTitle);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorBannerRoutes)
      .should('be.visible')
      .and('have.css', 'border-radius', borderRadiusCard)
      .and('have.backgroundColor', secondaryOpacity);
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
      .and('have.css', 'padding', '16px');
    // button icon
    cy.dataCy(selectorButtonIcon)
      .should('be.visible')
      .and('have.color', white)
      .and('have.css', 'margin-right', '8px')
      .and('contain', 'add');
    cy.dataCy(selectorButtonIcon).invoke('height').should('equal', iconSize);
    cy.dataCy(selectorButtonIcon).invoke('width').should('equal', iconSize);
  });

  it('renders correct button link', () => {
    cy.dataCy(selectorButton)
      .invoke('attr', 'href')
      .should('contain', routesConf['routes_list'].children.fullPath);
  });
}
