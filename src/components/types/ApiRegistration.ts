export type PersonalDetails = {
  first_name: string;
  last_name: string;
  nickname: string;
  sex: string;
  telephone: string;
  telephone_opt_in: boolean;
  language: string;
  occupation: string;
  age_group: string;
  newsletter: string;
  personal_data_opt_in: boolean;
  discount_coupon: string;
  payment_subject: string;
  payment_type: string;
  payment_status: string;
  payment_amount: string;
};

export type RegisterChallengeResult = {
  personal_details: PersonalDetails;
  team_id: number;
  organization_id: number;
  subsidiary_id: number;
  t_shirt_size_id: number;
};

export type RegisterChallengeResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RegisterChallengeResult[];
};
