import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

const MyJobsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
});

export default MyJobsScreen;
