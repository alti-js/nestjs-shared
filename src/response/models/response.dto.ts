export class ResponseDTO<T> {
  correlationId: string;
  statusCode: number;
  message: string;
  request: string;
  data: T;
}
