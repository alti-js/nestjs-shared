import { DynamicModule, Module } from "@nestjs/common";
import { TransformInterceptor } from "./interceptor/transform/transform.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception/http-exception.filter";
@Module({})
export class ResponseModule {
  public static forRoot(): DynamicModule {
    return {
      module: ResponseModule,
      providers: [TransformInterceptor, HttpExceptionFilter],
      exports: [TransformInterceptor, HttpExceptionFilter],
    };
  }
}
