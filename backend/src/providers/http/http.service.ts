import {Service} from 'fastify-decorators';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

@Service('HttpServiceToken')
export class HttpService {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create();
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<T, any>> {
    return this.axios.get<T>(url, config);
  }

  post<T = any>(
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<T, any>> {
    return this.axios.post<T>(url, config);
  }

  put<T = any>(
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<T, any>> {
    return this.axios.put<T>(url, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<T, any>> {
    return this.axios.delete<T>(url, config);
  }
}
