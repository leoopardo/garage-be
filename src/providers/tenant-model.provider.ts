import { Connection } from 'mongoose';
import { Config, ConfigSchema } from 'src/configs/entities/config.entity';
import {
  Mechanical,
  MechanicalSchema,
} from 'src/mechanicals/entities/mechanical.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';

export class TenantProvider {
  static userModel = 'USER_MODEL';
  static configsModel = 'CONFIGS_MODEL';
  static mechanicalsModel = 'MECHANICALS_MODEL';
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
};
