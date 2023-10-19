import type { MockFetch } from '../types.ts';

export const mockClearLastCall = (mockedFetch: MockFetch) => {
  mockedFetch.mock.calls.pop();
  mockedFetch.mock.results.pop();
  mockedFetch.mock.lastCall = undefined;
};
