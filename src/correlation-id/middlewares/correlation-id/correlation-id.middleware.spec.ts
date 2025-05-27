import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { CorrelationIdService } from '../../services/correlation-id/correlation-id.service';

describe('CorrelationIdMiddleware', () => {
  it('should be defined', () => {
    const correlationService = new CorrelationIdService();
    expect(new CorrelationIdMiddleware(correlationService, 'x-correlation-id')).toBeDefined();
  });
});
