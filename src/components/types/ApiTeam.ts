/**
 * API types for team-related operations
 */

export interface TeamPostApiPayload {
  name: string;
}

export interface TeamPostApiResponse {
  id: number;
  name: string;
}

export interface TeamGetApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeamPostApiResponse[];
}
