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
      url: '/bug-reports/drivers',
    },
    {manual: true},
  );
  const {control, handleSubmit, formState, clearErrors, reset} =
    useForm<BugReportFormDataValues>({
      resolver: zodResolver(BugReportSchema),
    });

  return {
    clearErrors,
    reset,
    control,
    handleSubmit,
    formState,
    bugReportIsLoading: loading,
    executeCreateBugReport,
  };
};
