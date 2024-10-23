import { InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const tenantConnectionProviders = {
  provide: 'TENANT_CONNECTION',
  useFactory: async (request, connection: Connection) => {
    if (!request.subdomain) {
      throw new InternalServerErrorException(
        'Make sure to use the TenantMiddleware before using this provider',
      );
    }
    const tenantConnection = connection.useDb(`oficina_${request.subdomain}`);

    return tenantConnection;
  },
  inject: [REQUEST, getConnectionToken()],
};
