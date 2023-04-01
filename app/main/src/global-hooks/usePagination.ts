import {useState, useEffect} from 'react';
import {useRequest} from './useRequest';

interface Response<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

interface Props {
  url: string;
  defaultPage?: number;
}

export const usePagination = <T extends {id: string}>({
  url,
  defaultPage = 1,
}: Props) => {
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [page, setPage] = useState<number>(defaultPage);
  const [myData, setMyData] = useState<T[]>([]);
  const {data, isLoading} = useRequest<Response<T>>({
    method: 'GET',
    url,
    params: {
      page,
    },
  });

  const handleAddMoreItems = () => {
    if (isLoading || !data || !hasNextPage) return;

    setPage(page + 1);
  };

  useEffect(() => {
    if (data) {
      if (page > data.totalPages || !data.data.length) {
        setHasNextPage(false);
      }

      const newData = data.data.filter(
        report => !myData.find(o => o.id === report.id),
      );
      setMyData(prev => [...prev, ...newData]);
    }
  }, [page, data]);

  return {
    isLoading: isLoading || !data,
    myData,
    handleAddMoreItems,
  };
};
