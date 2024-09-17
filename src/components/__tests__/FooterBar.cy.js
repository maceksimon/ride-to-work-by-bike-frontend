import { colors } from 'quasar';
import FooterBar from '../global/FooterBar.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
} from '../../../test/cypress/support/commonTests';

// colors
const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');
const primary = getPaletteColor('primary');

// variables
const iconSize = 24;

// Fix make request user-agent header on the macOS with Google Chrome web browser
const urlTwitterUserAgentHeader =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) \
AppleWebKit/537.36 (KHTML, like Gecko) \
Chrome/119.0.0.0 Safari/537.36';

describe('<FooterBar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FooterBar, {
        props: {
          copyright: ['Tato aplikace je svobodný software.'],
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders Auto*Mat logo text', () => {
      cy.dataCy('footer-challenge-organizer')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey8)
        .and('contain', i18n.global.t('footer.textChallengeOrganizer'));
    });

    it('renders copyright list', () => {
      cy.window().then(() => {
        cy.dataCy('footer-copyright-list-desktop')
          .should('be.visible')
          .and('have.css', 'display', 'flex')
          .and('have.css', 'flex-wrap', 'wrap')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey8);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FooterBar, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders copyright list', () => {
      cy.window().then(() => {
        cy.dataCy('footer-copyright-list-mobile')
          .should('be.visible')
          .and('have.css', 'display', 'flex')
          .and('have.css', 'flex-wrap', 'wrap')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey8);
      });
    });
  });
});

function coreTests() {
  it('renders RTWBB logo', () => {
    cy.window().then(() => {
      cy.dataCy('footer-logo')
        .should('be.visible')
        .and('have.css', 'width', '142px')
        .and('have.css', 'height', '40px');
    });
  });

  it('renders Auto*Mat logo with separator and text', () => {
    cy.window().then(() => {
      // link
      cy.dataCy('footer-auto-mat-logo-link')
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlAutoMat);
      cy.dataCy('footer-auto-mat-logo')
        .should('be.visible')
        .and('have.css', 'width', '74px')
        .and('have.css', 'height', '28px');
    });
  });

  it('renders separator between logos', () => {
    // separator
    cy.dataCy('footer-logo-separator').should('be.visible');
  });

  it('renders social menu', () => {
    cy.window().then(() => {
      cy.dataCy('footer-social-menu')
        .should('be.visible')
        .and('have.css', 'display', 'flex')
        .and('have.css', 'align-items', 'center');
      cy.dataCy('footer-social-menu-button')
        .should('be.visible')
        .and('have.css', 'border-radius', '50%');
      cy.dataCy('footer-social-menu-link-facebook')
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlFacebook);
      cy.dataCy('footer-social-menu-link-instagram')
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlInstagram);
      cy.dataCy('footer-social-menu-link-twitter')
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlTwitter);
      cy.dataCy('footer-social-menu-link-youtube')
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlYoutube);
      cy.dataCy('footer-social-menu-icon')
        .should('be.visible')
        .and('have.color', primary);
      cy.dataCy('footer-social-menu-icon')
        .invoke('height')
        .should('be.equal', iconSize);
      cy.dataCy('footer-social-menu-icon')
        .invoke('width')
        .should('be.equal', iconSize);
    });
  });

  it('renders social menu items side by side', () => {
    cy.testElementsSideBySide(
      'footer-social-menu-link-facebook',
      'footer-social-menu-link-instagram',
    );
    cy.testElementsSideBySide(
      'footer-social-menu-link-instagram',
      'footer-social-menu-link-twitter',
    );
    cy.testElementsSideBySide(
      'footer-social-menu-link-twitter',
      'footer-social-menu-link-youtube',
    );
  });

  it('provides valid URLs for social links', () => {
    cy.request({
      url: rideToWorkByBikeConfig.urlFacebook,
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
    cy.request({
      url: rideToWorkByBikeConfig.urlInstagram,
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
    cy.request({
      url: rideToWorkByBikeConfig.urlTwitter,
      headers: { 'user-agent': urlTwitterUserAgentHeader },
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
    cy.request({
      url: rideToWorkByBikeConfig.urlYoutube,
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
  });

  it('renders language switcher', () => {
    cy.window().then(() => {
      cy.dataCy('language-switcher-footer').should('be.visible');
    });
  });

  it('renders a go to top button', () => {
    cy.window().then(() => {
      // button with icon
      cy.dataCy('footer-top-button')
        .should('be.visible')
        .and('have.color', primary);
      // text
      cy.dataCy('footer-top-button-text')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', primary);
    });
  });

  it('renders button and text for scrolling to top side by side', () => {
    cy.testElementsSideBySide('footer-top-button', 'footer-top-button-text');
  });

  it('renders RTWBB logo and Auto*Mat section side by side', () => {
    cy.testElementsSideBySide('footer-logo', 'footer-auto-mat');
  });
}
