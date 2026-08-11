import type { UserLogin } from './User';

/**
 * Data for the original admin session
 * Stored when entering impersonation to restore later
 */
export interface OriginalAdminData {
  user: UserLogin;
  accessToken: string;
  refreshToken: string;
  jwtExpiration: number | null;
}

/**
 * Data for the impersonated user
 * Minimal user object during phase 1
 */
export interface ImpersonatedUserData {
  user: UserLogin;
}

/**
 * Impersonation state structure
 */
export interface ImpersonationState {
  isActive: boolean;
  originalAdmin: OriginalAdminData | null;
  impersonatedUser: ImpersonatedUserData | null;
}
