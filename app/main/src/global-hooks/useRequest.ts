import useSWR, {SWRConfiguration, SWRResponse} from 'swr';
import {http as axios} from '@yuju/services/http';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

export type GetRequest = AxiosRequestConfig | null;

interface Return<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'error' | 'mutate'
  > {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
  isLoading: boolean;
  isError: boolean;
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'fallbackData'
  > {
  fallbackData?: Data;
}

export function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  {fallbackData, ...config}: Config<Data, Error> = {},
): Return<Data, Error> {
  const {
    data: response,
    error,
    isValidating,
    mutate,
    isLoading,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    request ? JSON.stringify(request) : null,
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => axios.request<Data>(request!),
    {
      ...config,
      fallbackData: fallbackData && {
        status: 200,
        statusText: 'InitialData',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config: request!,
        headers: {},
        data: fallbackData,
      },
    },
  );

  return {
    isLoading,
    isError: !!error,
    isValidating,
    data: response && response.data,
    response,
    error,
    mutate,
  };
}
