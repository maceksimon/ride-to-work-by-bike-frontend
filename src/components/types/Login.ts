import { UserLogin } from './User';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserLogin;
}

/**
 * Facebook login types
 * Used in LoginRegisterButtons.vue
 */
export enum FacebookLoginStatus {
  connected = 'connected',
  notAuthorized = 'not_authorized',
  unknown = 'unknown',
}

export interface FacebookLoginResponse {
  status: FacebookLoginStatus;
  authResponse: FacebookAuthResponse | null;
}

export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  reauthorize_required_in: number;
  signedRequest: string;
  userID: string;
}
