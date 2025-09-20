import React from 'react';
import { Text as RNText, TextInput as RNTextInput } from 'react-native';
import { FONTS, getFontFamily } from '../constants/fonts';

// Enhanced Text component with Sukhumvit Set font
export const Text = ({ style, weight, ...props }) => {
  const fontFamily = weight ? getFontFamily(weight) : FONTS.regular;
  const textStyle = [{ fontFamily }, ...(Array.isArray(style) ? style : [style])];
  
  return <RNText style={textStyle} {...props} />;
};

// Enhanced TextInput component with Sukhumvit Set font
export const TextInput = ({ style, weight, ...props }) => {
  const fontFamily = weight ? getFontFamily(weight) : FONTS.regular;
  const inputStyle = [{ fontFamily }, ...(Array.isArray(style) ? style : [style])];
  
  return <RNTextInput style={inputStyle} {...props} />;
};

// Pre-defined text components with different weights
export const LightText = (props) => <Text weight={300} {...props} />;
export const RegularText = (props) => <Text weight={400} {...props} />;
export const MediumText = (props) => <Text weight={500} {...props} />;
export const SemiBoldText = (props) => <Text weight={600} {...props} />;
export const BoldText = (props) => <Text weight={700} {...props} />;
export const ExtraBoldText = (props) => <Text weight={800} {...props} />;

// Heading components
export const H1 = (props) => <Text weight={700} style={{ fontSize: 32 }} {...props} />;
export const H2 = (props) => <Text weight={600} style={{ fontSize: 28 }} {...props} />;
export const H3 = (props) => <Text weight={600} style={{ fontSize: 24 }} {...props} />;
export const H4 = (props) => <Text weight={500} style={{ fontSize: 20 }} {...props} />;
export const H5 = (props) => <Text weight={500} style={{ fontSize: 18 }} {...props} />;
export const H6 = (props) => <Text weight={500} style={{ fontSize: 16 }} {...props} />;

export default Text;
