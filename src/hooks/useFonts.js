import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'SukhumvitSet-Light': require('../../assets/fonts/SukhumvitSet-Light.ttf'),
    'SukhumvitSet-Medium': require('../../assets/fonts/SukhumvitSet-Medium.ttf'),
    'SukhumvitSet-SemiBold': require('../../assets/fonts/SukhumvitSet-SemiBold.ttf'),
    'SukhumvitSet-Bold': require('../../assets/fonts/SukhumvitSet-Bold.ttf'),
  });

  return fontsLoaded;
};
