# Outcome-Aligned Question Bank AI - Frontend

A professional, modern React application for AI-powered question paper generation with syllabus alignment and quality auditing.

## 🎨 Design System

### Color Palette
- **Primary Blue**: Professional and trustworthy (#3B82F6)
- **Success Green**: Growth and completion (#10B981)
- **Warning Amber**: Attention and caution (#F59E0B)
- **Error Red**: Critical states (#EF4444)
- **Analytics Purple**: Data visualization (#A855F7)
- **Highlight Cyan**: Featured content (#06B6D4)

### Key Features
- ✨ Clean, modern UI with smooth animations
- 📱 Fully responsive design
- 🎯 Educational-focused professional theme
- ♿ Accessibility-first approach
- 🚀 Optimized performance with Vite

## 🛠️ Tech Stack

- **React 18.3.1** - UI Framework
- **TypeScript 5.9.3** - Type Safety
- **Vite 7.3.1** - Build Tool & Dev Server
- **Tailwind CSS 4.1.18** - Styling
- **Framer Motion 11.15.0** - Animations
- **Lucide React** - Icon Library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
