import { Text as RNText, TextInput as RNTextInput } from 'react-native';
import { getFontFamily } from '../constants/fonts';

// Global font setup - ตั้งค่าฟอนต์เป็น default ทั้งระบบ
export const setupGlobalFonts = () => {
  const normalize = (inputStyle) => {
    const list = Array.isArray(inputStyle) ? inputStyle : [inputStyle];
    // หา fontWeight สุดท้ายที่ถูกระบุในสไตล์
    let weight;
    let hasColor = false;
    for (const s of list) {
      const w = s?.fontWeight;
      if (!w) continue;
      if (typeof w === 'string') {
        if (w === 'bold') weight = 700; else if (w === 'normal') weight = 400; else weight = parseInt(w, 10);
      } else if (typeof w === 'number') {
        weight = w;
      }
      if (s && typeof s === 'object' && s.color) hasColor = true;
    }
    // ตรวจว่ามีการกำหนดสีไว้แล้วหรือยัง ถ้าไม่มีกำหนดให้เป็นสีเข้มอ่านง่าย
    for (const s of list) {
      if (s && typeof s === 'object' && s.color) { hasColor = true; break; }
    }
    const mappedFamily = getFontFamily(weight || 400);
    // ตัด fontWeight ออกจากทุก style เพื่อไม่ให้ iOS สลับกลับไปใช้ SF Rounded
    const cleaned = list.map((s) => (s && typeof s === 'object' ? { ...s, fontWeight: undefined } : s));
    // ใส่ fontFamily และสี default ที่อ่านง่ายไว้หน้าสุด (ถ้ายังไม่กำหนดสี)
    const base = hasColor ? { fontFamily: mappedFamily } : { fontFamily: mappedFamily, color: '#111827' };
    return [base, ...cleaned];
  };

  // Override Text
  const originalTextRender = RNText.render;
  RNText.render = function (props, ref) {
    const newProps = {
      ...props,
      style: normalize(props?.style),
    };
    return originalTextRender.call(this, newProps, ref);
  };

  // Override TextInput
  const originalTextInputRender = RNTextInput.render;
  RNTextInput.render = function (props, ref) {
    const newProps = {
      ...props,
      style: normalize(props?.style),
    };
    return originalTextInputRender.call(this, newProps, ref);
  };
};

export default setupGlobalFonts;
