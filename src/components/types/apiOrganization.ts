export interface PostOrganizationPayload {
  name: string;
  vatId: string;
  organization_type: string;
  address?: {
    street: string;
    street_number: string;
    city: string;
    zip: string;
    recipient: string;
  };
}

export interface PostOrganizationResponse {
  id: number;
  name: string;
}
