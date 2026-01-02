// src/screens/patient/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// import { Screen, Text, Button, Card, AppointmentCard } from '@/components/common';
// import { useAppointments } from '@/store/hooks/useAppointments';
// import { useClinics } from '@/store/hooks/useClinics';
import { Button } from '@/components/common';
import AppointmentCard from '@/components/domain/AppointmentCard/AppointmentCard';
import { useAppointments } from '@/hooks/useAppointments';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import useClinics from '@/hooks/useClinics';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { data: appointments, isLoading } = useAppointments();
  const { data: nearbyClinics } = useClinics();

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <Text variant="h2" style={styles.greeting}>
          Good afternoon, John
        </Text>

        <View style={styles.quickActions}>
          <Button
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('Search' as any)}
            style={styles.actionButton}
          >
            Book Appointment
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onPress={() => navigation.navigate('JoinQueue' as any)}
            style={styles.actionButton}
          >
            Join Queue
          </Button>
        </View>

        {(appointments as any)?.data?.length > 0 && (
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              Upcoming Appointments
            </Text>
            {(appointments as any).data.slice(0, 2).map((appointment: any) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() =>
                  navigation.navigate('AppointmentDetail' as any, { id: appointment.id })
                }
              />
            ))}
            <Button
              variant="ghost"
              onPress={() => navigation.navigate('Appointments' as any)}
            >
              View All
            </Button>
          </View>
        )}

        {(nearbyClinics as any)?.data?.length > 0 && (
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              Nearby Clinics
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(nearbyClinics as any).data.map((clinic: any) => (
                <View key={clinic.id} style={{ width: 100, height: 100, backgroundColor: 'gray', margin: 10 }}>
                  <Text>{clinic.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  greeting: {
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});

export default HomeScreen;