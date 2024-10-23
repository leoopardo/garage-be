export interface createTenantDto {
  subdomain: string;
  workshopName: string;
  adminEmail: string;
  adminPassword: string;
  verificationToken?: string;
  isVerified?: boolean;
  plan: plans;
  nextPaymentDate?: Date;
}

export enum plans {
  FREE_TRIAL = 'free-trial',
  SMALL_GARAGE = 'small-garage',
  MEDIUM_GARAGE = 'medium-garage',
  BIG_GARAGE = 'big-garage',
}
