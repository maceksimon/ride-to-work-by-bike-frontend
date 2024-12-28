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
type PartialPersonalDetails = Partial<
  RegisterChallengePostPayload['personal_details']
>;

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
  }): Partial<RegisterChallengePostPayload> {
    const payload: Partial<RegisterChallengePostPayload> = {};

    if (storeState.personalDetails) {
      const personalDetails: PartialPersonalDetails = {};
      const storePersonalDetails = storeState.personalDetails;

      if (storePersonalDetails.firstName !== undefined) {
        personalDetails.first_name = storePersonalDetails.firstName;
      }
      if (storePersonalDetails.lastName !== undefined) {
        personalDetails.last_name = storePersonalDetails.lastName;
      }
      if (storePersonalDetails.nickname !== undefined) {
        personalDetails.nickname = storePersonalDetails.nickname;
      }
      if (storePersonalDetails.gender !== undefined) {
        personalDetails.sex = storePersonalDetails.gender as Gender;
      }
      if (storePersonalDetails.newsletter?.length) {
        personalDetails.newsletter = storePersonalDetails.newsletter.join(',');
      }
      if (storePersonalDetails.terms !== undefined) {
        personalDetails.personal_data_opt_in = storePersonalDetails.terms;
      }

      if (Object.keys(personalDetails).length > 0) {
        payload.personal_details = personalDetails;
      }
    }

    if (storeState.paymentSubject !== undefined) {
      payload.personal_details = {
        ...(payload.personal_details || {}),
        payment_subject: storeState.paymentSubject,
      };
    }
    if (storeState.paymentAmount !== undefined) {
      payload.personal_details = {
        ...(payload.personal_details || {}),
        payment_amount: storeState.paymentAmount.toString(),
      };
    }
    if (storeState.voucher !== undefined) {
      payload.personal_details = {
        ...(payload.personal_details || {}),
        discount_coupon: storeState.voucher?.name || '',
      };
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
    return newsletter.split(',').map((n) => n.trim()) as NewsletterType[];
  },
};
