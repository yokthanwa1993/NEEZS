import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  Text, 
  LightText, 
  RegularText, 
  MediumText, 
  SemiBoldText, 
  BoldText, 
  ExtraBoldText,
  H1, H2, H3, H4, H5, H6 
} from '../shared/components/Typography';

const FontShowcase = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <H1>Sukhumvit Set Fonts</H1>
        
        <View style={styles.fontRow}>
          <LightText style={styles.sampleText}>สวัสดีครับ - Light (300)</LightText>
        </View>
        
        <View style={styles.fontRow}>
          <RegularText style={styles.sampleText}>สวัสดีครับ - Regular (400)</RegularText>
        </View>
        
        <View style={styles.fontRow}>
          <MediumText style={styles.sampleText}>สวัสดีครับ - Medium (500)</MediumText>
        </View>
        
        <View style={styles.fontRow}>
          <SemiBoldText style={styles.sampleText}>สวัสดีครับ - SemiBold (600)</SemiBoldText>
        </View>
        
        <View style={styles.fontRow}>
          <BoldText style={styles.sampleText}>สวัสดีครับ - Bold (700)</BoldText>
        </View>
        
        <View style={styles.fontRow}>
          <ExtraBoldText style={styles.sampleText}>สวัสดีครับ - ExtraBold (800)</ExtraBoldText>
        </View>
      </View>

      <View style={styles.section}>
        <H2>Heading Examples</H2>
        <H1>Heading 1 - ฟอนต์หัวข้อใหญ่</H1>
        <H2>Heading 2 - ฟอนต์หัวข้อรอง</H2>
        <H3>Heading 3 - ฟอนต์หัวข้อย่อย</H3>
        <H4>Heading 4 - ฟอนต์หัวข้อเล็ก</H4>
        <H5>Heading 5 - ฟอนต์หัวข้อเล็กมาก</H5>
        <H6>Heading 6 - ฟอนต์หัวข้อเล็กที่สุด</H6>
      </View>

      <View style={styles.section}>
        <H3>การใช้งานใน Tailwind CSS</H3>
        <RegularText style={styles.code}>
          {`<Text className="font-sans">ฟอนต์ปกติ</Text>
<Text className="font-light">ฟอนต์บาง</Text>
<Text className="font-medium">ฟอนต์กลาง</Text>
<Text className="font-semibold">ฟอนต์หนา</Text>
<Text className="font-bold">ฟอนต์หนามาก</Text>
<Text className="font-extrabold">ฟอนต์หนาสุด</Text>`}
        </RegularText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  fontRow: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  sampleText: {
    fontSize: 18,
    color: '#111827',
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FontShowcase;
