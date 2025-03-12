import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInviteFriendsStore = defineStore('inviteFriends', () => {
  const isDialogOpen = ref<boolean>(false);

  const openDialog = (): void => {
    isDialogOpen.value = true;
  };

  const closeDialog = (): void => {
    isDialogOpen.value = false;
  };

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
  };
});
