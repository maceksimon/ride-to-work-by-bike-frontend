// enums
import { NewsletterType } from './Newsletter';

export interface RegisterCoordinatorRequest {
  firstName?: string;
  jobTitle?: string;
  lastName?: string;
  newsletter: NewsletterType[];
  organizationId?: number;
  phone?: string;
  responsibility?: boolean;
  terms?: boolean;
}
