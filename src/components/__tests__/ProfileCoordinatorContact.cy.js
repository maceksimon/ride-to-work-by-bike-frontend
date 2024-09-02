import ProfileCoordinatorContact from 'components/profile/ProfileCoordinatorContact.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// selectors
const classSelectorIcon = '.q-icon';
const selectorRoot = 'profile-coordinator-contact';
const selectorContactMessage = 'contact-message';
const selectorAvatar = 'coordinator-avatar';
const selectorName = 'coordinator-name';
const selectorPhone = 'coordinator-phone';
const selectorEmail = 'coordinator-email';

// constants
const avatarSize = '56px';
const iconSize = '18px';
const nameFontSize = '14px';
const nameFontWeight = '700';
const textFontSize = '14px';
const textFontWeight = '400';

describe('<ProfileCoordinatorContact>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  let coordinator;

  before(() => {
    cy.fixture('companyCoordinator').then((companyCoordinator) => {
      coordinator = companyCoordinator;
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ProfileCoordinatorContact, {
        props: { coordinator },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ProfileCoordinatorContact, {
        props: { coordinator },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorRoot).should('be.visible');
    });

    it('root element has borderRadius', () => {
      cy.dataCy(selectorRoot).should(
        'have.css',
        'border-radius',
        rideToWorkByBikeConfig.borderRadiusCard,
      );
    });

    it('renders message saying you can contact your company coordinator', () => {
      cy.dataCy(selectorContactMessage)
        .should('be.visible')
        .and('contain', i18n.global.t('index.component.contactMessage'));
    });

    it('renders avatar of a company coordinator', () => {
      cy.dataCy(selectorAvatar)
        .should('be.visible')
        .and('have.css', 'width', avatarSize)
        .and('have.css', 'height', avatarSize);
    });

    it('renders name of a coordinator', () => {
      cy.dataCy(selectorName)
        .should('be.visible')
        .and('have.css', 'font-size', nameFontSize)
        .and('have.css', 'font-weight', nameFontWeight)
        .and('contain', coordinator.name);
    });

    it('renders phone number with a phone icon', () => {
      cy.dataCy(selectorPhone)
        .should('be.visible')
        .and('have.css', 'font-size', textFontSize)
        .and('have.css', 'font-weight', textFontWeight)
        .and('contain', coordinator.phone)
        .find(classSelectorIcon)
        .should('have.css', 'width', iconSize)
        .and('have.css', 'height', iconSize);
    });

    it('renders email with an email icon', () => {
      cy.dataCy(selectorEmail)
        .should('be.visible')
        .and('have.css', 'font-size', textFontSize)
        .and('have.css', 'font-weight', textFontWeight)
        .and('contain', coordinator.email)
        .find(classSelectorIcon)
        .should('have.css', 'width', iconSize)
        .and('have.css', 'height', iconSize);
    });
  }
});
