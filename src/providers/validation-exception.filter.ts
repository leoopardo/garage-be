import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Mongoose from 'mongoose';

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Se o erro for uma instância de ValidationError (Mongoose), formate a resposta
    if (exception instanceof Mongoose.Error.ValidationError) {
      const validationErrors = Object.values(exception.errors).map(
        (error: any) => ({
          field: error.path,
          message: error.message,
          type: error.kind,
        }),
      );

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Caso contrário, envie a resposta padrão do erro
    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
    });
  }
}
