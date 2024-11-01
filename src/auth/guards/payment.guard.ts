import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Config } from 'src/configs/entities/config.entity';
import { TenantProvider } from 'src/providers/tenant-model.provider';

@Injectable()
export class PaymentGuard implements CanActivate {
  constructor(
    @Inject(TenantProvider.configsModel) private configs: Model<Config>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const payload = await this.configs.find();

      if (!payload[0]) {
        throw new InternalServerErrorException('Configuração não encontrada');
      }

      // Verifica se a próxima data de pagamento está ausente ou no passado
      if (
        !payload[0].nextPaymentDate ||
        new Date(payload[0].nextPaymentDate) < new Date()
      ) {
        throw new HttpException(
          `Assinatura pendente: ${
            payload[0].nextPaymentDate
              ? new Date(payload[0].nextPaymentDate).toLocaleDateString()
              : 'Data desconhecida'
          }`,
          402,
        );
      }
    } catch (err) {
      if (err instanceof HttpException) {
        // Repropaga a exceção HTTP, incluindo o status 402
        throw err;
      } else {
        // Lança a exceção genérica em qualquer outro caso
        throw new InternalServerErrorException(
          'Erro ao verificar a assinatura',
        );
      }
    }
    return true;
  }
}
