// Expo dynamic app config to keep secrets like Google Maps API keys out of VCS.
// Reads values from environment variables if provided.

module.exports = ({ config }) => {
  return {
    ...config,
    name: 'NEEZS Job App',
    slug: 'neezs-job-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'neezs-job-app',
    assetBundlePatterns: ['**/*'],
    plugins: [
      'expo-font',
      'expo-web-browser',
    ],
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER || config?.ios?.bundleIdentifier,
      supportsTablet: true,
      config: {
        ...(config.ios?.config || {}),
        // Provide Google Maps API key for iOS when using Google provider
        googleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY || config?.ios?.config?.googleMapsApiKey,
      },
      infoPlist: {
        ...(config.ios?.infoPlist || {}),
        NSPhotoLibraryUsageDescription:
          'แอปต้องการเข้าถึงคลังรูปภาพของคุณเพื่อแนบรูปภาพไปกับประกาศงาน',
        NSCameraUsageDescription:
          'แอปต้องการใช้กล้องเพื่อถ่ายรูปประกอบประกาศงาน',
        NSLocationWhenInUseUsageDescription:
          'แอปต้องการเข้าถึงตำแหน่งของคุณเพื่อปักหมุดสถานที่ทำงานบนแผนที่',
      },
    },
    android: {
      ...config.android,
      package: process.env.ANDROID_PACKAGE || config?.android?.package,
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
      config: {
        ...(config.android?.config || {}),
        googleMaps: {
          ...(config.android?.config?.googleMaps || {}),
          apiKey:
            process.env.ANDROID_GOOGLE_MAPS_API_KEY || config?.android?.config?.googleMaps?.apiKey,
        },
      },
    },
    extra: {
      ...config.extra,
      // Document which env vars are expected
      _expectedEnv: [
        'IOS_GOOGLE_MAPS_API_KEY',
        'ANDROID_GOOGLE_MAPS_API_KEY',
        'IOS_BUNDLE_IDENTIFIER',
        'ANDROID_PACKAGE',
      ],
    },
  };
};
