export interface ConfigGlobal {
  colorPrimary: string;
  colorPrimaryDark: string;
  colorSecondary: string;
  colorSecondaryOpacity: string;
  colorGray: string;
  colorGrayLight: string;
  colorGrayMiddle: string;
  colorWhite: string;
  colorWhiteOpacity: string;
  colorBlack: string;
  colorRed: string;
  image: string;
  width: string;
  title: string;
  subtitle: string;
  borderRadiusCard: string;
  borderRadiusCardSmall: string;
  borderRadiusButtonSmall: string;
  maxWidthBanner: string;
  contactEmail: string;
  urlAutoMat: string;
  urlFacebook: string;
  urlInstagram: string;
  urlTwitter: string;
  urlYoutube: string;
  urlGooglePlay: string;
  urlAppStore: string;
  urlVideoLoggingRoutes: string;
  urlVideoOnboarding: string;
  challengeMonth: 'may' | 'october' | 'september';
  containerFormWidth: string;
  containerContentWidth: string;
  challengeStartDate: string;
  challengeLoggingWindowDays: number;
  defaultDistanceZero: string;
  entryFeePaymentMin: string;
  entryFeePaymentMax: string;
  entryFeePaymentOptions: string;
  notifyMessagePosition: string;
}

export interface ConfigAppVersion {
  version: string;
}
