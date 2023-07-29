import axios from "axios";
import { LENS_API_BASE_URL } from "../constants/constant";

const instance = axios.create({
  baseURL: LENS_API_BASE_URL, // 设置你的API基本URL
  timeout: 300000, // 设置请求超时时间
});

instance.interceptors.response.use(
  (res) => {
    return res.data;
  }, // 拦截到响应对象，将响应对象的 data 属性返回给调用的地方
  (err) => Promise.reject(err),
);

export const Trending = (data, config) => instance.post("", data, config);
