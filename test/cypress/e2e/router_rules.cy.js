import { routesConf } from '../../../src/router/routes_conf';
import {
  loginChallengeInactive,
  loginChallengeActive,
  systemTimeChallenge,
  systemTimeChallengeInactive,
} from '../support/commonTests';

describe('Router rules', () => {
  context('challenge inactive', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeInactive);
      cy.visit('#' + routesConf['login']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('after login, redirects to challenge inactive page', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          loginChallengeInactive(config, i18n);
          cy.url().should('include', routesConf['challenge_inactive']['path']);
          // try to access other pages
          cy.visit('#' + routesConf['prizes']['path']);
          cy.url().should('not.include', routesConf['prizes']['path']);
          cy.url().should('include', routesConf['challenge_inactive']['path']);
        });
      });
    });
  });

  context('challenge active', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallenge);
      cy.visit('#' + routesConf['login']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('after login, redirects to home page', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          loginChallengeActive(config, i18n);
          cy.clock().then((clock) => {
            clock.tick(1000);
            cy.url().should('not.include', routesConf['login']['path']);
            cy.url().should('not.include', routesConf['verify_email']['path']);
            cy.url().should(
              'not.include',
              routesConf['challenge_inactive']['path'],
            );
            cy.url().should('include', routesConf['home']['path']);
          });
        });
      });
    });
  });
});
