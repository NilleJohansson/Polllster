// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// interface ApiResponse<T> {
//   data: T;
//   status: number;
// }

// class ApiClient {
//   private axiosInstance: AxiosInstance;

//   constructor(baseURL: string) {
//     this.axiosInstance = axios.create({
//       baseURL,
//       headers: {
//         'Content-Type': 'application/json'
//         // You can add any default headers or configuration here
//       },
//     });

//     // Add any request/response interceptors or other configurations as needed
//     this.axiosInstance.interceptors.request.use(this.handleRequest);
//     this.axiosInstance.interceptors.response.use(this.handleResponse, this.handleError);
//   }

//   private handleRequest<T>(config: InternalAxiosRequestConfig<T>): InternalAxiosRequestConfig<T> {
//     // You can modify the request config here (e.g., adding authentication headers)
//     return config;
//   }

//   private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): AxiosResponse<ApiResponse<T>> {
//     // You can handle the response here (e.g., logging, error handling)
//     return response;
//   }

//   private handleError(error: any): Promise<never> {
//     // You can handle errors here (e.g., logging, displaying error messages)
//     return Promise.reject(error);
//   }

//   public get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
//     return this.axiosInstance.get(url, config);
//   }

//   public post<T>(url: string, data?: any, config?: w): Promise<ApiResponse<T>> {
//     return this.axiosInstance.post(url, data, config);
//   }

//   // Add other HTTP methods as needed (e.g., put, delete, etc.)

//   // You can also add more custom methods or configurations as needed
// }

// export default ApiClient;

import { useState, useEffect } from "react";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import useAuth from "../context/useAuth";

interface ApiResponse<T> {
  data: T;
  status: number;
}

const useApiClient = (baseURL: string) => {
  const { user } = useAuth();
  const [axiosInstance] = useState(() =>
    axios.create({
      baseURL,
      // withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        // You can add any default headers or configuration here
      },
    })
  );

  const handleRequest = <T>(
    config: InternalAxiosRequestConfig<T>
  ): InternalAxiosRequestConfig<T> => {
    // You can modify the request config here (e.g., adding authentication headers)

    if (user) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return config;
  };

  const handleResponse = <T>(
    response: AxiosResponse<ApiResponse<T>>
  ): AxiosResponse<ApiResponse<T>> => {
    console.log("API REQUEST RESPONSE", response.status);

    // You can handle the response here (e.g., logging, error handling)
    return response;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any): Promise<any> => {
    if (error.response?.status === 401) {
      return refreshTokenAndRetry(error.config);
    }
    // You can handle errors here (e.g., logging, displaying error messages)
    return Promise.reject(error);
  };

  const refreshTokenAndRetry = (
    originalRequestConfig: AxiosRequestConfig
  ): Promise<unknown> => {
    return refreshAccessToken()
      .then((newAccessToken) => {
        if (originalRequestConfig.headers) {
        // Update the Authorization header with the new access token
        originalRequestConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Retry the original request with the updated config
        return axiosInstance(originalRequestConfig);
      })
      .catch((refreshError) => {
        // Handle the error if refreshing the token fails
        return Promise.reject(refreshError);
      });
  };

  const refreshAccessToken = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await post<any>("refreshtoken");
    console.log("Refresh access token response");
    
    return Promise.resolve("newAccessToken"); // Placeholder, replace with actual implementation
  };

  const get = <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.get(url, config);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post = <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.post(url, data, config);
  };

  const put = <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.put(url, data, config);
  };

  const del = <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.delete(url, config);
  };

  // Add other HTTP methods as needed (e.g., put, delete, etc.)

  // You can also add more custom methods or configurations as needed

  useEffect(() => {
    // Add any cleanup logic if needed

    // Add request interceptor
    const requestInterceptor =
      axiosInstance.interceptors.request.use(handleRequest);

    // Add response interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      handleResponse,
      handleError
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance]);

  return { get, post, put, del };
};

export default useApiClient;
