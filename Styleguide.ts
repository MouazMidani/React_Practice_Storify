import Color from 'color'
import { TextStyle, ViewStyle } from "react-native";
import { useWindowDimensions } from 'react-native';

const generateShades = (baseColorHex: string): {} => {
  const base = Color(baseColorHex);
  return {
    50: base.lighten(0.6).hex(),
    100: base.lighten(0.5).hex(),
    200: base.lighten(0.4).hex(),
    300: base.lighten(0.3).hex(),
    400: base.lighten(0.15).hex(),
    500: base.hex(),
    600: base.darken(0.1).hex(),
    700: base.darken(0.2).hex(),
    800: base.darken(0.3).hex(),
    900: base.darken(0.4).hex(),
  }
}

export const breakpoints = {
  sm: 640,  // small
  md: 768,  // medium
  lg: 1024, // large
  xl: 1280, // extra large
  '2xl': 1536,
}

export const useResponsive = () => {
  const { width } = useWindowDimensions()

  return {
    isSm: width < breakpoints.sm,
    isMd: width >= breakpoints.sm,
    isLg: width >= breakpoints.md,
    isXl: width >= breakpoints.lg,
    is2xl: width >= breakpoints.xl,
    width,
  }
}

export const Colors = {
  black: '#000000',
  oxfordBlue: '#14213D',
  orangeWeb: '#FCA311',
  platinum: '#E5E5E5',
  white: '#FFFFFF',

  oxfordBlueShades: generateShades('#14213D'),
  orangeWebShades: generateShades('#FCA311'),
  platinumShades: generateShades('#E5E5E5'),

  primary: '#FCA311',
  secondary: '#14213D',

  // Additional colors from Tailwind config
  brand: '#FCA311',
  brandShades: generateShades('#FCA311'),
  light: {
    100: '#14213D',
    200: '#6B7280',
    300: '#D1D5DB',
    400: '#E5E5E5',
  },
  error: '#EF4444',
  red: '#DC2626',
}

export const util: {
  center: ViewStyle;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  subtitle1: TextStyle;
  subtitle2: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  button: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
} = {
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 42
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 36
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28
  },
  h4: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 20
  },
  h5: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20
  },
  body1: {
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 24
  },
  body2: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20
  },
  button: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: 16
  },
  overline: {
    fontSize: 10,
    fontWeight: "normal",
    lineHeight: 14
  },
};

export default Colors