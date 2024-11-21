// composables
import { i18n } from '../boot/i18n';

// enums
import { OrganizationType } from '../components/types/Organization';

// types
export type OrganizationLabels = {
  titleDialog: string;
  label: string;
  labelShort: string;
  buttonDialog: string;
};

export const useOrganization = () => {
  const getOrganizationLabels = (
    organizationType: OrganizationType,
  ): OrganizationLabels => {
    switch (organizationType) {
      case OrganizationType.company:
        return {
          titleDialog: i18n.global.t('form.company.titleAddCompany'),
          label: i18n.global.t('form.labelCompany'), // used in register coordinator form
          labelShort: i18n.global.t('form.labelCompanyShort'), // used in "add new" dialog
          buttonDialog: i18n.global.t('form.company.buttonAddCompany'),
        };
      case OrganizationType.school:
        return {
          titleDialog: i18n.global.t('form.company.titleAddSchool'),
          label: i18n.global.t('form.labelSchool'), // used in register coordinator form
          labelShort: i18n.global.t('form.labelSchoolShort'), // used in "add new" dialog
          buttonDialog: i18n.global.t('form.company.buttonAddSchool'),
        };
      case OrganizationType.family:
        return {
          titleDialog: i18n.global.t('form.company.titleAddFamily'),
          label: i18n.global.t('form.labelFamily'), // used in register coordinator form
          labelShort: i18n.global.t('form.labelFamilyShort'), // used in "add new" dialog
          buttonDialog: i18n.global.t('form.company.buttonAddFamily'),
        };
      default:
        return {
          titleDialog: '',
          label: '',
          labelShort: '',
          buttonDialog: '',
        };
    }
  };

  return {
    getOrganizationLabels,
  };
};
