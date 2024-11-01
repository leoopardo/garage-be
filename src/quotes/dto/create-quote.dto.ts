export class CreateQuoteDto {
  vehicleId: string;
  clientId: string;
  serviceId: string;
  itens: string[];
  steps: string[];
  laborCost: number;
  total: number;
  serviceOrderDocument: string;
  status: string;
  responsible: string;
}
