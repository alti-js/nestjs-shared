import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from "@nestjs/common";
import { Request } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    const status = exception.getStatus?.() || 500;
    
    this.logger.error(exception.stack);

    const errorResponse = {
      status_code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlation_id:
          request.headers['x-correlation-id'] ||
          request.headers['correlation-id'],
      message: exception.getResponse(),
    };

    response.status(status).json(errorResponse);
  }
}