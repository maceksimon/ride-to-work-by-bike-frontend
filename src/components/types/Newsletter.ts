export interface NewsletterItem {
  id: NewsletterType;
  icon: string;
  title: string;
}

export enum NewsletterType {
  challenge = 'challenge',
  event = 'events',
  mobility = 'mobility',
}
