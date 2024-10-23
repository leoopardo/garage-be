// src/user.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { userRoles } from './types/users.types';
import { commonQueryParams, listResponse } from 'src/types/common.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { TenantService } from 'src/tenants/tenant.service';
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { TenantProvider } from 'src/providers/tenant-model.provider';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  constructor(
    @Inject(TenantProvider.userModel) private userModel: Model<User>,
    private TenantService: TenantService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async sendVerificationEmail(email: string, token: string, username: string) {
    try {
      await this.emailService.admConfirmAccount(
        email,
        'Confirmar usuário',
        token,
        username,
      );
    } catch (error) {
      console.log(`Erro ao enviar o e-mail de verificação`, error.message);
      throw new Error(error);
    }
  }

  async createUser({
    name,
    email,
    role,
    password,
  }: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      if (!userRoles[role.toUpperCase()]) {
        throw new BadRequestException(
          `"role" deve ser uma das seguintes: ${Object.values(userRoles).join(', ')}`,
        );
      }

      const tenant = await this.TenantService.findTenantBySubdomain(
        this.userModel.db.name.split('oficina_')[1],
      );

      if (!tenant) {
        throw new BadRequestException('Tenant não encontrado');
      }

      const hashedPassword = await this.hashPassword(password);

      const verificationToken = crypto.randomBytes(32).toString('hex');

      const newUser = await this.userModel.create({
        name,
        email,
        role,
        status: 'inactive',
        password: hashedPassword,
        tenant: tenant._id,
        verificationToken,
      });

      await this.sendVerificationEmail(
        tenant.adminEmail,
        verificationToken,
        newUser.name,
      );

      // Remove o campo 'password' do objeto retornado
      const { password: _, ...userWithoutPassword } = newUser.toObject();

      return userWithoutPassword as Omit<User, 'password'>;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Não foi possível criar o usuário. Verifique os dados fornecidos.',
      );
    }
  }

  async verifyUser(verificationToken: string, userToken: string) {
    const payload = await this.jwtService.verifyAsync(userToken, {
      secret: process.env.JWT_SECRET,
    });

    const currentUser = await this.userModel.findById(payload._id);

    if (!currentUser) {
      throw new BadRequestException('O seu usuário não foi encontrado');
    }

    if (currentUser.role !== userRoles.ADMIN) {
      throw new BadRequestException(
        'Você não tem permissão para realizar essa ação',
      );
    }

    if (!verificationToken) {
      throw new BadRequestException('Token inválido');
    }

    const user = await this.userModel.findOne({ verificationToken });

    if (!user) {
      throw new BadRequestException('Token inválido ou já utilizado');
    }

    try {
      const updatedUsder = await this.userModel.findByIdAndUpdate(user._id, {
        status: 'active',
        isVerified: true,
        verificationToken: null,
      });

      return updatedUsder;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.role) {
        if (!userRoles[updateUserDto.role.toUpperCase()]) {
          throw new BadRequestException(
            `"role" deve ser uma das seguintes: ${Object.values(userRoles).join(', ')}`,
          );
        }
      }
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashPassword(
          updateUserDto.password,
        );
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );
      const { password: _, ...userWithoutPassword } = updatedUser.toObject();

      return userWithoutPassword as Omit<User, 'password'>;
    } catch (error) {}
  }

  async deleteUser(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndUpdate(id, {
        status: 'inactive',
      });
      return deletedUser;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Não foi possível deletar o usuário.');
    }
  }

  async findAll({
    limit,
    page,
    search,
  }: commonQueryParams): Promise<listResponse<User>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ];
      }

      const totalUsers = await this.userModel.countDocuments(query);
      const users = await this.userModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .select('-password')
        .select('-__v')
        .populate({
          path: 'tenant',
          select: '-__v -adminPassword -verificationToken',
        })
        .exec();

      return {
        data: users,
        total: totalUsers,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(totalUsers / limit),
      };
    } catch (error) {
      return error;
    }
  }
}
