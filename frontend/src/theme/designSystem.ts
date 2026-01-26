/**
 * StaffRoom AI Design System
 * Centralized design tokens for consistent academic UI
 */

export const colors = {
  // Primary Colors - Trust & Structure
  primary: {
    blue: '#4A6FA5',      // Soft Blue - navigation, structure
    blueHover: '#3D5A8A', // Darker Blue - button hover
    blueLight: '#6B8EC4', // Lighter Blue - accents
  },
  
  // Secondary Colors - Action & Support
  secondary: {
    slate: '#5C7089',     // Muted Slate - secondary actions
    slateHover: '#4A5A6E',// Darker Slate - hover state
    slateLight: '#7A8CA6',// Lighter Slate
  },
  
  // Accent Colors - Insights & Progress
  accent: {
    green: '#6FAF8E',     // Soft Green - success, progress, high coverage
    orange: '#E9A15B',    // Soft Orange - warnings, medium coverage
    purple: '#8B7FBF',    // Soft Purple - analytics, Bloom taxonomy
    teal: '#5FA8B5',      // Soft Teal - charts, highlights
  },
  
  // Background Colors
  background: {
    primary: '#F5F6F8',   // Neutral Gray - main background
    card: '#FFFFFF',      // Card White - elevated surfaces
    panel: '#FAFBFC',     // Slightly off-white for panels
  },
  
  // Border Colors
  border: {
    default: '#E2E8F0',   // Light border
    light: '#F0F4F8',     // Very light border
  },
  
  // Text Colors
  text: {
    primary: '#1F2933',   // Dark text
    secondary: '#52606D', // Medium text
    muted: '#6B7280',
  },
  
  // Semantic Colors
  semantic: {
    success: '#6FAF8E',   // Soft Green
    successDark: '#4F9070',
    error: '#E76F6F',     // Soft Red
    errorDark: '#D64545',
    warning: '#E9A15B',   // Soft Orange
    warningDark: '#D18A45',
    info: '#5FA8B5',      // Soft Teal
  },
};

export const typography = {
  fontFamily: {
    primary: 'Inter, system-ui, -apple-system, sans-serif',
  },
  
  fontSize: {
    h1: '2rem',      // 32px - Page titles
    h2: '1.5rem',    // 24px - Section titles
    h3: '1.25rem',   // 20px - Subsection titles
    body: '1rem',    // 16px - Body text
    small: '0.875rem', // 14px - Helper text
    tiny: '0.75rem',   // 12px - Meta text
  },
  
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
};

export const shadows = {
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  cardHover: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
};

export const components = {
  // Button Styles
  button: {
    primary: {
      bg: colors.primary.blue,
      text: '#FFFFFF',
        hover: colors.primary.blueHover,
      padding: '0.75rem 2rem',
      borderRadius: borderRadius.md,
    },
    secondary: {
      bg: 'transparent',
        text: colors.secondary.slate,
        border: `1px solid ${colors.border.default}`,
      hover: colors.background.primary,
      padding: '0.75rem 2rem',
      borderRadius: borderRadius.md,
    },
      success: {
        bg: colors.accent.green,
        text: '#FFFFFF',
        hover: colors.semantic.successDark,
        padding: '0.75rem 2rem',
        borderRadius: borderRadius.md,
      },
  },
  
  // Card Styles
  card: {
    bg: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadow: shadows.card,
  },
  
  // Input Styles
  input: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.md,
    padding: '0.625rem 0.875rem',
    fontSize: typography.fontSize.body,
  },
};

// CSS-in-JS helper
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
};

export default theme;
