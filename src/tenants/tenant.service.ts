// src/tenant/tenant.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel, getConnectionToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Connection, Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Tenant } from './entities/tenant.schema';
import { createTenantDto } from './types/tenant.interface';

@Injectable()
export class TenantService {
  private readonly saltRounds = 10;
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @Inject(getConnectionToken()) private connection: Connection,
    private emailService: EmailService,
  ) {}

  async createTenant(body: createTenantDto) {
    try {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hash = await bcrypt.hash(body.adminPassword, this.saltRounds);

      const tenant = await this.tenantModel.create({
        ...body,
        adminPassword: hash,
        verificationToken,
        isVerified: false,
      });
      const { adminPassword: _, ...tenantWithoutPassword } = tenant.toObject();

      // Enviar o e-mail com o token
      await this.sendVerificationEmail(body.adminEmail, verificationToken);

      return tenantWithoutPassword;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    try {
      await this.emailService.sendMail(email, 'Confirmação do Tenant', token);
    } catch (error) {
      console.log(`Erro ao enviar o e-mail de verificação`, error.message);
      throw new Error(error);
    }
  }

  async verifyTenant(verificationToken: string) {
    const tenant = await this.tenantModel.findOne({ verificationToken });

    if (!tenant) {
      throw new BadRequestException('Token inválido');
    }

    if (tenant.isVerified) {
      throw new BadRequestException('Tenant já verificado');
    }

    try {
      await this.tenantModel.findByIdAndUpdate(tenant._id, {
        isVerified: true,
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }

    // Cria uma nova conexão com o MongoDB para a nova database do tenant
    const newDbName = `oficina_${tenant.subdomain}`; // ou outro campo do tenant para nome da database
    const newDbConnection = this.connection.useDb(newDbName, {
      useCache: true,
    });

    await newDbConnection.createCollection('users');

    const UserModel = newDbConnection.model(User.name, UserSchema);

    try {
      const user = await UserModel.create({
        name: tenant.adminName,
        email: tenant.adminEmail,
        role: 'admin',
        status: 'active',
        password: tenant.adminPassword,
      });
      const { password: _, ...userWithoutPassword } = user.toObject();

      return userWithoutPassword;
    } catch (error) {}
  }

  async findTenantBySubdomain(subdomain: string) {
    const tenant = await this.tenantModel.findOne({ subdomain });

    return tenant;
  }
}
