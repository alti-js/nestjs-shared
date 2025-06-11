import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CommonApiResponses() {
    return applyDecorators(
        ApiResponse({
            status: 400,
            description: 'Bad Request - Invalid input data.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            errorMessage: { type: 'string' },
                            statusCode: { type: 'integer', example: 400 },
                            timestamp: {
                                type: 'string',
                                example: '2025-05-12T08:48:30.630Z',
                            },
                            path: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        }),
        ApiResponse({
            status: 404,
            description:
                'Not Found - The requested resource could not be found.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            errorMessage: { type: 'string' },
                            statusCode: { type: 'integer', example: 404 },
                            timestamp: {
                                type: 'string',
                                example: '2025-05-12T08:48:30.630Z',
                            },
                            path: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        }),
        ApiResponse({
            status: 500,
            description:
                'Internal Server Error - An unexpected error occurred.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            errorMessage: {
                                type: 'string',
                                example:
                                    'An unexpected error occurred. Please try again later.',
                            },
                            statusCode: { type: 'integer', example: 500 },
                            timestamp: {
                                type: 'string',
                                example: '2025-05-12T08:48:30.630Z',
                            },
                            path: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        }),
    );
}
