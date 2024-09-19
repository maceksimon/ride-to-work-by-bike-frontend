import DrawerMenu from '../global/DrawerMenu.vue';
import { i18n } from '../../boot/i18n';
import { colors } from 'quasar';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey4 = getPaletteColor('grey-4');

// selectors
const selectorDrawerMenuItem = 'drawer-menu-item';
const selectorDrawerMenuItemIcon = 'drawer-menu-item-icon';

const menuItems = [
  { icon: 'home', name: 'home' },
  { icon: 'route', name: 'routes' },
  { icon: 'emoji_events', name: 'results' },
  { icon: 'people', name: 'community' },
  { icon: 'verified', name: 'discounts' },
  { icon: 'business', name: 'coordinator' },
  { icon: 'account_circle', name: 'profile' },
  {
    icon: 'email',
    name: 'inviteFriends',
  },
  {
    icon: 'volunteer_activism',
    name: 'donate',
  },
];

describe('DrawerMenu', () => {
  beforeEach(() => {
    cy.mount(DrawerMenu, {});
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      menuItems.map((item) => item.name),
      'drawerMenu',
      i18n,
    );
  });

  it('should render the list with the correct number of items', () => {
    cy.window().then(() => {
      cy.dataCy(selectorDrawerMenuItem).should('have.length', 9);
    });
  });

  it('should render each item with the expected icon and text content', () => {
    cy.window().then(() => {
      menuItems.forEach((item, index) => {
        cy.dataCy(selectorDrawerMenuItem)
          .eq(index)
          .within(() => {
            cy.get('.q-icon')
              .should('be.visible')
              .and('contain.text', item.icon);
          });
      });
    });
  });

  it.only('renders items with correct styling', () => {
    cy.window().then(() => {
      // Assuming the first item is active by default
      cy.dataCy(selectorDrawerMenuItem).each(($item) => {
        // test if current route
        if ($item.hasClass('menu-active-item')) {
          // active item
          cy.wrap($item)
            .should('have.color', white)
            .should('have.css', 'font-weight', '700')
            .within(() => {
              cy.dataCy(selectorDrawerMenuItemIcon).should('have.color', white);
            });
        } else {
          // inactive item
          cy.wrap($item)
            .should('have.color', white)
            .should('have.css', 'font-weight', '400')
            .within(() => {
              cy.dataCy(selectorDrawerMenuItemIcon).should('have.color', grey4);
            });
        }
      });
    });
  });
});
