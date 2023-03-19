import {Type, Static} from '@sinclair/typebox';
import {
  MAX_ITEMS_PER_PAGE_PAGINATION,
  DEFAULT_PAGE_PAGINATION,
} from '../../../common/constants/app';

export const GetDriverBugReportsQuery = Type.Object(
  {
    page: Type.Number({default: DEFAULT_PAGE_PAGINATION}),
    limit: Type.Number({default: MAX_ITEMS_PER_PAGE_PAGINATION}),
  },
  {
    additionalProperties: false,
  },
);
export type GetDriverBugReportsQueryType = Static<
  typeof GetDriverBugReportsQuery
>;
