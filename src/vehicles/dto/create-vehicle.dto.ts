export class CreateVehicleDto {
  image: string | Buffer;
  owner: string;
  brand: string;
  carModel: string;
  year: number;
  color: string;
  licensePlate: string;
  kilometers: number;
  servicesHistory: string[];
  nextMaintenences: {
    nextOilChange: Date;
    nextOilFilterChange: Date;
    nextReview: Date;
  };
}
