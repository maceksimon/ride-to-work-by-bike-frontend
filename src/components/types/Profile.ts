// types
import type { Locale } from 'vue-i18n';
import type { FormCompanyAddressFields } from './Form';

// enums
import { OrganizationType } from './Organization';

export enum Gender {
  male = 'male',
  female = 'female',
}

export interface Profile {
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  language: Locale;
  organization: string;
  organizationType: OrganizationType;
  division: {
    address: FormCompanyAddressFields;
  };
  team: string;
  package: {
    title: string;
    url: string;
    size: string;
    state: string;
    trackingNumber: string;
    trackingUrl: string;
  };
  deliveryAddress: FormCompanyAddressFields;
}
