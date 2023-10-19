/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { jest } from '@jest/globals';
import { activeMocks, mockFetch } from './main.ts';

let mockedFetch = mockFetch(jest.fn);

describe('fetch-mocked', () => {
  afterEach(() => {
    mockedFetch.mockReset();
  });

  describe('mockFetch', () => {
    it('should return a mocked fetch with the correct custom methods', () => {
      expect(mockedFetch).toEqual(
        expect.objectContaining({
          mock: expect.any(Object),
          mockDelete: expect.any(Function),
          mockDeleteOnce: expect.any(Function),
          mockGet: expect.any(Function),
          mockGetOnce: expect.any(Function),
          mockPost: expect.any(Function),
          mockPostOnce: expect.any(Function),
          mockPut: expect.any(Function),
          mockPutOnce: expect.any(Function),
          mockRequest: expect.any(Function),
          mockRequestOnce: expect.any(Function),
        })
      );
    });

    it('should have mocked the global fetch', () => {
      expect(globalThis.fetch).toBe(mockedFetch);
    });
  });

  describe('mockRestore', () => {
    beforeEach(() => {
      mockedFetch.mockRestore();
    });

    afterEach(() => {
      mockedFetch = mockFetch(jest.fn);
    });

    it('should return the mocked fetch to its unmocked state', () => {
      expect(globalThis.fetch).not.toBe(mockedFetch);
    });
  });

  describe('mockRequest', () => {
    describe('matcher', () => {
      describe('when matcher is a string', () => {
        beforeEach(() => {
          mockedFetch.mockRequest('/test', 'Hello world!');
        });

        describe('when there is a match', () => {
          let res: Response;

          beforeEach(async () => {
            res = await fetch('/test');
          });

          it('should have called the mock', () => {
            expect(mockedFetch).toHaveBeenCalledTimes(1);
          });

          it('should return a response', () => {
            expect(res).toBeInstanceOf(Response);
          });
        });

        describe('when there is no match', () => {
          let promise: Promise<Response>;

          beforeEach(() => {
            promise = fetch('/no-match');
          });

          it('should have called the mock', async () => {
            try {
              await promise;
            } catch {
              // no catch
            }

            expect(mockedFetch).not.toHaveBeenCalled();
          });

          it('should throw an error', async () => {
            await expect(promise).rejects.toBeInstanceOf(Error);
          });
        });
      });
    });

    describe('response options', () => {
      describe('when response options is a string', () => {
        let res: Response;

        beforeEach(async () => {
          mockedFetch.mockRequest('/test', 'Hello world!');
          res = await fetch('/test');
        });

        it('should return the correct body in the response', async () => {
          await expect(res.json()).resolves.toBe('Hello world!');
        });

        it('should return the correct headers in the response', () => {
          expect([...res.headers]).toEqual([['content-type', 'application/json']]);
        });

        it('should have the correct status in the response', () => {
          expect(res.status).toBe(200);
        });

        it('should have the correct status text in the response', () => {
          expect(res.statusText).toBe('OK');
        });
      });

      describe('when response options is a number', () => {
        let res: Response;

        beforeEach(async () => {
          mockedFetch.mockRequest('/test', 404);
          res = await fetch('/test');
        });

        it('should return the correct body in the response', async () => {
          await expect(res.text()).resolves.toBe('');
        });

        it('should return the correct headers in the response', () => {
          expect([...res.headers]).toEqual([['content-type', 'application/json']]);
        });

        it('should have the correct status in the response', () => {
          expect(res.status).toBe(404);
        });

        it('should have the correct status text in the response', () => {
          expect(res.statusText).toBe('');
        });
      });

      describe('when response options is an object', () => {
        let res: Response;

        beforeEach(async () => {
          mockedFetch.mockRequest('/test', {
            body: 'Oops!',
            headers: { 'x-test': 'alpha' },
            status: 401,
            statusText: 'Unauthorized',
          });

          res = await fetch('/test');
        });

        it('should return the correct body in the response', async () => {
          await expect(res.json()).resolves.toBe('Oops!');
        });

        it('should return the correct headers in the response', () => {
          expect([...res.headers]).toEqual([
            ['content-type', 'application/json'],
            ['x-test', 'alpha'],
          ]);
        });

        it('should have the correct status in the response', () => {
          expect(res.status).toBe(401);
        });

        it('should have the correct status text in the response', () => {
          expect(res.statusText).toBe('Unauthorized');
        });
      });
    });

    describe('when mockRequest is called', () => {
      let responses: Response[];

      beforeEach(async () => {
        mockedFetch.mockRequest('/alpha', 'Hello world!');
        responses = await Promise.all([fetch('/alpha'), fetch('/alpha'), fetch('/alpha')]);
      });

      it('should have called the mock', () => {
        expect(mockedFetch).toHaveBeenCalledTimes(3);
      });

      it('should mock all requests correctly', async () => {
        const result = await Promise.all(responses.map(res => res.json()));
        expect(result).toEqual(['Hello world!', 'Hello world!', 'Hello world!']);
      });

      it('should add the mock to the activeMocks array', () => {
        expect(activeMocks).toHaveLength(1);
      });
    });

    describe('when mockRequest is called multiple times', () => {
      let responses: Response[];

      beforeEach(async () => {
        mockedFetch
          .mockRequest('/alpha', 'Hello world!')
          .mockRequest('/bravo', 'Goodbye world!')
          .mockRequest('/charlie', 'Oops!');

        responses = await Promise.all([fetch('/alpha'), fetch('/alpha'), fetch('/bravo'), fetch('/charlie')]);
      });

      it('should have called the mock the correct number of times', () => {
        expect(mockedFetch).toHaveBeenCalledTimes(4);
      });

      it('should mock all requests correctly', async () => {
        const result = await Promise.all(responses.map(res => res.json()));
        expect(result).toEqual(['Hello world!', 'Hello world!', 'Goodbye world!', 'Oops!']);
      });

      it('should add the mocks to the activeMocks array', () => {
        expect(activeMocks).toHaveLength(3);
      });
    });
  });
});
