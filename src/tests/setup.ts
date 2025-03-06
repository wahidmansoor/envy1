declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveClass(className: string): R;
    toHaveAttribute(attr: string, value?: string): R;
  }
}

// Basic window mocks for tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    value: () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    }),
    writable: true
  });

  Object.defineProperty(window, 'ResizeObserver', {
    value: class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    writable: true
  });
}

// Suppress specific React warnings during tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('ReactDOM.render is no longer supported')) {
    return;
  }
  originalError.call(console, ...args);
};