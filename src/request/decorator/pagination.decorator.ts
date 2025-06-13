import { applyDecorators, Type } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function PaginatedApi(options: {
  summary: string;
  description?: string;
  responseType: Type<unknown>;
  includeSearch?: boolean;
}): MethodDecorator {
  const decorators = [
    ApiOperation({
      summary: options.summary,
    }),
    ApiResponse({
      status: 200,
      description: options.description || 'Returns a paginated list of items',
      type: options.responseType,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number',
      type: Number,
    }),
    ApiQuery({
      name: 'per_page',
      required: false,
      description: 'Number of records per page',
      type: Number,
    }),
  ];

  if (options.includeSearch) {
    decorators.push(
      ApiQuery({
        name: 'search',
        required: false,
        description: 'Search term',
      }),
    );
  }

  return applyDecorators(...decorators);
} 