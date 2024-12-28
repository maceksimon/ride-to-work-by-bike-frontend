// types
import type { RegisterChallengeResult } from '../components/types/ApiRegistration';
import type { RegisterChallengePersonalDetailsForm } from '../components/types/RegisterChallenge';
import { Gender } from '../components/types/Profile';
import { PaymentSubject } from '../components/enums/Payment';
import { NewsletterType } from '../components/types/Newsletter';

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
      paymentSubject: apiData.personal_details
        .payment_subject as PaymentSubject,
    };

    return {
      personalDetails,
      organizationId: apiData.organization_id,
      subsidiaryId: apiData.subsidiary_id,
      teamId: apiData.team_id,
      merchId: apiData.t_shirt_size_id,
      voucher: apiData.personal_details.discount_coupon,
    };
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
