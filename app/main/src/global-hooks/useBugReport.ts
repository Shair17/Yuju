import {zodResolver} from '@hookform/resolvers/zod';
import useAxios from 'axios-hooks';
import z from 'zod';
import {useForm} from 'react-hook-form';
import {CreateBugReportBody, CreateBugReportResponse} from '@yuju/types/app';

export const schemaValidator = z.object({
  title: z.string(),
  description: z.string(),
  extra: z.optional(z.string()),
});

type FormDataValues = {
  title: string;
  description: string;
  extra?: string;
};

export const useBugReport = () => {
  const [{loading: bugReportIsLoading}, executeCreateBugReport] = useAxios<
    CreateBugReportResponse,
    CreateBugReportBody
  >(
    {
      method: 'POST',
      url: '/bug-reports/users',
    },
    {manual: true},
  );
  const {control, handleSubmit, formState} = useForm<FormDataValues>({
    resolver: zodResolver(schemaValidator),
  });

  return {
    control,
    handleSubmit,
    formState,
    bugReportIsLoading,
    executeCreateBugReport,
  };
};
