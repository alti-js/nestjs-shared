import { ExecutionContext, CallHandler } from '@nestjs/common';
import { CaseTransformInterceptor } from './case-transform.interceptor';
import { of } from 'rxjs';

describe('CaseTransformInterceptor', () => {
  let interceptor: CaseTransformInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new CaseTransformInterceptor();

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          body: {}
        })
      })
    } as any;

    mockCallHandler = {
      handle: () => of({})
    } as any;
  });

  describe('request transformation', () => {
    it('should transform snake_case request body to camelCase when request option is snake_case', async () => {
      const interceptor = new CaseTransformInterceptor({ request: 'snake_case' });
      const request = {
        body: {
          first_name: 'John',
          last_name: 'Doe',
          contact_info: {
            phone_number: '123456789',
            email_address: 'john@example.com'
          },
          favorite_colors: ['light_blue', 'dark_red']
        }
      };

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request
        })
      } as any;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe();

      expect(request.body).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        contactInfo: {
          phoneNumber: '123456789',
          emailAddress: 'john@example.com'
        },
        favoriteColors: ['light_blue', 'dark_red']
      });
    });

    it('should not transform request body when request option is camel_case (default)', async () => {
      const originalBody = {
        firstName: 'John',
        lastName: 'Doe'
      };
      
      const request = { body: { ...originalBody } };
      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request
        })
      } as any;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe();

      expect(request.body).toEqual(originalBody);
    });
  });

  describe('response transformation', () => {
    it('should transform camelCase response to snake_case', (done) => {
      mockCallHandler = {
        handle: () => of({
          firstName: 'John',
          lastName: 'Doe',
          contactInfo: {
            phoneNumber: '123456789',
            emailAddress: 'john@example.com'
          },
          favoriteColors: ['light_blue', 'dark_red']
        })
      } as any;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
        expect(result).toEqual({
          first_name: 'John',
          last_name: 'Doe',
          contact_info: {
            phone_number: '123456789',
            email_address: 'john@example.com'
          },
          favorite_colors: ['light_blue', 'dark_red']
        });
        done();
      });
    });

    it('should not transform response when response option is not set', (done) => {
      const interceptor = new CaseTransformInterceptor({ response: undefined });
      const originalResponse = {
        firstName: 'John',
        lastName: 'Doe'
      };

      mockCallHandler = {
        handle: () => of(originalResponse)
      } as any;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
        expect(result).toEqual(originalResponse);
        done();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null values', (done) => {
      mockCallHandler = {
        handle: () => of({
          firstName: null,
          contactInfo: null
        })
      } as any;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
        expect(result).toEqual({
          first_name: null,
          contact_info: null
        });
        done();
      });
    });

    it('should handle Date objects', (done) => {
      const date = new Date();
      mockCallHandler = {
        handle: () => of({
          createdAt: date
        })
      } as any;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
        expect(result).toEqual({
          created_at: date
        });
        done();
      });
    });

    it('should handle empty objects', (done) => {
      mockCallHandler = {
        handle: () => of({})
      } as any;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
        expect(result).toEqual({});
        done();
      });
    });
  });
}); 