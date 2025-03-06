declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveClass(className: string): R;
    toHaveAttribute(attr: string, value?: string): R;
    toBeWithinRange(floor: number, ceiling: number): R;
  }
}

declare function describe(name: string, fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function afterEach(fn: () => void): void;
declare function beforeAll(fn: () => void): void;
declare function afterAll(fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function expect<T = any>(actual: T): jest.Matchers<void>;

declare module '@testing-library/jest-dom' {
  export {};
}