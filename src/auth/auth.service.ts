import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

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
      if (!user.isVerified) {
        throw new BadRequestException(
          'Usuário não verificado, aguarde aprovação',
        );
      }
      if (user.status !== 'active') {
        throw new BadRequestException('Usuário inativo');
      }

      const match = await this.comparePasswords(
        authDto.password,
        user.password,
      );

      if (!match) {
        throw new BadRequestException('Usuário ou senha inválidos');
      }

      const { password: _, ...userWithoutPassword } = user.toObject();

      const token = await this.jwtService.signAsync(userWithoutPassword);

      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(error.message);
    }
  }

  async getMe(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userModel.findById(payload._id);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const { password: _, ...userWithoutPassword } = user.toObject();

      return userWithoutPassword;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(error);
    }
  }
}
