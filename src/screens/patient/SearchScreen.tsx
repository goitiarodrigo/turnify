// src/screens/patient/SearchScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput as RNTextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button/Button';
import ClinicCard from '@/components/domain/ClinicCard/ClinicCard';
import ProfessionalCard from '@/components/domain/ProfessionalCard/ProfessionalCard';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import useClinics from '@/hooks/useClinics';
import useProfessionals from '@/hooks/useProfessionals';

type SearchType = 'all' | 'clinics' | 'professionals';

const SearchScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [specialty, setSpecialty] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data with search filters
  const {
    data: clinicsData,
    isLoading: clinicsLoading,
  } = useClinics({
    search: searchQuery,
    specialty: specialty || undefined,
    page: 1,
    limit: 20,
  });

  const {
    data: professionalsData,
    isLoading: professionalsLoading,
  } = useProfessionals({
    specialty: specialty || undefined,
    page: 1,
    limit: 20,
  });

  const isLoading = clinicsLoading || professionalsLoading;

  const handleClinicPress = (clinicId: string) => {
    navigation.navigate('ClinicDetail' as any, { clinicId });
  };

  const handleProfessionalPress = (professionalId: string) => {
    navigation.navigate('ProfessionalDetail' as any, { professionalId });
  };

  const renderSearchTypeSelector = () => (
    <View style={styles.searchTypeContainer}>
      <Button
        variant={searchType === 'all' ? 'primary' : 'outline'}
        size="sm"
        onPress={() => setSearchType('all')}
        style={styles.typeButton}
      >
        All
      </Button>
      <Button
        variant={searchType === 'clinics' ? 'primary' : 'outline'}
        size="sm"
        onPress={() => setSearchType('clinics')}
        style={styles.typeButton}
      >
        Clinics
      </Button>
      <Button
        variant={searchType === 'professionals' ? 'primary' : 'outline'}
        size="sm"
        onPress={() => setSearchType('professionals')}
        style={styles.typeButton}
      >
        Professionals
      </Button>
    </View>
  );

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <View style={styles.filtersContainer}>
        <Text variant="h4" style={styles.filtersTitle}>
          Filters
        </Text>

        <Input
          label="Specialty"
          placeholder="e.g., Cardiology, Pediatrics"
          value={specialty}
          onChangeText={setSpecialty}
        />

        <Button
          variant="ghost"
          size="sm"
          onPress={() => {
            setSpecialty('');
            setSearchQuery('');
          }}
        >
          Clear Filters
        </Button>
      </View>
    );
  };

  const renderClinics = () => {
    if (searchType === 'professionals') return null;
    if (!clinicsData?.data || clinicsData.data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="secondary">
            No clinics found
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text variant="h3" style={styles.sectionTitle}>
          Clinics ({clinicsData.pagination.total})
        </Text>
        {clinicsData.data.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            onPress={() => handleClinicPress(clinic.id)}
          />
        ))}
      </View>
    );
  };

  const renderProfessionals = () => {
    if (searchType === 'clinics') return null;
    if (!professionalsData?.data || professionalsData.data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="secondary">
            No professionals found
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text variant="h3" style={styles.sectionTitle}>
          Professionals ({professionalsData.pagination.total})
        </Text>
        {professionalsData.data.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
            onPress={() => handleProfessionalPress(professional.id)}
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
          <Text variant="h2">Search</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search clinics or professionals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <Button
            variant="outline"
            size="sm"
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterButton}
          >
            {showFilters ? 'Hide' : 'Filters'}
          </Button>
        </View>

        {/* Search Type Selector */}
        {renderSearchTypeSelector()}

        {/* Filters */}
        {renderFilters()}

        {/* Results */}
        <ScrollView
          style={styles.results}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContent}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {renderClinics()}
              {renderProfessionals()}
            </>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    minWidth: 80,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 16,
  },
  filtersTitle: {
    marginBottom: 12,
  },
  results: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
});

export default SearchScreen;
