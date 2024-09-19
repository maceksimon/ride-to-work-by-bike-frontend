import DrawerMenu from '../global/DrawerMenu.vue';
import { i18n } from '../../boot/i18n';
import { colors } from 'quasar';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey4 = getPaletteColor('grey-4');

// selectors
const selectorDrawerMenuItem = 'drawer-menu-item';
const selectorDrawerMenuItemIcon = 'drawer-menu-item-icon';

// variables
const iconSize = 18;

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

  it('renders items with correct styling', () => {
    cy.window().then(() => {
      // Assuming the first item is active by default
      cy.dataCy(selectorDrawerMenuItem).each(($item, index) => {
        // test if current route
        if ($item.hasClass('menu-active-item')) {
          // active item
          cy.wrap($item)
            .should('have.color', white)
            .and('have.css', 'font-size', '16px')
            .and('have.css', 'font-weight', '700')
            .and(
              'contain',
              i18n.global.t(`drawerMenu.${menuItems[index].name}`),
            )
            .within(() => {
              cy.dataCy(selectorDrawerMenuItemIcon).should('have.color', white);
              cy.dataCy(selectorDrawerMenuItemIcon)
                .invoke('width')
                .should('be.eq', iconSize);
              cy.dataCy(selectorDrawerMenuItemIcon)
                .invoke('height')
                .should('be.eq', iconSize);
            });
        } else {
          // inactive item
          cy.wrap($item)
            .should('have.color', white)
            .and('have.css', 'font-size', '16px')
            .and('have.css', 'font-weight', '400')
            .and(
              'contain',
              i18n.global.t(`drawerMenu.${menuItems[index].name}`),
            )
            .within(() => {
              cy.dataCy(selectorDrawerMenuItemIcon).should('have.color', grey4);
              cy.dataCy(selectorDrawerMenuItemIcon)
                .invoke('width')
                .should('be.eq', iconSize);
              cy.dataCy(selectorDrawerMenuItemIcon)
                .invoke('height')
                .should('be.eq', iconSize);
            });
        }
      });
    });
  });
});
