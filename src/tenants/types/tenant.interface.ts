export interface createTenantDto {
  subdomain: string;
  workshopName: string;
  adminEmail: string;
  adminPassword: string;
  verificationToken?: string;
  isVerified?: boolean;
}
