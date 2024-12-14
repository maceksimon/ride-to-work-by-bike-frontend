/**
 * API types for team-related operations
 */

export interface TeamPostApiResponse {
  data: {
    id: number;
    name: string;
  } | null;
  success: boolean;
}
