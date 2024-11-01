// src/tenant/tenant.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, getConnectionToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Connection, Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Tenant } from './entities/tenant.schema';
import { createTenantDto } from './types/tenant.interface';
import { Config, ConfigSchema } from 'src/configs/entities/config.entity';
import { Board, BoardSchema } from 'src/boards/entities/board.entity';
import { defaultBoards } from './consts/boards';
import {
  ServiceStatus,
  ServiceStatusSchema,
} from 'src/service-status/entities/service-status.entity';
import { defaultSteps } from 'src/service-status/consts/defaultSteps';

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
    await newDbConnection.createCollection('configs');
    await newDbConnection.createCollection('boards');
    await newDbConnection.createCollection('service-status');

    const UserModel = newDbConnection.model(User.name, UserSchema);
    const ConfigModel = newDbConnection.model(Config.name, ConfigSchema);
    const BoardModel = newDbConnection.model(Board.name, BoardSchema);
    const ServiceStatusModel = newDbConnection.model(
      ServiceStatus.name,
      ServiceStatusSchema,
    );

    try {
      const user = await UserModel.create({
        name: tenant.adminName,
        email: tenant.adminEmail,
        role: 'admin',
        status: 'active',
        password: tenant.adminPassword,
        isVerified: true,
        tenant: tenant._id,
      });
      const { password: _, ...userWithoutPassword } = user.toObject();

      try {
        await ConfigModel.create({
          module: 'config',
          nextPaymentDate: tenant.nextPaymentDate,
          workshopName: tenant.workshopName,
          subdomain: tenant.subdomain,
          plan: tenant.plan,
          admin: user._id,
        });
      } catch (error) {}

      try {
        let timeout = 0;
        defaultBoards.forEach(async ({ name, statusColor }) => {
          setTimeout(
            async () => {
              await BoardModel.create({
                name,
                statusColor,
              });
            },
            (timeout += 500),
          );
        });
      } catch (error) {
        console.error('erro ao criar os boards', error);
      }

      try {
        defaultSteps.forEach(async ({ name, description }) => {
          await ServiceStatusModel.create({
            name,
            description,
          });
        });
      } catch (error) {
        console.error('erro ao criar os steps', error);
      }

      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar o usuário', error);
    }
  }

  async findTenantBySubdomain(subdomain: string) {
    const tenant = await this.tenantModel.findOne({ subdomain });

    return tenant;
  }
}
