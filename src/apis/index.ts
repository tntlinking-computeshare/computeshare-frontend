// 后端接口
import httpRequest from "@/request";

// 获取验证码：​/v1​/sms​/send
interface smsParams {
  // 目前版本只有国内+86
  countryCallCoding: string,
  telephoneNumber: string
}
export function apiSMS(params: smsParams) {
  return httpRequest({
    url: "/v1/sms/send",
    method: "post",
    data: params,
  });
}

// ​验证码登录：/v1​/user​/login_by_vc
interface smsLoginParams extends smsParams {
  validateCode: string
}
export function apiSMSLogin(params: smsLoginParams) {
  return httpRequest({
    url: "/v1/user/login_by_vc",
    method: "post",
    data: params,
  });
}

// login 密码登录
interface AddLoginParams extends smsParams {
  password: string,
}
export function apiPwdLogin(params: AddLoginParams) {
  return httpRequest({
    url: "/v1/user/login",
    method: "post",
    data: params,
  });
}

export interface basePageInfo {
  page: number,
  size: number,
}