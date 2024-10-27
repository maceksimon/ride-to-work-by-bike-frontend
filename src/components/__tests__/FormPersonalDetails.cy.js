import { colors } from 'quasar';
import { setActivePinia, createPinia } from 'pinia';
import FormPersonalDetails from 'components/form/FormPersonalDetails.vue';
import { i18n } from '../../boot/i18n';
import {
  emptyFormPersonalDetails,
  useRegisterChallengeStore,
} from '../../stores/registerChallenge';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormPersonalDetails>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['man', 'woman'], 'global', i18n);
    cy.testLanguageStringsInContext(
      ['hintNickname', 'messageOptionRequired', 'messageTermsRequired'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'hintGender',
        'labelNewsletterAll',
        'labelNewsletterChallenges',
        'labelNewsletterEvents',
        'labelNewsletterMobility',
        'titleGender',
        'titleNewsletter',
      ],
      'form.personalDetails',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      const store = useRegisterChallengeStore();
      cy.wrap(store.getPersonalDetails).then((personalDetails) => {
        expect(personalDetails).to.deep.equal(emptyFormPersonalDetails);
      });
      cy.mount(FormPersonalDetails, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders form field first name', () => {
      cy.dataCy('form-personal-details-first-name').should('be.visible');
    });

    it('renders form field last name', () => {
      cy.dataCy('form-personal-details-last-name').should('be.visible');
    });

    it('renders form field nickname', () => {
      cy.dataCy('form-personal-details-nickname')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
    });

    it('renders radio select gender', () => {
      cy.dataCy('form-personal-details-gender')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
      cy.dataCy('form-personal-details-gender').should(
        'contain',
        i18n.global.t('form.personalDetails.hintGender'),
      );
    });

    it('renders checkbox select newsletter', () => {
      cy.dataCy('form-field-newsletter')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
    });

    it('renders checkbox terms', () => {
      cy.dataCy('form-personal-details-terms').should('be.visible');
      cy.dataCy('form-terms-input').should('have.attr', 'aria-checked', 'true');
      cy.dataCy('form-terms-link').then(($el) => {
        // prevent standard link behaviour
        $el[0].addEventListener('click', (e) => {
          e.preventDefault();
        });
        cy.dataCy('form-terms-link').should('be.visible').click();
        // correctly does NOT check the box when clicking on the link
        cy.dataCy('form-terms-input').should(
          'have.attr',
          'aria-checked',
          'true',
        );
        // restore standard link behaviour
        $el[0].removeEventListener('click', (e) => {
          e.preventDefault();
        });
      });
    });

    it('saves to store when form is filled', () => {
      fillFormPersonalDetails();
      const store = useRegisterChallengeStore();
      cy.fixture('formRegisterChallenge').then(
        (formRegisterChallengeValues) => {
          cy.wrap(store.getPersonalDetails).then((personalDetails) => {
            expect(personalDetails.firstName).to.equal(
              formRegisterChallengeValues.personalDetails.firstName,
            );
            expect(personalDetails.lastName).to.equal(
              formRegisterChallengeValues.personalDetails.lastName,
            );
            expect(personalDetails.nickname).to.equal(
              formRegisterChallengeValues.personalDetails.nickname,
            );
            expect(personalDetails.gender).to.equal(
              formRegisterChallengeValues.personalDetails.gender,
            );
            expect(personalDetails.newsletter).to.deep.equal(
              formRegisterChallengeValues.personalDetails.newsletter,
            );
          });
        },
      );
    });
  });

  function fillFormPersonalDetails() {
    cy.fixture('formRegisterChallenge').then((formRegisterChallengeValues) => {
      const { personalDetails } = formRegisterChallengeValues;
      // Fill first name
      cy.dataCy('form-personal-details-first-name').type(
        personalDetails.firstName,
      );
      // Fill last name
      cy.dataCy('form-personal-details-last-name').type(
        personalDetails.lastName,
      );
      // Fill nickname
      cy.dataCy('form-personal-details-nickname').type(
        personalDetails.nickname,
      );
      // Select gender "Male"
      cy.get('.q-radio').contains(i18n.global.t('global.man')).click();
      // Select newsletter "Challenges"
      cy.get('.q-checkbox')
        .contains(
          i18n.global.t('form.personalDetails.labelNewsletterChallenges'),
        )
        .click();
    });
  }
});
