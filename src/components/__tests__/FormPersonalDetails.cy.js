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

// selectors
const selectorFirstName = 'form-personal-details-first-name';
const selectorLastName = 'form-personal-details-last-name';
const selectorNickname = 'form-personal-details-nickname';
const selectorGender = 'form-personal-details-gender';
const selectorNewsletter = 'form-personal-details-newsletter';
const selectorTerms = 'form-personal-details-terms';
const selectorTermsInput = 'form-terms-input';
const selectorTermsLink = 'form-terms-link';

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
      cy.dataCy(selectorFirstName).should('be.visible');
    });

    it('renders form field last name', () => {
      cy.dataCy(selectorLastName).should('be.visible');
    });

    it('renders form field nickname', () => {
      cy.dataCy(selectorNickname)
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
    });

    it('renders radio select gender', () => {
      cy.dataCy(selectorGender)
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
      cy.dataCy(selectorGender).should(
        'contain',
        i18n.global.t('form.personalDetails.hintGender'),
      );
    });

    it('renders checkbox select newsletter', () => {
      cy.dataCy(selectorNewsletter)
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
    });

    it('renders checkbox terms', () => {
      cy.dataCy(selectorTerms).should('be.visible');
      cy.dataCy(selectorTermsInput).should('have.attr', 'aria-checked', 'true');
      cy.dataCy(selectorTermsLink).then(($el) => {
        // prevent standard link behaviour
        $el[0].addEventListener('click', (e) => {
          e.preventDefault();
        });
        cy.dataCy(selectorTermsLink).should('be.visible').click();
        // correctly does NOT check the box when clicking on the link
        cy.dataCy(selectorTermsInput).should(
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
      cy.dataCy(selectorFirstName).type(personalDetails.firstName);
      // Fill last name
      cy.dataCy(selectorLastName).type(personalDetails.lastName);
      // Fill nickname
      cy.dataCy(selectorNickname).type(personalDetails.nickname);
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
