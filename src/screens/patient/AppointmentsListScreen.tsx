// src/screens/patient/AppointmentsListScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import AppointmentCard from '@/components/domain/AppointmentCard/AppointmentCard';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useAppointments } from '@/hooks/useAppointments';
import type { Appointment, AppointmentStatus } from '@/types/models';

type TabType = 'upcoming' | 'past' | 'all';

const AppointmentsListScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const { data: appointmentsData, isLoading, refetch } = useAppointments();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filterAppointments = (appointments: Appointment[]): Appointment[] => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.dateTime);
          return (
            aptDate >= now &&
            apt.status !== 'completed' &&
            apt.status !== 'cancelled' &&
            apt.status !== 'no-show'
          );
        });
      case 'past':
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.dateTime);
          return (
            aptDate < now ||
            apt.status === 'completed' ||
            apt.status === 'cancelled' ||
            apt.status === 'no-show'
          );
        });
      case 'all':
        return appointments;
      default:
        return appointments;
    }
  };

  const handleAppointmentPress = (appointmentId: string) => {
    navigation.navigate('AppointmentDetail' as any, { appointmentId });
  };

  const handleBookNew = () => {
    navigation.navigate('Search' as any);
  };

  const renderTabs = () => (
    <View style={styles.tabs}>
      <Button
        variant={activeTab === 'upcoming' ? 'primary' : 'ghost'}
        size="sm"
        onPress={() => setActiveTab('upcoming')}
        style={styles.tabButton}
      >
        Upcoming
      </Button>
      <Button
        variant={activeTab === 'past' ? 'primary' : 'ghost'}
        size="sm"
        onPress={() => setActiveTab('past')}
        style={styles.tabButton}
      >
        Past
      </Button>
      <Button
        variant={activeTab === 'all' ? 'primary' : 'ghost'}
        size="sm"
        onPress={() => setActiveTab('all')}
        style={styles.tabButton}
      >
        All
      </Button>
    </View>
  );

  const renderAppointments = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      );
    }

    const appointments = appointmentsData?.data || [];
    const filteredAppointments = filterAppointments(appointments);

    if (filteredAppointments.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="h3" style={styles.emptyTitle}>
            {activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Appointments'}
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyText}>
            {activeTab === 'upcoming'
              ? "You don't have any upcoming appointments scheduled."
              : `You don't have any ${activeTab} appointments.`}
          </Text>
          {activeTab === 'upcoming' && (
            <Button variant="primary" size="lg" onPress={handleBookNew} style={styles.bookButton}>
              Book an Appointment
            </Button>
          )}
        </View>
      );
    }

    // Group appointments by status for upcoming tab
    if (activeTab === 'upcoming') {
      const scheduled = filteredAppointments.filter(
        (apt) => apt.status === 'scheduled' || apt.status === 'confirmed'
      );
      const inProgress = filteredAppointments.filter((apt) => apt.status === 'in-progress');

      return (
        <View style={styles.appointmentsList}>
          {inProgress.length > 0 && (
            <View style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                In Progress
              </Text>
              {inProgress.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onPress={() => handleAppointmentPress(appointment.id)}
                  showActions={true}
                />
              ))}
            </View>
          )}

          {scheduled.length > 0 && (
            <View style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Scheduled ({scheduled.length})
              </Text>
              {scheduled.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onPress={() => handleAppointmentPress(appointment.id)}
                  showActions={true}
                />
              ))}
            </View>
          )}
        </View>
      );
    }

    // For past and all tabs, just show the list
    return (
      <View style={styles.appointmentsList}>
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onPress={() => handleAppointmentPress(appointment.id)}
            showActions={activeTab === 'upcoming'}
          />
        ))}
      </View>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">My Appointments</Text>
          <Button variant="primary" size="sm" onPress={handleBookNew}>
            + New
          </Button>
        </View>

        {/* Tabs */}
        {renderTabs()}

        {/* Appointments List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderAppointments()}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabButton: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  bookButton: {
    minWidth: 200,
  },
  appointmentsList: {
    padding: 16,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
});

export default AppointmentsListScreen;
