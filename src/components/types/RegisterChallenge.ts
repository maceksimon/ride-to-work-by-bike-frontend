// types
import type { NewsletterType } from './Newsletter';
import type { Gender } from './Profile';

interface BasePersonalDetails {
  ageGroup?: number;
  jobTitle?: string;
  language?: string;
  nickname?: string;
  phone?: string;
  phonePermit?: boolean;
  terms?: boolean;
}

/**
 * API endpoint declares the following properties as optional.
 */
export interface RegisterChallengePersonalDetailsApi
  extends BasePersonalDetails {
  firstName?: string;
  gender?: Gender | null;
  id?: number;
  lastName?: string;
}

/**
 * For the use in form, we declare the following properties as required.
 * We also add the newsletter property.
 */
export interface RegisterChallengePersonalDetailsForm
  extends BasePersonalDetails {
  firstName: string;
  gender: Gender | null;
  id: number | null;
  lastName: string;
  newsletter: NewsletterType[];
}

export interface RegisterChallengeCoordinatorForm {
  jobTitle: string;
  phone: string;
  responsibility: boolean;
  terms: boolean;
}

export interface RegisterChallengePostRequest {
  personalDetails: RegisterChallengePersonalDetailsApi;
  newsletter: NewsletterType[];
  teamId?: number | null;
  telephone?: string;
  telephoneOptIn?: boolean;
}
