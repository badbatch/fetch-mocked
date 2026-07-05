export interface Counter {
  limit: number;
  total: number;
}

export const createCounter = (limit = Infinity): Counter => ({ limit, total: 0 });
