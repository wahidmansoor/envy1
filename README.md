# Oncology AI Web App

## Test Setup Instructions

1. Install test dependencies:
```bash
npm install --save-dev jest @types/jest @testing-library/jest-dom @testing-library/react @jest/globals ts-jest jest-environment-jsdom
```

2. Install types:
```bash
npm install --save-dev @types/testing-library__jest-dom
```

3. Run tests:
```bash
npm test
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Project Structure

- `src/tests/` - Test files and setup
- `src/services/calculators/` - Medical calculation services
- `src/components/` - React components
- `src/types/` - TypeScript type definitions

## Testing Guidelines

1. Place test files adjacent to the code they are testing
2. Use `.test.ts` or `.test.tsx` extension for test files
3. Follow the testing structure:
   - Arrange: Set up test data
   - Act: Perform the test
   - Assert: Check the results

### Example Test Structure

```typescript
import { describe, it, expect } from '@jest/globals';

describe('Component or Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const testData = {};

    // Act
    const result = functionUnderTest(testData);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

## Notes

- Make sure to run `npm install` after pulling new changes
- All tests must pass before submitting a pull request
- Use test coverage reports to ensure adequate testing
"# envy1" 
