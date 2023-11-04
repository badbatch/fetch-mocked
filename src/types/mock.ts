/* eslint-disable @typescript-eslint/no-explicit-any */

interface MockResultReturn<T> {
  type: 'return';
  value: T;
}

interface MockResultIncomplete {
  type: 'incomplete';
  value: undefined;
}

interface MockResultThrow {
  type: 'throw';
  value: any;
}

type MockResult<T> = MockResultReturn<T> | MockResultThrow | MockResultIncomplete;

interface MockContext<TArgs, TReturns> {
  calls: TArgs[];
  instances: TReturns[];
  invocationCallOrder: number[];
  lastCall?: TArgs;
  results: MockResult<TReturns>[];
}

interface SpyInstance<TArgs extends any[] = any[], TReturns = any> {
  getMockImplementation(): ((...args: TArgs) => TReturns) | undefined;
  getMockName(): string;
  mock: MockContext<TArgs, TReturns>;
  mockClear(): this;
  mockImplementation(function_: ((...args: TArgs) => TReturns) | (() => Promise<TReturns>)): this;
  mockImplementationOnce(function_: ((...args: TArgs) => TReturns) | (() => Promise<TReturns>)): this;
  mockName(n: string): this;
  mockRejectedValue(obj: any): this;
  mockRejectedValueOnce(obj: any): this;
  mockReset(): this;
  mockResolvedValue(obj: Awaited<TReturns>): this;
  mockResolvedValueOnce(obj: Awaited<TReturns>): this;
  mockRestore(): void;
  mockReturnThis(): this;
  mockReturnValue(obj: TReturns): this;
  mockReturnValueOnce(obj: TReturns): this;
}

export type FunctionLike = (...args: any) => any;

interface Mock<TArgs extends any[] = any, TReturns = any> extends SpyInstance<TArgs, TReturns> {
  new (...args: TArgs): TReturns;
  (...args: TArgs): TReturns;
}

export type MockedFunction<T extends FunctionLike> = Mock<Parameters<T>, ReturnType<T>> & {
  [K in keyof T]: T[K];
};
