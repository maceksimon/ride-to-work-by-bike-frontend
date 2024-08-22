import { Locale } from 'vue-i18n';

export enum OrganizationType {
  school = 'school',
  company = 'company',
}

export enum Gender {
  male = 'male',
  female = 'female',
}

export interface Profile {
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  language: Locale;
  organization: string;
  organizationType: OrganizationType;
}
