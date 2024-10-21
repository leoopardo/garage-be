import { Connection } from 'mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';

export const tenantModels = {
  userModel: {
    provide: 'USER_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(User.name, UserSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};
