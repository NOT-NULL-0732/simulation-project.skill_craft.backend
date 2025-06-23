export enum ResponseStatusCode {
  REQUEST_SUCCESS = 200,
}

export const StatusMessage: Record<ResponseStatusCode, string> = {
  [ResponseStatusCode.REQUEST_SUCCESS]: '请求成功',
};
