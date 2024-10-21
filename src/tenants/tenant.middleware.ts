// src/middleware/tenant.middleware.ts
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const subdomain = req.headers['subdomain']?.toString();

    if (!subdomain) {
      throw new BadRequestException('"subdomain" não foi fornecido');
    }

    const tenant = await this.tenantService.findTenantBySubdomain(subdomain);

    if (!tenant) {
      throw new BadRequestException('O subdomínio fornecido não existe');
    }

    req['subdomain'] = subdomain;
    next();
  }
}
