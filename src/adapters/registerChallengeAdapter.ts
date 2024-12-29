// enums
import { Gender } from '../components/types/Profile';
import { NewsletterType } from '../components/types/Newsletter';
import { PaymentSubject } from '../components/enums/Payment';

// types
import type {
  RegisterChallengeResult,
  RegisterChallengePostPayload,
} from '../components/types/ApiRegistration';
import type { RegisterChallengePersonalDetailsForm } from '../components/types/RegisterChallenge';
import type { ValidatedCoupon } from '../components/types/Coupon';

/**
 * Adapter for converting between API and store registration data formats
 */
export const registerChallengeAdapter = {
  /**
   * Convert API registration data to store format
   * @param apiData - Registration data from API
   * @returns Store-compatible registration data
   */
  toStoreData(apiData: RegisterChallengeResult) {
    const personalDetails: RegisterChallengePersonalDetailsForm = {
      firstName: apiData.personal_details.first_name,
      lastName: apiData.personal_details.last_name,
      nickname: apiData.personal_details.nickname,
      gender: apiData.personal_details.sex as Gender,
      newsletter: this.parseNewsletter(apiData.personal_details.newsletter),
      terms: apiData.personal_details.personal_data_opt_in,
    };

    return {
      personalDetails,
      organizationId: apiData.organization_id,
      paymentSubject: apiData.personal_details
        .payment_subject as PaymentSubject,
      paymentAmount: apiData.personal_details.payment_amount
        ? parseInt(apiData.personal_details.payment_amount)
        : 0,
      subsidiaryId: apiData.subsidiary_id,
      teamId: apiData.team_id,
      merchId: apiData.t_shirt_size_id,
      voucher: apiData.personal_details.discount_coupon,
    };
  },

  /**
   * Convert store state to API payload format, including only defined properties
   * @param storeState - Partial store state with only properties to be sent
   * @returns API-compatible payload with only defined properties
   */
  toApiPayload(storeState: {
    personalDetails?: Partial<RegisterChallengePersonalDetailsForm>;
    paymentSubject?: PaymentSubject;
    paymentAmount?: number;
    teamId?: number | null;
    merchId?: number | null;
    voucher?: ValidatedCoupon | null;
  }): RegisterChallengePostPayload {
    const payload: RegisterChallengePostPayload = {};

    if (storeState.personalDetails) {
      const storePersonalDetails = storeState.personalDetails;

      if (storePersonalDetails.firstName !== undefined) {
        payload.first_name = storePersonalDetails.firstName;
      }
      if (storePersonalDetails.lastName !== undefined) {
        payload.last_name = storePersonalDetails.lastName;
      }
      if (storePersonalDetails.nickname !== undefined) {
        payload.nickname = storePersonalDetails.nickname;
      }
      if (storePersonalDetails.gender !== undefined) {
        payload.sex = storePersonalDetails.gender as Gender;
      }
      if (storePersonalDetails.newsletter?.length) {
        payload.newsletter = this.combineNewsletterValues(
          storePersonalDetails.newsletter,
        );
      }
      if (storePersonalDetails.terms !== undefined) {
        payload.personal_data_opt_in = storePersonalDetails.terms;
      }
    }

    if (storeState.paymentSubject !== undefined) {
      payload.payment_subject = storeState.paymentSubject;
    }
    if (storeState.paymentAmount !== undefined) {
      payload.payment_amount = storeState.paymentAmount.toString();
    }
    if (storeState.voucher !== undefined) {
      payload.discount_coupon = storeState.voucher?.name || '';
    }
    if (storeState.teamId !== undefined) {
      payload.team_id = storeState.teamId;
    }
    if (storeState.merchId !== undefined) {
      payload.t_shirt_size_id = storeState.merchId;
    }

    return payload;
  },

  /**
   * Parse newsletter string from API to array of NewsletterType
   * @param newsletter - Newsletter string from API
   * @returns Array of NewsletterType
   */
  parseNewsletter(newsletter: string): NewsletterType[] {
    if (!newsletter) return [];
    return newsletter
      .split('-')
      .map((option) => option.trim()) as NewsletterType[];
  },

  /**
   * Convert array of newsletter types to combined API value
   * @param newsletters - Array of newsletter types
   * @returns Combined newsletter string value
   */
  combineNewsletterValues(newsletters: NewsletterType[]): string {
    if (!newsletters?.length) return '';
    // sort newsletter types (challenge, event, mobility)
    const sorted = [...newsletters].sort();
    // if there is only one newsletter type, return it
    if (sorted.length === 1) return sorted[0];
    // if there are two newsletter types, return them separated by a dash
    if (sorted.length === 2) {
      return `${sorted[0]}-${sorted[1]}`;
    }
    // if there are three newsletter types, return them separated by a dash
    if (sorted.length === 3) {
      return `${sorted[0]}-${sorted[1]}-${sorted[2]}`;
    }
    return '';
  },
};
