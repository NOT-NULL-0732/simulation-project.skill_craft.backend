export enum ResponseStatusCode {
  REQUEST_SUCCESS = 200,
  // 1000 ~ 1999 通用相关
  COMMON__VALIDATE_ERROR = 1000,
  COMMON_INSERT_UNIQUE_ERROR = 1001,
  // 2000 ~ 2999 鉴权相关
  AUTH__TOKEN_VALIDATOR_ERROR = 2000,
  AUTH__PASSWORD_ERROR = 2001,
  AUTH__TOKEN_DATE_ERROR = 2002,
}

export const StatusMessage: Record<ResponseStatusCode, string> = {
  [ResponseStatusCode.REQUEST_SUCCESS]: '请求成功',
  // 1000 ~ 1999 通用相关
  [ResponseStatusCode.COMMON__VALIDATE_ERROR]: "验证错误",
  // 2000 ~ 2999 鉴权相关
  [ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR]: '令牌验证错误',
  [ResponseStatusCode.AUTH__PASSWORD_ERROR]: "密码错误",
  [ResponseStatusCode.COMMON_INSERT_UNIQUE_ERROR]: "唯一索引",
  [ResponseStatusCode.AUTH__TOKEN_DATE_ERROR]: "令牌过期",
};
