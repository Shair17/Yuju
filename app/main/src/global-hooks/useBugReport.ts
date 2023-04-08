import {zodResolver} from '@hookform/resolvers/zod';
import useAxios from 'axios-hooks';
import {useForm} from 'react-hook-form';
import {CreateBugReportBody, CreateBugReportResponse} from '@yuju/types/app';
import {
  BugReportSchema,
  BugReportFormDataValues,
} from '@yuju/common/schemas/bug-report.schema';

export const useBugReport = () => {
  const [{loading}, executeCreateBugReport] = useAxios<
    CreateBugReportResponse,
    CreateBugReportBody
  >(
    {
      method: 'POST',
      url: '/bug-reports/users',
    },
    {manual: true},
  );
  const {control, handleSubmit, formState} = useForm<BugReportFormDataValues>({
    resolver: zodResolver(BugReportSchema),
  });

  return {
    control,
    handleSubmit,
    formState,
    bugReportIsLoading: loading,
    executeCreateBugReport,
  };
};
