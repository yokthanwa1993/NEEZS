import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { Text } from '../../shared/components/Typography';

const EmployerChatScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text weight={700} style={styles.headerTitle}>แชท</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
});

export default EmployerChatScreen;
