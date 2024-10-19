// types
import type { Locale } from 'vue-i18n';
import type { FormCompanyAddressFields } from './Form';

// enums
import { OrganizationType } from './Organization';

export enum Gender {
  male = 'male',
  female = 'female',
}

export enum PaymentState {
  paidByOrganization = 'paidByOrganization',
  paid = 'paid',
  notPaid = 'notPaid',
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
  subsidiary: {
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
  paymentState: PaymentState;
}

export interface ProfileCoordinator {
  name: string;
  image: {
    src: string;
    alt: string;
  };
  phone: string;
  email: string;
}
