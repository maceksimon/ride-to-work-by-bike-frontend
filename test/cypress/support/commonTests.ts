import { colors } from 'quasar';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const layoutBackgroundImageSelector = 'layout-background-image';

/**
 * Basic tests for Language Switcher
 *
 * Used in `register_challenge.spec.cy.js` and `login.spec.cy.js`
 */
export const testLanguageSwitcher = (): void => {
  it('allows user to switch language', () => {
    let i18n;
    cy.window().should('have.property', 'i18n');
    cy.window()
      .then((win) => {
        i18n = win.i18n;
      })
      .then(() => {
        const locales = i18n.global.availableLocales;
        const initialActiveLocale = i18n.global.locale;

        // active language has active class
        cy.dataCy('switcher-' + initialActiveLocale)
          .find('.q-btn')
          .should('have.class', 'bg-secondary');

        locales.forEach((locale) => {
          if (locale !== initialActiveLocale) {
            // changing the language
            cy.dataCy('switcher-' + locale)
              .should('exist')
              .and('be.visible')
              .find('.q-btn')
              .click();
            // old language becomes inactive
            cy.dataCy('switcher-' + initialActiveLocale)
              .find('.q-btn')
              .should('have.class', 'bg-white');
            // new language becomes active
            cy.dataCy('switcher-' + locale)
              .find('.q-btn')
              .should('have.class', 'bg-secondary');
          }
        });
      });
  });
};

/**
 * Test the visibility of a background image
 * Note that it is a `fixed` image, so we cannot test `be.visible`
 */
export const testBackgroundImage = (): void => {
  it('should have a background image', () => {
    cy.task('getAppConfig', process).then((config) => {
      cy.dataCy(layoutBackgroundImageSelector)
        .invoke('width')
        .should('be.greaterThan', 0);
      cy.dataCy(layoutBackgroundImageSelector)
        .invoke('height')
        .should('be.greaterThan', 0);
      cy.dataCy(layoutBackgroundImageSelector).should('have.css', 'mask-image');
      cy.dataCy(layoutBackgroundImageSelector)
        .find('img')
        .should('have.attr', 'src', config.urlLoginRegisterBackgroundImage);
      // test background image on different screen sizes
      cy.viewport('iphone-3');
      cy.dataCy(layoutBackgroundImageSelector).should('not.exist');
      cy.viewport('iphone-xr');
      cy.dataCy(layoutBackgroundImageSelector).should('not.exist');
      cy.viewport('macbook-11');
      cy.dataCy(layoutBackgroundImageSelector).should('exist');
      cy.viewport('macbook-16');
      cy.dataCy(layoutBackgroundImageSelector).should('exist');
    });
  });
};

export const testPasswordInputReveal = (identifier: string): void => {
  it('should allow user to reveal and hide password', () => {
    // password hiden
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'password');
    // reveal
    cy.dataCy(`${identifier}-icon`).click();
    // password revealed
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'text');
    // hide
    cy.dataCy(`${identifier}-icon`).click();
    // password hiden
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'password');
  });
};

/**
 * Test styles for title in route list
 * Used in `RouteListDisplay.cy.js` and `RouteListEdit.cy.js`
 */
export const testRouteListDayDate = (): void => {
  it('renders route list day and date', () => {
    cy.dataCy('route-list-day-date')
      .should('be.visible')
      .and('have.css', 'font-size', '18px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
  });
};

export const httpSuccessfullStatus = 200;
export const httpInternalServerErrorStatus = 500;
export const httpTooManyRequestsStatus = 429;
export const httpTooManyRequestsStatusMessage = `HTTP status code ${httpTooManyRequestsStatus} Too Many Requests ("rate limiting").`;
export const failOnStatusCode = false;
