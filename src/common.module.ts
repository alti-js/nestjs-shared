import { DynamicModule, Module } from "@nestjs/common";
import { CorrelationIdModule } from "./correlation-id/correlation-id.module";
import { ResponseModule } from "./response/response.module";
import { ConfigDTO } from "./common/models/config.dto";

@Module({})
export class CommonModule {
  static forRoot(config?: ConfigDTO): DynamicModule {
    const correlationIdModule = CorrelationIdModule.forRoot(
      config?.correlationConfig
    );
    const responseModule = ResponseModule.forRoot();
    return {
      global: true,
      module: CommonModule,
      imports: [correlationIdModule, responseModule],
      exports: [correlationIdModule, responseModule],
    };
  }
}
