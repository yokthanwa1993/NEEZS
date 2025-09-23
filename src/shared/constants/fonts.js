// Font family constants for Sukhumvit Set
export const FONTS = {
  light: 'SukhumvitSet-Light',
  regular: 'SukhumvitSet-Medium',
  medium: 'SukhumvitSet-Medium',
  semiBold: 'SukhumvitSet-SemiBold',
  bold: 'SukhumvitSet-Bold',
  extraBold: 'SukhumvitSet-Bold',
};

// Font weight mapping for cross-platform compatibility
export const FONT_WEIGHTS = {
  300: 'SukhumvitSet-Light',
  400: 'SukhumvitSet-Medium',
  500: 'SukhumvitSet-Medium', 
  600: 'SukhumvitSet-SemiBold',
  700: 'SukhumvitSet-Bold',
  800: 'SukhumvitSet-Bold',
  900: 'SukhumvitSet-Bold',
};

// Helper function to get font family based on weight
export const getFontFamily = (weight = 400) => {
  return FONT_WEIGHTS[weight] || FONTS.regular;
};
