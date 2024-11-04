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

export type FormPersonalDetailsFields = {
  firstName: string;
  lastName: string;
  nickname: string;
  gender: Gender | null;
  newsletter: NewsletterType[];
  terms: boolean;
};

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
