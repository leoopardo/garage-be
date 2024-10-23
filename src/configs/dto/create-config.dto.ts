export class CreditCard {
  number: string;
  expiration: string;
  cvc: string;
  holderName: string;
  holderDocument: string;
}

export class CreateConfigDto {
  module: string;
  subdomain: string;
  workshopName: string;
  plan: string;
  nextPaymentDate: Date;
  admin: string;
  creditCardData?: CreditCard;
}
