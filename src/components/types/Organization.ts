import { Image } from './Image';
import { FormCompanyAddressFields } from './Form';

export enum OrganizationType {
  company = 'company',
  school = 'school',
  family = 'family',
}

export interface Organization {
  divisions: OrganizationDivision[];
  description?: string;
  id: string;
  identificationNumber: string;
  identificationNumberVat?: string;
  image?: Image;
  organizationType: OrganizationType;
  title: string;
}

export interface OrganizationDivision {
  id: string;
  title: string;
  address?: FormCompanyAddressFields;
  teams: OrganizationTeam[];
}

export interface OrganizationTeam {
  id: string;
  title: string;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  name: string;
  team: string;
  payment: {
    amount: number;
  };
}
