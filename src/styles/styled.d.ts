import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
      primaryDark: string
      secondary: string
      success: string
      warning: string
      danger: string
      background: string
      text: string
      textLight: string
      white: string
      border: string
      brown: string
      brownLight: string
      bear: string
      bearFur: string
      bearNose: string
      bearEar: string
    }
    fonts: {
      body: string
      heading: string
    }
    breakpoints: {
      mobile: string
      tablet: string
      desktop: string
      wide: string
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      xxl: string
    }
    shadows: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    borderRadius: {
      sm: string
      md: string
      lg: string
      xl: string
      full: string
    }
  }
}
