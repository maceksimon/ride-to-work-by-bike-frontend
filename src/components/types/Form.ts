// enums
import { NewsletterType } from './Newsletter';

// types
import type { Image } from './Image';

export enum TestPaymentVoucher {
  full = 'FULL',
  half = 'HALF',
}

export enum Gender {
  male = 'male',
  female = 'female',
}

export type FormPersonalDetails = {
  nickname?: string;
  newsletter?: NewsletterType[];
  phone?: string;
  phonePermit?: boolean;
  language?: string;
  jobTitle?: string;
  ageGroup?: number;
  terms?: boolean;
};

export interface FormPersonalDetailsFields extends FormPersonalDetails {
  firstName: string;
  lastName: string;
  gender: Gender | null;
}

export interface FormPersonalDetailsApi extends FormPersonalDetails {
  firstName?: string;
  lastName?: string;
  gender?: Gender | null;
}

export type FormOption = {
  label: string;
  value: string | string[] | FormCompanyAddressFields;
  icon?: string;
  description?: string;
};

export interface FormSelectTableOption extends FormOption {
  members?: number;
  maxMembers?: number;
}

export type FormSelectOption = {
  label: string;
  value: string;
};

export type FormCompanyFields = {
  name: string;
  vatId: string;
  address: FormCompanyAddressFields[];
};

export type FormCompanyAddressFields = {
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  cityChallenge: string;
  department: string;
};

export type FormTeamFields = {
  name: string;
  members?: number;
  maxMembers?: number;
};

export type FormCardMerchType = {
  author: string;
  dialogDescription: string;
  dialogImages: Image[];
  dialogTitle: string;
  gender: FormOption[];
  value: string;
  image: string;
  material: string;
  label: string;
  sizes: FormOption[];
};

export type FormPaymentVoucher = {
  code: string;
  name: string;
  amount: number;
};
