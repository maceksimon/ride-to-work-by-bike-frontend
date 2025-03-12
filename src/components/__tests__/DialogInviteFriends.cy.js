import DialogInviteFriends from '../global/DialogInviteFriends.vue';
import { i18n } from '../../boot/i18n';
import { createPinia, setActivePinia } from 'pinia';
import { computed } from 'vue';
import { useInviteFriendsStore } from '../../stores/inviteFriends';

describe('<DialogInviteFriends>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['inviteFriends'], 'drawerMenu', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(DialogInviteFriends, {
        props: {},
      });
      cy.viewport('macbook-16');
    });
    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(DialogInviteFriends, {
        props: {},
      });
      cy.viewport(320, 1024);
    });
    coreTests();
  });
});

function coreTests() {
  it('shows dialog and form when store isDialogOpen is true', () => {
    // test initial state
    cy.wrap(useInviteFriendsStore()).then((inviteFriendsStore) => {
      // get computed value for dialog state
      const isDialogOpen = computed(() => inviteFriendsStore.getIsDialogOpen);
      // check store value
      cy.wrap(isDialogOpen).its('value').should('be.false');
      cy.dataCy('dialog-invite-friends').should('not.exist');
    });
    // open dialog
    cy.wrap(useInviteFriendsStore()).then((inviteFriendsStore) => {
      cy.wrap(inviteFriendsStore.openDialog());
      // get computed value for dialog state
      const isDialogOpen = computed(() => inviteFriendsStore.getIsDialogOpen);
      // check store value
      cy.wrap(isDialogOpen).its('value').should('be.true');
      // verify dialog and form visibility
      cy.dataCy('dialog-invite-friends').should('be.visible');
      cy.dataCy('form-invite-friends').should('be.visible');
      // verify dialog title
      cy.dataCy('dialog-invite-friends').within(() => {
        cy.contains(i18n.global.t('drawerMenu.inviteFriends')).should(
          'be.visible',
        );
      });
    });
  });
}
