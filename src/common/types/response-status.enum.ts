export enum ResponseStatusCode {
  REQUEST_SUCCESS = 200,
  // 1000 ~ 1999 通用相关
  COMMON__VALIDATE_ERROR = 1000,
  COMMON_INSERT_UNIQUE_ERROR = 1001,
  // 2000 ~ 2999 鉴权相关
  AUTH__TOKEN_VALIDATOR_ERROR = 2000,
  AUTH__PASSWORD_ERROR = 2001,
  AUTH__TOKEN_DATE_ERROR = 2002,
  AUTH__ROLE_IDENTIFICATION_REPEAT_ERROR = 2003,
  AUTH__PERMISSION_IDENTIFICATION_REPEAT_ERROR = 2004,
  AUTH__REPEAT_ADD_ROLE_WITH_USER_ERROR,
  AUTH__REPEAT_ADD_PERMISSION_WITH_ROLE_ERROR,
  AUTH__USER_NOT_LOGIN_ERROR = 2007,
  AUTH__PERMISSION_VALIDATOR_ERROR = 2008,
  // 3000 ~ 3999 课程模块相关
  LESSON__LESSON_NOTFOUND = 3000,
  LESSON__REPEAT_JOIN_LESSON = 3001,
  // 4000 ~ 4999 文件上传相关
  UPLOAD_FILE__OVER_LIMIT_ERROR = 4000,
  UPLOAD_FILE__FILE_WRITE_ERROR = 4001,
  UPLOAD_FILE__DB_WRITE_ERROR = 4002,
  UPLOAD_FILE__UNKNOW_FILE_EXTNAME = 4003
}

export const StatusMessage: Record<ResponseStatusCode, string> = {
  [ResponseStatusCode.REQUEST_SUCCESS]: '请求成功',
  // 1000 ~ 1999 通用相关
  [ResponseStatusCode.COMMON__VALIDATE_ERROR]: '验证错误',
  // 2000 ~ 2999 鉴权相关
  [ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR]: '令牌验证错误',
  [ResponseStatusCode.AUTH__PASSWORD_ERROR]: '密码错误',
  [ResponseStatusCode.COMMON_INSERT_UNIQUE_ERROR]: '唯一索引',
  [ResponseStatusCode.AUTH__TOKEN_DATE_ERROR]: '令牌过期',
  [ResponseStatusCode.AUTH__ROLE_IDENTIFICATION_REPEAT_ERROR]: '角色标识符重复',
  [ResponseStatusCode.AUTH__PERMISSION_IDENTIFICATION_REPEAT_ERROR]:
    '权限标识符重复',
  [ResponseStatusCode.AUTH__USER_NOT_LOGIN_ERROR]: '用户未登录',
  [ResponseStatusCode.AUTH__REPEAT_ADD_ROLE_WITH_USER_ERROR]:
    '为用户重复添加角色',
  [ResponseStatusCode.AUTH__REPEAT_ADD_PERMISSION_WITH_ROLE_ERROR]:
    '为角色重复添加权限',
  [ResponseStatusCode.AUTH__PERMISSION_VALIDATOR_ERROR]: '用户缺少权限',
  // 3000 ~ 3999 课程模块相关
  [ResponseStatusCode.LESSON__LESSON_NOTFOUND]: '课程不存在',
  [ResponseStatusCode.LESSON__REPEAT_JOIN_LESSON]: '重复加入课程',
  // 4000 ~ 4999 文件上传相关
  [ResponseStatusCode.UPLOAD_FILE__OVER_LIMIT_ERROR]: '超出上传配置限制',
  [ResponseStatusCode.UPLOAD_FILE__FILE_WRITE_ERROR]: '文件写入失败',
  [ResponseStatusCode.UPLOAD_FILE__DB_WRITE_ERROR]: '数据库写入失败',
  [ResponseStatusCode.UPLOAD_FILE__UNKNOW_FILE_EXTNAME]: '未知文件扩展名'
};
