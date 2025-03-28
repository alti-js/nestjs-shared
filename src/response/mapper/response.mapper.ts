import { ResponseDTO } from "../models/response.dto";

export class ResponseMapper {
  public static toResponseDTO<T>(
    correlationId: string,
    statusCode: number,
    data: T,
    request: string,
    message?: string
  ): ResponseDTO<T> {
    return {
      correlationId,
      message,
      statusCode,
      data,
      request,
    };
  }
}
