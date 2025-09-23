import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { Text, H1, H2, MediumText } from '../components/Typography';

const WelcomeScreen = ({ navigation }) => {
  const handleNavigate = (routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <ScreenContainer center>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoBadge}>
            <H1 style={styles.logoText}>NEEZS</H1>
          </View>
        </View>
        <H2 style={styles.title}>วันนี้คุณอยากทำอะไร?</H2>
        <View style={styles.cards}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.card}
            onPress={() => handleNavigate('SeekerLogin')}
          >
            <View style={styles.cardImageWrapper}>
              <Ionicons name="briefcase-outline" size={36} color="#111827" />
            </View>
            <View style={styles.cardText}>
              <MediumText style={styles.cardCaption}>อยากหารายได้</MediumText>
              <H2 style={styles.cardTitle}>หางาน</H2>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.card}
            onPress={() => handleNavigate('EmployerLogin')}
          >
            <View style={styles.cardImageWrapper}>
              <Ionicons name="people-outline" size={36} color="#111827" />
            </View>
            <View style={styles.cardText}>
              <MediumText style={styles.cardCaption}>สำหรับธุรกิจของคุณ</MediumText>
              <H2 style={styles.cardTitle}>จ้างพนักงาน</H2>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    backgroundColor: '#f97316',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  logoText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#ffffff',
    letterSpacing: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#111827',
    // เพิ่ม lineHeight ให้รองรับสระ/วรรณยุกต์ภาษาไทยไม่ถูกตัดบน iOS
    lineHeight: 60,
    textAlign: 'center',
  },
  cards: {
    marginTop: 36,
  },
  card: {
    backgroundColor: '#FFA500',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 18,
  },
  cardImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardCaption: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default WelcomeScreen;
