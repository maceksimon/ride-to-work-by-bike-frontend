import { StravaAccountStatus } from '../enums/Strava';

export interface SyncResult {
  synced_trips?: number;
  new_trips?: number;
  synced_activities?: number;
  activities?: string[];
  error?: string;
}

export interface StravaAccount {
  strava_username: string;
  first_name: string;
  last_name: string;
  user_sync_count: number;
  errors: string;
  warn_user_sync_count: number;
  max_user_sync_count: number;
  hashtag_from: string;
  hashtag_to: string;
  sync_outcome: {
    result: SyncResult | null;
  } | null;
  last_sync_time: string | null;
}

export interface StravaAuthSuccessResponse {
  account_status: StravaAccountStatus;
  account: StravaAccount[];
}

export interface StravaAuthErrorResponse {
  error: string;
}

export type StravaAuthResponse =
  | StravaAuthSuccessResponse
  | StravaAuthErrorResponse;
