import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseMapper } from "src/response/mapper/response.mapper";
import { Request } from "express";

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
    return next
      .handle()
      .pipe(
        map((data) =>
          ResponseMapper.toResponseDTO(
            request.headers["x-correlation-id"] as string,
            context.switchToHttp().getResponse().statusCode,
            data.result || data,
            data.message ||
              context.switchToHttp().getResponse().message ||
              request.originalUrl ||
              request.url,
            request.originalUrl || request.url
          )
        )
      );
  }
}
