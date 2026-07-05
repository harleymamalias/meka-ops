import { paginate, paginationOptions } from './pagination.util';

describe('pagination utilities', () => {
  it('calculates skip and take from query values', () => {
    expect(paginationOptions({ page: 3, limit: 10 })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
      take: 10,
    });
  });

  it('wraps data with pagination metadata', () => {
    expect(paginate(['a', 'b'], 11, 2, 5)).toEqual({
      data: ['a', 'b'],
      meta: {
        total: 11,
        page: 2,
        limit: 5,
        totalPages: 3,
      },
    });
  });
});
