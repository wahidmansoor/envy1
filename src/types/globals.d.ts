/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefined(): R;
      toBe(expected: any): R;
      toBeGreaterThan(expected: number): R;
      toBeLessThan(expected: number): R;
      toBeGreaterThanOrEqual(expected: number): R;
      toBeLessThanOrEqual(expected: number): R;
      toThrow(expected?: string | Error | RegExp): R;
      toMatch(expected: string | RegExp): R;
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }

  // Declare test functions globally
  const describe: (name: string, fn: () => void) => void;
  const test: (name: string, fn: () => void | Promise<void>) => void;
  const it: (name: string, fn: () => void | Promise<void>) => void;
  const expect: <T = any>(actual: T) => jest.Matchers<void>;
  const beforeAll: (fn: () => void | Promise<void>) => void;
  const afterAll: (fn: () => void | Promise<void>) => void;
  const beforeEach: (fn: () => void | Promise<void>) => void;
  const afterEach: (fn: () => void | Promise<void>) => void;
}

// Add module declarations
declare module '*.css';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

// Declare test environment globals
interface Window {
  ResizeObserver: any;
  matchMedia: (query: string) => {
    matches: boolean;
    addListener: () => void;
    removeListener: () => void;
  };
}

// Export an empty object to make this a module
export {};