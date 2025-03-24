import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { CorrelationIdService } from "./services/correlation-id/correlation-id.service";
import { ConfigDTO } from "./models/config.dto";
import { CorrelationIdMiddleware } from "./middlewares/correlation-id/correlation-id.middleware";

@Module({
  providers: [CorrelationIdService],
})
export class CorrelationIdModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
  static forRoot(config?: ConfigDTO): DynamicModule {
    return {
      module: CorrelationIdModule,
      providers: [
        CorrelationIdService,
        {
          provide: "CORRELATION_ID_HEADER",
          useValue: config?.headerName || "x-correlation-id",
        },
      ],
      exports: [CorrelationIdService],
    };
  }
}
