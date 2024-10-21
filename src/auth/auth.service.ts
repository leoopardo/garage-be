import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>) {}

  async comparePasswords(password: string, hashedPassword: string) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(error);
    }
  }

  async validateUser(authDto: AuthDto) {
    if (!authDto.email || !authDto.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    try {
      const user = await this.userModel.findOne({
        email: authDto.email,
      });

      if (!user) {
        throw new NotFoundException('Usuário ou senha inválidos');
      }
      const match = await this.comparePasswords(
        authDto.password,
        user.password,
      );

      if (!match) {
        throw new BadRequestException('Usuário ou senha inválidos');
      }

      const { password: _, ...userWithoutPassword } = user.toObject();

      return userWithoutPassword;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(error);
    }
  }
}
