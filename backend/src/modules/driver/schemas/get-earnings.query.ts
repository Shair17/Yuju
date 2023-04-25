import {Type, Static} from '@sinclair/typebox';
import {
  DEFAULT_PAGE_PAGINATION,
  MAX_ITEMS_PER_PAGE_PAGINATION,
} from '../../../common/constants/app';

export const GetMyEarningsQuery = Type.Object(
  {
    page: Type.Number({minimum: 1, default: DEFAULT_PAGE_PAGINATION}),
    limit: Type.Number({default: MAX_ITEMS_PER_PAGE_PAGINATION}),
  },
  {
    additionalProperties: false,
  },
);
export type GetMyEarningsQueryType = Static<typeof GetMyEarningsQuery>;
