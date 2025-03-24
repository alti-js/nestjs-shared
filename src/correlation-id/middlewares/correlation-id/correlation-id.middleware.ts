import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CorrelationIdService } from "../../services/correlation-id/correlation-id.service";

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(
    private readonly generatorService: CorrelationIdService,
    @Inject('CORRELATION_ID_HEADER') private readonly correlationIdHeader: string
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // We check if we already have a correlation ID set for this request
    const currentCorrelationId = this.generatorService.getCorrelationId();
    const header = this.correlationIdHeader;

    // If we don't have the correlation ID already set
    if (!currentCorrelationId) {
      const providedCorrelationId = req.headers[header] as string;
      this.generatorService.setCorrelationId(providedCorrelationId ?? uuidv4());
    }

    // Setting the correlation ID in both request and response if not present
    req.headers[header] = this.generatorService.getCorrelationId();
    res.setHeader(header, this.generatorService.getCorrelationId());

    // Continuing the request lifecycle
    next();
  }
}