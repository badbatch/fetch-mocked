/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import productData from './__testUtils__/data/136-7317.json';
import { ResponseType } from './enums.ts';
import { activeMocks, mockFetch } from './main.ts';

let mockedFetch = mockFetch(vi.fn);

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
      mockedFetch = mockFetch(vi.fn);
    });

    it('should return the mocked fetch to its unmocked state', () => {
      expect(globalThis.fetch).not.toBe(mockedFetch);
    });
  });

  describe('mockRequest', () => {
    describe('matcher', () => {
      describe('when matcher is a full string', () => {
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

          it('should not have called the mock', async () => {
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

      describe('when matcher is a string wildcard', () => {
        let res: Response;

        beforeEach(async () => {
          mockedFetch.mockRequest('*', 'Hello world!');
          res = await fetch('/test');
        });

        it('should have called the mock', () => {
          expect(mockedFetch).toHaveBeenCalledTimes(1);
        });

        it('should return a response', () => {
          expect(res).toBeInstanceOf(Response);
        });
      });

      describe('when matcher string starts with a wildcard', () => {
        beforeEach(() => {
          mockedFetch.mockRequest('*test', 'Hello world!');
        });

        describe('when there is a match', () => {
          let res: Response;

          beforeEach(async () => {
            res = await fetch('/alpha/test');
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
            promise = fetch('/alpha/no-match');
          });

          it('should not have called the mock', async () => {
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

      describe('when matcher string ends with a wildcard', () => {
        beforeEach(() => {
          mockedFetch.mockRequest('/test/*', 'Hello world!');
        });

        describe('when there is a match', () => {
          let res: Response;

          beforeEach(async () => {
            res = await fetch('/test/alpha');
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
            promise = fetch('/no-match/alpha');
          });

          it('should not have called the mock', async () => {
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

      describe('when matcher is a string regex', () => {
        beforeEach(() => {
          mockedFetch.mockRequest(`/alpha$/`, 'Hello world!');
        });

        describe('when there is a match', () => {
          let res: Response;

          beforeEach(async () => {
            res = await fetch('/test/alpha');
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
            promise = fetch('/test/bravo');
          });

          it('should not have called the mock', async () => {
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

      describe('when matcher is a regex', () => {
        beforeEach(() => {
          mockedFetch.mockRequest(/alpha$/, 'Hello world!');
        });

        describe('when there is a match', () => {
          let res: Response;

          beforeEach(async () => {
            res = await fetch('/test/alpha');
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
            promise = fetch('/test/bravo');
          });

          it('should not have called the mock', async () => {
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

      describe('when matcher is a function', () => {
        describe('when there is a match', () => {
          let res: Response;

          beforeEach(async () => {
            mockedFetch.mockRequest(() => true, 'Hello world!');
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
            mockedFetch.mockRequest(() => false, 'Hello world!');
            promise = fetch('/test');
          });

          it('should not have called the mock', async () => {
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

      describe('when matcher is an object', () => {
        describe('when the match is based on the url field', () => {
          beforeEach(() => {
            mockedFetch.mockRequest({ url: '/test' }, 'Hello world!');
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

            it('should not have called the mock', async () => {
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

        describe('when the match is based on the headers field', () => {
          beforeEach(() => {
            mockedFetch.mockRequest({ headers: { 'x-custom-header': 'alpha' } }, 'Hello world!');
          });

          describe('when there is a match', () => {
            let res: Response;

            beforeEach(async () => {
              res = await fetch('/test', {
                headers: { 'x-custom-header': 'alpha' },
              });
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
              promise = fetch('/test', {
                headers: { 'x-custom-header': 'bravo' },
              });
            });

            it('should not have called the mock', async () => {
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

        describe('when the match is based on the method field', () => {
          beforeEach(() => {
            mockedFetch.mockRequest({ method: 'post' }, 'Hello world!');
          });

          describe('when there is a match', () => {
            let res: Response;

            beforeEach(async () => {
              res = await fetch('/test', { method: 'post' });
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
              promise = fetch('/test', { method: 'delete' });
            });

            it('should not have called the mock', async () => {
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

        describe('when the match is based on the body field', () => {
          beforeEach(() => {
            mockedFetch.mockRequest(
              {
                body: {
                  payload: { basket: { id: '12345' } },
                },
              },
              'Hello world!'
            );
          });

          describe('when there is a match', () => {
            let res: Response;

            beforeEach(async () => {
              res = await fetch('/test', {
                body: JSON.stringify({
                  payload: { basket: { id: '12345' } },
                }),
              });
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
              promise = fetch('/test', {
                body: JSON.stringify({
                  payload: { basket: { id: '54321' } },
                }),
              });
            });

            it('should not have called the mock', async () => {
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

        describe('when the match is based on a combination of fields', () => {
          let res: Response;

          beforeEach(async () => {
            mockedFetch.mockRequest(
              {
                body: {
                  ancestorCategories: [
                    {
                      id: '*',
                    },
                  ],
                  optionsInfo: [
                    'colour',
                    {
                      type: 'primary',
                    },
                  ],
                  prices: {
                    clubcardPoints: 339,
                  },
                  userActionable: true,
                },
                headers: { authorization: '12345' },
                method: 'post',
                url: '*',
              },
              'Hello world!'
            );

            res = await fetch('/test', {
              body: JSON.stringify(productData),
              headers: { authorization: '12345' },
              method: 'post',
            });
          });

          it('should have called the mock', () => {
            expect(mockedFetch).toHaveBeenCalledTimes(1);
          });

          it('should return a response', () => {
            expect(res).toBeInstanceOf(Response);
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

    describe('mock options', () => {
      describe('when delay is passed in', () => {
        let res: Response;
        let duration: number;

        beforeEach(async () => {
          mockedFetch.mockRequest('/alpha', 'Hello world!', { delay: 500 });
          const startTime = performance.now();
          res = await fetch('/alpha');
          const endTime = performance.now();
          duration = endTime - startTime;
        });

        it('should delay sending back the mocked response for the correct duration', () => {
          expect(duration).toBeGreaterThanOrEqual(500);
        });

        it('should return a response', () => {
          expect(res).toBeInstanceOf(Response);
        });
      });

      describe('when times is passed in', () => {
        beforeEach(() => {
          mockedFetch.mockRequest('/alpha', 'Hello world!', { times: 2 });
        });

        describe('when requests do not exceed the number of times mock can be used', () => {
          let responses: Response[];

          beforeEach(async () => {
            responses = await Promise.all([fetch('/alpha'), fetch('/alpha')]);
          });

          it('should mock all requests correctly', async () => {
            const result = await Promise.all(responses.map(res => res.json()));
            expect(result).toEqual(['Hello world!', 'Hello world!']);
          });
        });

        describe('when requests exceed the number of times mock can be used', () => {
          let responses: (Response | undefined)[];

          beforeEach(async () => {
            responses = await Promise.all([fetch('/alpha'), fetch('/alpha'), fetch('/alpha')]);
          });

          it('should mock the requests within the times window', () => {
            expect(responses).toEqual(expect.arrayContaining([expect.any(Response), expect.any(Response), undefined]));
          });
        });
      });

      describe('when response type is passed in', () => {
        describe('when response type is "arraybuffer"', () => {
          let res: Response;

          beforeEach(async () => {
            mockedFetch.mockRequest('/alpha', 'Hello world!', { responseType: ResponseType.ARRAY_BUFFER });
            res = await fetch('/alpha');
          });

          it('should return the body as an array buffer', async () => {
            await expect(res.arrayBuffer()).resolves.toBeInstanceOf(ArrayBuffer);
          });

          it('should return the correct body in the response', async () => {
            expect(JSON.parse(new TextDecoder().decode(await res.arrayBuffer()))).toBe('Hello world!');
          });
        });

        describe('when response type is "blob"', () => {
          let res: Response;

          beforeEach(async () => {
            mockedFetch.mockRequest('/alpha', 'Hello world!', { responseType: ResponseType.BLOB });
            res = await fetch('/alpha');
          });

          it('should return the body as a blob', async () => {
            await expect(res.blob()).resolves.toBeInstanceOf(Blob);
          });
        });

        describe('when response type is "formdata"', () => {
          let res: Response;

          beforeEach(async () => {
            mockedFetch.mockRequest('/alpha', { body: { alpha: 'bravo' } }, { responseType: ResponseType.FORM_DATA });
            res = await fetch('/alpha');
          });

          it('should return the body as form data', async () => {
            await expect(res.formData()).resolves.toBeInstanceOf(FormData);
          });
        });

        describe('when response type is "text"', () => {
          let res: Response;

          beforeEach(async () => {
            mockedFetch.mockRequest('/alpha', 'Hello world!', { responseType: ResponseType.TEXT });
            res = await fetch('/alpha');
          });

          it('should return the correct body in the response', async () => {
            await expect(res.text()).resolves.toBe('Hello world!');
          });
        });
      });
    });

    describe('when mockRequest is called', () => {
      let responses: Response[];

      beforeEach(async () => {
        mockedFetch.mockRequest('/alpha', 'Hello world!');
        responses = await Promise.all([fetch('/alpha'), fetch('/alpha'), fetch('/alpha')]);
      });

      it('should have called the mock the correct number of times', () => {
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
