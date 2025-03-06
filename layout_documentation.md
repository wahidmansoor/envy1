# Application Layout Documentation

[Previous sections remain unchanged...]

## Data Visualization Components

### Chart Layouts (`src/components/charts/`)

#### 1. Treatment Response Chart
```tsx
<div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={responseData}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#4F46E5"
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
```

#### 2. Protocol Distribution Chart
```tsx
<div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg">
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={protocolData}
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      />
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
```

#### 3. Timeline Visualization
```tsx
<div className="relative py-8">
  {events.map((event, index) => (
    <div key={index} className="flex items-center gap-4">
      <div className="timeline-dot" />
      <div className="timeline-content">
        <!-- Event details -->
      </div>
    </div>
  ))}
</div>
```

## Theme System

### Theme Provider Setup
```tsx
// src/providers/ThemeProvider.tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark' | 'system';
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = 'system'
}) => {
  // Theme implementation
};
```

### Color System
```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    50: '#F5F7FF',
    100: '#EBEEFE',
    200: '#D7DEFE',
    300: '#B4BFFD',
    400: '#8C9DFC',
    500: '#4F46E5', // Primary brand color
    600: '#4338CA',
    700: '#3730A3',
    800: '#312E81',
    900: '#23215B',
  },
  // Additional color palettes...
};
```

### Component Theme Extensions
```typescript
// src/theme/components.ts
export const components = {
  Button: {
    variants: {
      primary: {
        bg: 'primary.500',
        color: 'white',
        _hover: { bg: 'primary.600' },
      },
      // Additional variants...
    },
    sizes: {
      sm: { px: 3, py: 1, fontSize: 'sm' },
      md: { px: 4, py: 2, fontSize: 'md' },
      lg: { px: 6, py: 3, fontSize: 'lg' },
    },
  },
  // Additional component themes...
};
```

### Theme Utilities
```typescript
// src/theme/utils.ts
export const generateThemeVariables = (theme: Theme) => {
  return {
    '--primary-color': theme.colors.primary[500],
    '--secondary-color': theme.colors.secondary[500],
    '--background-color': theme.colors.background,
    '--text-color': theme.colors.text,
    // Additional CSS variables...
  };
};
```

### Custom Theme Extension
```typescript
// src/theme/medical.ts
export const medicalTheme = {
  colors: {
    success: {
      // Specific colors for successful medical outcomes
      healing: '#38A169',
      recovery: '#48BB78',
    },
    warning: {
      // Colors for medical warnings
      mild: '#F6AD55',
      moderate: '#ED8936',
      severe: '#DD6B20',
    },
    clinical: {
      // Clinical environment colors
      sterile: '#F7FAFC',
      scrubs: '#4299E1',
      equipment: '#2C5282',
    },
  },
  // Additional medical-specific theme properties...
};
```

## Layout Grid System

### Grid Configuration
```typescript
// src/theme/grid.ts
export const grid = {
  container: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  gutter: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },
};
```

### Responsive Layouts
```tsx
// Example of responsive grid implementation
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
  {items.map(item => (
    <div key={item.id} className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
      {/* Item content */}
    </div>
  ))}
</div>
```

This completes the comprehensive documentation of the application's layout system, including all major components, themes, and visualization elements. The documentation provides a detailed reference for maintaining consistency in the application's visual design and user experience.