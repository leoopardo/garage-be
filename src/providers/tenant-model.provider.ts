import { Connection } from 'mongoose';
import { Board, BoardSchema } from 'src/boards/entities/board.entity';
import { Client, ClientSchema } from 'src/clients/entities/client.entity';
import { Config, ConfigSchema } from 'src/configs/entities/config.entity';
import {
  Mechanical,
  MechanicalSchema,
} from 'src/mechanicals/entities/mechanical.entity';
import { Quote, QuoteSchema } from 'src/quotes/entities/quote.entity';
import {
  ServiceStatus,
  ServiceStatusSchema,
} from 'src/service-status/entities/service-status.entity';
import { ServiceSchema, Service } from 'src/services/entities/service.entity';
import { Stock, StockSchema } from 'src/stock/entities/stock.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Vehicles, VehicleSchema } from 'src/vehicles/entities/vehicle.entity';

export class TenantProvider {
  static userModel = 'USER_MODEL';
  static configsModel = 'CONFIGS_MODEL';
  static mechanicalsModel = 'MECHANICALS_MODEL';
  static boardsModel = 'BOARDS_MODEL';
  static serviceStatusModel = 'SERVICE_STATUS';
  static quotesModel = 'QUOTES_MODEL';
  static servicesModel = 'SERVICES_MODEL';
  static clientModel = 'CLIENT_MODEL';
  static vehicleModel = 'VEHICLE_MODEL';
  static stockModel = 'STOCK_MODEL';
}

export const tenantModels = {
  userModel: {
    provide: TenantProvider.userModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(User.name, UserSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  configsModel: {
    provide: TenantProvider.configsModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Config.name, ConfigSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  mechanicalsModel: {
    provide: TenantProvider.mechanicalsModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Mechanical.name, MechanicalSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  boardsModel: {
    provide: TenantProvider.boardsModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Board.name, BoardSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  serviceStatusModel: {
    provide: TenantProvider.serviceStatusModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(ServiceStatus.name, ServiceStatusSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  quotesModel: {
    provide: TenantProvider.quotesModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Quote.name, QuoteSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  servicesModel: {
    provide: TenantProvider.servicesModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Service.name, ServiceSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  clientModel: {
    provide: TenantProvider.clientModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Client.name, ClientSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  vehicleModel: {
    provide: TenantProvider.vehicleModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Vehicles.name, VehicleSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  stockModel: {
    provide: TenantProvider.stockModel,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Stock.name, StockSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};
