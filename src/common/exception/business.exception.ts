import { ResponseStatusCode, StatusMessage } from '@/common/types/response-status.enum';

export class BusinessException extends Error {
  constructor(
    public readonly code: ResponseStatusCode,
    message?: string, // 可选参数：允许覆盖默认消息
  ) {
    // 如果未传递 message，则使用映射表中的默认消息
    super(message || StatusMessage[code]);
  }
}
