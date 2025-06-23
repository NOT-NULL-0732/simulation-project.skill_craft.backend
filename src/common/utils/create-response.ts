import { ResponseStatusCode, StatusMessage } from '@/common/types/response-status.enum';

export interface ResponseData<T = undefined> {
  code: ResponseStatusCode; // 业务状态码
  message: string; // 提示消息（自动从枚举映射）
  data?: T; // 业务数据（可选）
}

export function createResponse<T>(
  code: ResponseStatusCode,
  data?: T,
  customMessage?: string, // 可选：覆盖默认消息
): ResponseData<T> {
  return {
    code,
    message: customMessage || StatusMessage[code], // 自动填充消息
    data,
  };
}
