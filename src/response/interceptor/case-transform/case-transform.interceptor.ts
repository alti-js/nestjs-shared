import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

export interface CaseTransformOptions {
  request?: 'snake_case' | 'camel_case';
  response?: 'snake_case' | 'camel_case';
} 

@Injectable()
export class CaseTransformInterceptor implements NestInterceptor {
  constructor(private readonly options: CaseTransformOptions = { 
    request: 'camel_case',
    response: 'snake_case'
  }) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (request.body && this.options.request === 'snake_case') {
      request.body = this.transform(request.body, 'camel_case');
    }

    return next.handle().pipe(
      map((data) => {
        const plain = instanceToPlain(data);
        return this.options.response ? this.transform(plain, this.options.response) : plain;
      }),
    );
  }

  private transform(obj: any, targetCase: 'snake_case' | 'camel_case'): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transform(item, targetCase));
    }

    if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const transformedKey = this.transformKey(key, targetCase);
        acc[transformedKey] = this.transform(value, targetCase);
        return acc;
      }, {} as Record<string, any>);
    }

    return obj;
  }

  private transformKey(str: string, targetCase: 'snake_case' | 'camel_case'): string {
    switch (targetCase) {
      case 'snake_case':
        return this.camelToSnake(str);
      case 'camel_case':
        return this.snakeToCamel(str);
      default:
        return str;
    }
  }

  private camelToSnake(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }
}
