import { Test, TestingModule } from '@nestjs/testing';
import { CorrelationIdService } from './correlation-id.service';

describe('CorrelationIdService', () => {
  let service: CorrelationIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorrelationIdService],
    }).compile();

    service = await module.resolve<CorrelationIdService>(CorrelationIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
