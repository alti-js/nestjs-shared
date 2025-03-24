export class ResponseDTO<T> {
    correlationId: string;
    statusCode: number;
    message: string;
    data: T;
}