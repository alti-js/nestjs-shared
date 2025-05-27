import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Request } from "express";
import { ResponseMapper } from '../../mapper/response.mapper';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    let message =
      response.message || context.switchToHttp().getResponse().message;
    if (statusCode >= 200 && statusCode < 300) {
      message = message || "Success";
    } else if (statusCode === 400) {
      message = message || "Bad Request";
    } else if (statusCode === 401) {
      message = message || "Unauthorized";
    } else if (statusCode === 403) {
      message = message || "Forbidden";
    } else if (statusCode === 404) {
      message = message || "Not Found";
    } else if (statusCode === 500) {
      message = message || "Internal Server Error";
    } else if (statusCode >= 400 && statusCode < 600) {
      message = message || "Error";
    }
    return next
      .handle()
      .pipe(
        map((data) =>
          ResponseMapper.toResponseDTO(
            request.headers["x-correlation-id"] as string,
            statusCode,
            data.result || data,
            request.originalUrl || request.url,
            message
          )
        )
      );
  }
}
