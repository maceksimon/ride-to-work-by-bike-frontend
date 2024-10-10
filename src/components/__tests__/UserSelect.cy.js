import { createPinia, setActivePinia } from 'pinia';
import UserSelect from '../global/UserSelect.vue';
import { i18n } from '../../boot/i18n';
import { useLoginStore } from '../../stores/login';

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
      setActivePinia(createPinia());
      cy.mount(UserSelect, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows user email', () => {
      cy.fixture('loggedUser').then((user) => {
        const loginStore = useLoginStore();
        loginStore.setUser(user);
        cy.dataCy(selectorUserSelectInput).should('contain', user.email);
      });
    });

    it('renders avatar with correct size', () => {
      cy.dataCy(selectorAvatar).invoke('height').should('equal', avatarSizeLg);
      cy.dataCy(selectorAvatar).invoke('width').should('equal', avatarSizeLg);
      cy.dataCy(selectorAvatarImage)
        .invoke('width')
        .should('equal', avatarSizeLg);
      cy.dataCy(selectorAvatarImage)
        .invoke('height')
        .should('equal', avatarSizeLg);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
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
      cy.dataCy(selectorAvatarImage)
        .invoke('width')
        .should('equal', avatarSizeSm);
      cy.dataCy(selectorAvatarImage)
        .invoke('height')
        .should('equal', avatarSizeSm);
    });
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorUserSelectInput).should('be.visible');
    });

    it('renders rounded avatar with alt text', () => {
      cy.fixture('loggedUser').then((user) => {
        const loginStore = useLoginStore();
        loginStore.setUser(user);
        // avatar
        cy.dataCy(selectorAvatar)
          .should('be.visible')
          .and('have.css', 'border-radius', '50%');
        // image
        cy.dataCy(selectorAvatarImage)
          .should('be.visible')
          .and(
            'have.attr',
            'aria-label',
            `${user.first_name} ${user.last_name}`,
          );
        cy.dataCy(selectorAvatarImage)
          .find('img')
          .invoke('attr', 'src')
          .should('contain', 'profile-placeholder');
      });
    });

    it('shows dropdown on click', () => {
      cy.dataCy(selectorUserSelectInput).click();
      cy.dataCy(selectorMenuItem)
        .should('be.visible')
        .and('have.length', menuItemCount);
    });
  }
});
