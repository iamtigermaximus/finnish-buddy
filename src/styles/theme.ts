// src/styles/theme.ts
export const theme = {
  colors: {
    primary: "#667eea",
    primaryDark: "#5a67d8",
    secondary: "#764ba2",
    success: "#48bb78",
    warning: "#ed8936",
    danger: "#f56565",
    brown: "#8B4513",
    brownLight: "#D2691E",
    bear: "#8B6914",
    bearFur: "#8B6914",
    bearNose: "#3E2723",
    bearEar: "#A0822A",
    text: "#1a1a2e",
    textLight: "#666666",
    background: "#f5f7fa",
    white: "#ffffff",
    border: "#e0e0e0",
  },

  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
};

export type Theme = typeof theme;
