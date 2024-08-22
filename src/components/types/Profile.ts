import { Locale } from 'vue-i18n';

enum OrganizationType {
  school = 'school',
  company = 'company',
}

enum Gender {
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
