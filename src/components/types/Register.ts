// enums
import { OrganizationType } from './Organization';
import { NewsletterType } from './Newsletter';

export interface RegisterCoordinatorRequest {
  firstName: string;
  lastName: string;
  organizationType: OrganizationType;
  organizationId: string;
  jobTitle: string;
  email: string;
  newsletter: NewsletterType[];
  phone: string;
  password: string;
  responsibility: boolean;
  terms: boolean;
}
