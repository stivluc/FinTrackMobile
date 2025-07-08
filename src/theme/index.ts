import { colors } from './colors';

// Thème principal de l'application FinTrack Mobile
export const theme = {
  colors,
  
  // Espacements
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  // Rayons de bordure
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  
  // Typographie
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
    },
    lineHeight: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 28,
    },
  },
  
  // Ombres
  shadows: {
    card: '0 8px 32px rgba(0, 0, 0, 0.6)',
    button: '0 4px 16px rgba(212, 175, 55, 0.3)',
    header: '0 4px 16px rgba(0, 0, 0, 0.4)',
  },
};

export { colors } from './colors';
export default theme;