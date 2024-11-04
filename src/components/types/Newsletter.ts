export enum NewsletterType {
  challenges = 'challenges',
  events = 'events',
  mobility = 'mobility',
}

export interface NewsletterItem {
  title: string;
  icon: string;
  url: string;
  following: boolean;
}

export enum NewsletterType {
  challenge = 'challenge',
  event = 'event',
  mobility = 'mobility',
}
