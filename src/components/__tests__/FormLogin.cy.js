import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

import { useLoginStore } from 'src/stores/login';
import FormLogin from '../login/FormLogin.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import {
  httpSuccessfullStatus,
  httpInternalServerErrorStatus,
} from '../../../test/cypress/support/commonTests';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;
const contactEmail = rideToWorkByBikeConfig.contactEmail;

// selectors
const classSelectorQNotificationMessage = '.q-notification__message';

// variables
const username = 'test@example.com';
const password = 'example123';
const tokenAccess = '1234567890';
const tokenRefresh = '0987654321';
const user = {
  pk: 1,
  username: 'foobar',
  email: 'foo@bar.org',
  first_name: 'Foo',
  last_name: 'Bar',
};
const { apiBase, urlApiLogin } = rideToWorkByBikeConfig;
const apiLoginUrl = `${apiBase}${urlApiLogin}`;

describe('<FormLogin>', () => {
  it('has translation for all strings', () => {
    // Not testing form labels since they are the same in all languages
    cy.testLanguageStringsInContext(
      [
        'titleLogin',
        'titlePasswordReset',
        'descriptionPasswordReset',
        'messageEmailReqired',
        'messageEmailInvalid',
        'messagePasswordRequired',
        'messagePasswordResetReqired',
        'forgottenPassword',
        'submitLogin',
        'submitPasswordReset',
      ],
      'login.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.dataCy('form-title-login')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('login.form.titleLogin'));
    });

    it('renders email field', () => {
      cy.dataCy('form-login-email').should('be.visible');
      cy.dataCy('form-login-email')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password field', () => {
      cy.dataCy('form-login-password')
        .should('be.visible')
        .find('label[for="form-login-password"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('login.form.labelPassword'));
      cy.dataCy('form-login-password')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password show/hide icon', () => {
      cy.dataCy('form-login-password-icon')
        .should('contain', 'visibility')
        .and('have.color', `${colorPrimary}`);
      cy.dataCy('form-login-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-login-password-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('should allow user to reveal and hide password', () => {
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'password');
      cy.dataCy('form-login-password-icon').click();
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'text');
      cy.dataCy('form-login-password-icon').click();
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'password');
    });

    it('renders forgotten password link', () => {
      cy.dataCy('form-login-forgotten-password')
        .should('be.visible')
        .and('have.color', `${colorPrimary}`)
        .and('have.css', 'text-decoration-line', 'underline')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.text', i18n.global.t('login.form.forgottenPassword'));
    });

    it('renders a submit button', () => {
      cy.dataCy('form-login-submit-login')
        .should('be.visible')
        .and('have.color', white)
        .and('have.backgroundColor', `${colorPrimary}`)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitLogin'));
    });

    it('allows to navigate between states', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-button-back').should('be.visible').click();
      cy.dataCy('form-login').should('be.visible');
    });

    it('renders password reset form title', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-title')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('login.form.titlePasswordReset'));
    });

    it('renders password reset form description', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-description')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('login.form.descriptionPasswordReset'));
    });

    it('renders password reset form email input', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
    });

    it('renders password reset form submit button', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-submit')
        .should('be.visible')
        .and('have.color', white)
        .and('have.backgroundColor', `${colorPrimary}`)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitPasswordReset'));
    });

    it('renders final screen on password reset', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset-email')
        .find('input')
        .should('be.visible')
        .type('qw123@qw.com');
      cy.dataCy('form-password-reset-submit').should('be.visible').click();
      cy.dataCy('form-reset-finished').should('be.visible');
      // icon wrapper
      cy.dataCy('form-reset-finished-icon-wrapper')
        .should('be.visible')
        .and('have.backgroundColor', 'rgba(255, 255, 255, 0.5)')
        .and('have.css', 'border-radius', '9999px');
      // icon
      cy.dataCy('form-reset-finished-icon')
        .invoke('height')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon')
        .invoke('width')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon').should('have.color', colorPrimary);
      // title
      cy.dataCy('form-reset-finished-title')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.css', 'margin-top', '24px')
        .and('contain', i18n.global.t('login.form.titleResetFinished'));
      // description
      cy.dataCy('form-reset-finished-description')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and(
          'contain',
          i18n.global.t('login.form.descriptionResetFinished', {
            contactEmail,
          }),
        );
      // prompt
      cy.dataCy('form-reset-finished-prompt')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('login.form.promptWrongEmail'));
      // button
      cy.dataCy('form-reset-finished-submit')
        .should('be.visible')
        .and('have.color', colorPrimary)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitNewPassword'));
    });

    it('validates login form user inputs', () => {
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      // validate password required
      // first make email pass
      cy.dataCy('form-login-email').find('input').type('test@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-password')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('login.form.messagePasswordRequired'));
    });
  });

  context('desktop - login store', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('allows to save tokens and user into store', () => {
      const store = useLoginStore();
      store.setAccessToken(tokenAccess);
      store.setRefreshToken(tokenRefresh);
      store.setUser(user);
      expect(store.getAccessToken).to.equal(tokenAccess);
      expect(store.getRefreshToken).to.equal(tokenRefresh);
      expect(store.getUser).to.deep.equal(user);
    });

    it('shows error if login is called and username is not set', () => {
      const store = useLoginStore();
      cy.wrap(store.login({ username: '', password })).then((result) => {
        expect(result).to.equal(null);
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.form.messageEmailReqired'));
      });
    });

    it('shows error if login is called and password is not set', () => {
      const store = useLoginStore();
      cy.wrap(store.login({ username, password: '' })).then((result) => {
        expect(result).to.equal(null);
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.form.messageEmailReqired'));
      });
    });

    it('shows error if API call fails (error has message)', () => {
      const store = useLoginStore();
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpInternalServerErrorStatus,
      }).then(() => {
        cy.wrap(store.login({ username, password })).then((result) => {
          expect(result).to.equal(null);
          cy.get(classSelectorQNotificationMessage)
            .should('be.visible')
            .and('contain', i18n.global.t('login.apiMessageErrorWithMessage'))
            .and('contain', httpInternalServerErrorStatus);
        });
      });
    });

    it('calls API and set token on successful login', () => {
      // intercept login API call
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpSuccessfullStatus,
        body: { access_token: tokenAccess, refresh_token: tokenRefresh, user },
      }).then(() => {
        const store = useLoginStore();
        cy.wrap(store.login({ username, password })).then((response) => {
          console.log(response);
          expect(response).to.deep.equal({
            access_token: tokenAccess,
            refresh_token: tokenRefresh,
            user,
          });
          expect(store.getAccessToken).to.equal(tokenAccess);
          expect(store.getRefreshToken).to.equal(tokenRefresh);
          expect(store.getUser).to.deep.equal(user);
        });
      });
    });

    it('calls API and shows error if login fails', () => {
      const store = useLoginStore();
      // intercept login API call
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpInternalServerErrorStatus,
      }).then(() => {
        cy.wrap(store.login({ username, password })).then(() => {
          cy.get(classSelectorQNotificationMessage)
            .should('be.visible')
            .and('contain', i18n.global.t('login.apiMessageError'));
        });
      });
    });
  });
});
