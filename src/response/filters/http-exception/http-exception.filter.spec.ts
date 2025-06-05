import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus, ArgumentsHost, Logger } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockGetRequest: jest.Mock;
  let mockGetResponse: jest.Mock;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    mockGetRequest = jest.fn().mockReturnValue({
      url: '/test-url',
      headers: {
        'x-correlation-id': 'test-correlation-id'
      }
    });
    mockGetResponse = jest.fn().mockReturnValue({
      status: mockStatus
    });

    mockHost = {
      switchToHttp: () => ({
        getRequest: mockGetRequest,
        getResponse: mockGetResponse
      }),
      getArgs: () => [],
      getArgByIndex: () => null,
      switchToRpc: () => null,
      switchToWs: () => null,
      getType: () => 'http'
    } as unknown as ArgumentsHost;

    filter = new HttpExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should format error response in snake_case', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      status_code: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test-url',
      correlation_id: 'test-correlation-id',
      message: 'Test error'
    });
  });

  it('should handle missing correlation id', () => {
    mockGetRequest.mockReturnValue({
      url: '/test-url',
      headers: {}
    });

    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    
    filter.catch(exception, mockHost);

    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      correlation_id: undefined
    }));
  });


  it('should use alternative correlation-id header if x-correlation-id is not present', () => {
    mockGetRequest.mockReturnValue({
      url: '/test-url',
      headers: {
        'correlation-id': 'alt-correlation-id'
      }
    });

    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    
    filter.catch(exception, mockHost);

    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      correlation_id: 'alt-correlation-id'
    }));
  });

  it('should handle complex error responses', () => {
    const errorResponse = {
      message: ['validation error 1', 'validation error 2'],
      error: 'Bad Request'
    };
    const exception = new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    
    filter.catch(exception, mockHost);

    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      message: errorResponse
    }));
  });
});