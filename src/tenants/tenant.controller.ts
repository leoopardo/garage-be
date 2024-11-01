// src/tenant/tenant.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { createTenantDto } from './types/tenant.interface';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('create')
  async createTenant(@Body() body: createTenantDto) {
    await this.tenantService.createTenant(body);
    return {
      message:
        'Tenant criado com sucesso! Verifique seu e-mail para confirmação.',
    };
  }

  @Get('verify')
  async verifyTenant(@Query('token') token: string) {
    await this.tenantService.verifyTenant(token);
    return { message: 'Tenant verificado com sucesso!' };
  }
}
