// src/user.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { userRoles } from './types/users.types';
import { commonQueryParams, listResponse } from 'src/types/common.types';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  constructor(@Inject('USER_MODEL') private userModel: Model<User>) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
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

      const hashedPassword = await this.hashPassword(password);

      const newUser = await this.userModel.create({
        name,
        email,
        role,
        status: 'active',
        password: hashedPassword,
      });

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
