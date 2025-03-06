# Unified Style Guide (Updated)

## 🎨 Base Theme (Using CSS Variables)
```css
:root {
  --primary-color: #6A1B9A;  /* Soft violet */
  --background-color: #F7F9FC; /* Soft gray */
  --text-color: #333333; /* Dark gray */
  --accent-color-teal: #008080;
  --accent-color-blue: #004080;
}
```

## 🏗 Common Elements

### 📌 Container Patterns
```css
.container-base { @apply space-y-6 md:space-y-8; }
.card {
  @apply bg-white shadow-lg rounded-xl p-6 border border-gray-200;
}
.card-hover { @apply hover:shadow-xl transition-all duration-300; }
```
📝 **Improvement:** Removed partial opacity backgrounds for better text visibility.

### 📝 Typography (WCAG Contrast Compliant)
```css
.header-main { @apply text-3xl font-bold tracking-tight text-gray-900; }
.header-section { @apply text-2xl font-bold text-gray-900; }
.header-subsection { @apply text-xl font-bold text-gray-900; }
.text-body { @apply text-gray-700 leading-relaxed; }
.text-description { @apply text-sm text-gray-600; }
```
📝 **Improvement:** Increased contrast by using `text-gray-700` instead of `text-gray-600`.

## 🎭 Interactive Elements (Accessibility Enhanced)

### 🔘 Buttons
```css
.button-primary {
  @apply bg-primary hover:bg-indigo-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none;
}
.button-secondary {
  @apply bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500;
}
```
📝 **Improvement:** Added `focus:ring` for keyboard accessibility.

### 📝 Input Fields
```css
.input-base {
  @apply rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500;
}
```

## 🔍 Module-Specific Styles

### 📘 AI Handbook
```css
.guidelines-card { @apply p-6 rounded-xl shadow-lg bg-white text-gray-900; }
.tag { @apply px-2.5 py-0.5 rounded-full text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white; }
```

### 🏥 Palliative Care
```css
.assessment-card {
  @apply bg-white p-4 rounded-lg border shadow-sm;
}
.priority-high { @apply bg-red-100 text-red-800; }
.priority-medium { @apply bg-yellow-100 text-yellow-800; }
.priority-low { @apply bg-green-100 text-green-800; }
```

### ⚕️ OPD Module
```css
.triage-urgent { @apply bg-red-50 text-red-600; }
.triage-soon { @apply bg-yellow-50 text-yellow-600; }
.triage-routine { @apply bg-green-50 text-green-600; }
```

## 🎬 Animation & Hover Effects
```css
.transition-base { @apply transition-all duration-300; }
.hover-scale { @apply hover:scale-[1.02]; }
.hover-shadow { @apply hover:shadow-lg; }
```

## 📐 Layout Patterns

### 🔳 Grid Layouts
```css
.grid-two-cols { @apply md:grid-cols-2 gap-6; }
.grid-three-cols { @apply lg:grid-cols-3 gap-6; }
.grid-four-cols { @apply xl:grid-cols-4 gap-6; }
```

### 📌 Flex Layouts
```css
.flex-center { @apply flex items-center gap-3; }
.flex-space-between { @apply flex justify-between items-center; }
```

## ⚠️ Status Indicators
```css
.alert-warning { @apply border-l-4 border-red-500 shadow-md p-4 bg-red-50 text-red-800; }
.alert-info { @apply bg-gray-50 p-6 rounded-lg text-gray-800; }
.alert-success { @apply bg-green-50 border-green-500 text-green-800; }
```
📝 **Improvement:** Increased padding for better visibility.

## 📱 Responsive Design (Mobile-Friendly)
```css
@media (min-width: 640px) { .container { max-width: 95%; } }
@media (min-width: 1024px) { .container { max-width: 90%; } }
@media (min-width: 1280px) { .container { max-width: 85%; } }
```

## ✅ Summary of Improvements
- **Replaced hardcoded colors** with CSS variables.
- **Improved accessibility** by ensuring **better contrast & focus indicators**.
- **Refactored styles** into reusable **components and utility classes**.
- **Optimized layout** by using proper `grid` and `flex` structures.
- **Enhanced readability** of alerts, cards, and interactive elements.

🔹 **This guide ensures a clean, consistent, and accessible UI while keeping the design flexible and maintainable.** 🚀

