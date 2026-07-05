import { type MockFetch } from '../types/index.ts';

export const mockClearLastCall = (mockedFetch: MockFetch): void => {
  mockedFetch.mock.calls.pop();
  mockedFetch.mock.results.pop();

  Object.defineProperty(mockedFetch.mock, 'lastCall', {
    value: undefined,
  });
};
