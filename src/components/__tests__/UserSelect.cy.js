import UserSelect from '../global/UserSelect.vue';
import { user } from '../../mocks/layout';
import { i18n } from '../../boot/i18n';

// selectors
const selectorUserSelectInput = 'user-select-input';
const selectorAvatar = 'avatar';
const selectorAvatarImage = 'avatar-image';
const selectorMenuItem = 'menu-item';

// variables
const avatarSizeLg = 40;
const avatarSizeSm = 32;
const menuItemCount = 6;

describe('<UserSelect>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(UserSelect, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows user email', () => {
      cy.dataCy(selectorUserSelectInput).should('contain', user.email);
    });

    it('renders avatar with correct size', () => {
      cy.dataCy(selectorAvatar).invoke('height').should('equal', avatarSizeLg);
      cy.dataCy(selectorAvatar).invoke('width').should('equal', avatarSizeLg);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(UserSelect, {
        props: {
          variant: 'mobile',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders avatar with correct size', () => {
      cy.dataCy(selectorAvatar).invoke('width').should('equal', avatarSizeSm);
      cy.dataCy(selectorAvatar).invoke('height').should('equal', avatarSizeSm);
    });
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorUserSelectInput).should('be.visible');
    });

    it('renders rounded avatar with alt text', () => {
      // avatar
      cy.dataCy(selectorAvatar)
        .should('be.visible')
        .and('have.css', 'border-radius', '50%');
      // image
      cy.dataCy(selectorAvatarImage)
        .should('be.visible')
        .and('have.attr', 'aria-label', user.image.alt);
      cy.dataCy(selectorAvatarImage)
        .find('img')
        .should('have.attr', 'src', user.image.src);
    });

    it('shows dropdown on click', () => {
      cy.dataCy(selectorUserSelectInput).click();
      cy.dataCy(selectorMenuItem)
        .should('be.visible')
        .and('have.length', menuItemCount);
    });
  }
});
