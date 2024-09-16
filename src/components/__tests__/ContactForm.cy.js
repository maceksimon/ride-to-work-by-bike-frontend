import { colors } from 'quasar';
import ContactForm from '../global/ContactForm.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const selectorContactFormSubject = 'contact-form-subject';
const selectorContactFormMessage = 'contact-form-message';
const selectorContactFormFile = 'contact-form-file';
const selectorContactFormFileIcon = 'contact-form-file-icon';
const selectorContactFormEmail = 'contact-form-email';
const selectorContactFormSubmit = 'contact-form-submit';

// variables
const borderRadius = '8px';
const fileLabelFontSize = '14px';
const submitButtonBorderRadius = '28px';

describe('<ContactForm>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'subject',
        'subjectRequired',
        'message',
        'messageRequired',
        'file',
        'email',
        'emailRequired',
        'submit',
      ],
      'index.contact',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ContactForm, {});
    });

    it('should render contact-form-subject field', () => {
      cy.dataCy(selectorContactFormSubject).should('be.visible');
    });

    it('should render contact-form-message field', () => {
      cy.dataCy(selectorContactFormMessage)
        .should('be.visible')
        .find('label[for="contact-form-message"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('index.contact.message'));
      cy.dataCy(selectorContactFormMessage)
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadius);
    });

    it('should render contact-form-file field', () => {
      cy.dataCy(selectorContactFormFileIcon)
        .should('be.visible')
        .and('have.color', grey8)
        .and('contain', 'attachment');
      cy.dataCy(selectorContactFormFile)
        .find('.q-field__label')
        .should('be.visible')
        .and('have.css', 'font-size', fileLabelFontSize)
        .and('have.color', grey10)
        .and('have.text', i18n.global.t('index.contact.file'));
    });

    it('should render contact-form-email field', () => {
      cy.dataCy(selectorContactFormEmail).should('be.visible');
    });

    it('should render a submit button', () => {
      cy.dataCy(selectorContactFormSubmit)
        .should('be.visible')
        .and('have.css', 'border-radius', submitButtonBorderRadius)
        .and('have.backgroundColor', primary)
        .and('have.text', i18n.global.t('index.contact.submit'));
    });
  });
});
