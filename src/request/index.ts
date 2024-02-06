// axios的二次封装
import axios from "axios";

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: "/api", // 所有的请求地址前缀部分
  timeout: 180000, // 请求超时时间毫秒
  headers: {
    // 设置后端需要的传参类型
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // 允许发送请求时携带跨域 cookie
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem("token") || '';
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      (config as Recordable).headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    // console.log(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response: any) {
    // console.log(response);
    // 2xx 范围内的状态码都会触发该函数。
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data;
    // 这个状态码是和后端约定的
    const code = dataAxios.reset;
    return dataAxios;
  },
  function (error: any) {
    console.log('error11111111111111',error)
    if(error.code === "ERR_CANCELED"){
      // 请求取消
      return {
        code: -10001,
        message: '已取消'
      }
    }else if (error.response.status === 401) {
      localStorage.setItem('token', '');
      window.location.href = '/login';
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // console.log('对响应错误做点什么::',error);
    return error.response.data;
  }
);
export default service;
