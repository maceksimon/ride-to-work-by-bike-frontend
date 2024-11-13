// libraries
import { computed } from 'vue';

// composables
import { i18n } from '../boot/i18n';

// enums
import { OrganizationLevel } from '../components/types/Organization';

export const useSelectTable = (organizationLevel: OrganizationLevel) => {
  const label = computed(() => {
    switch (organizationLevel) {
      case OrganizationLevel.team:
        return i18n.global.t('form.team.labelTeam');
      case OrganizationLevel.subsidiary:
        return i18n.global.t('form.subsidiary.labelSubsidiary');
      default:
        return i18n.global.t('form.company.labelCompany');
    }
  });

  const labelButton = computed(() => {
    switch (organizationLevel) {
      case OrganizationLevel.team:
        return i18n.global.t('form.team.buttonAddTeam');
      case OrganizationLevel.subsidiary:
        return i18n.global.t('form.subsidiary.buttonAddSubsidiary');
      default:
        return i18n.global.t('register.challenge.buttonAddCompany');
    }
  });

  const labelButtonDialog = computed(() => {
    switch (organizationLevel) {
      case OrganizationLevel.team:
        return i18n.global.t('form.team.buttonAddTeam');
      case OrganizationLevel.subsidiary:
        return i18n.global.t('form.subsidiary.buttonAddSubsidiary');
      default:
        return i18n.global.t('form.company.buttonAddCompany');
    }
  });

  const titleDialog = computed(() => {
    switch (organizationLevel) {
      case OrganizationLevel.team:
        return i18n.global.t('form.team.titleAddTeam');
      case OrganizationLevel.subsidiary:
        return i18n.global.t('form.subsidiary.titleAddSubsidiary');
      default:
        return i18n.global.t('form.company.titleAddCompany');
    }
  });

  return {
    label,
    labelButton,
    labelButtonDialog,
    titleDialog,
  };
};
