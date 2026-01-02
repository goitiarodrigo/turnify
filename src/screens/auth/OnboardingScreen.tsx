// src/screens/auth/OnboardingScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  emoji: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    emoji: '📅',
    title: 'Gestiona tus Citas',
    description:
      'Reserva y administra tus citas médicas de forma fácil y rápida. Sin llamadas, sin esperas.',
  },
  {
    emoji: '🏥',
    title: 'Cola Virtual',
    description:
      'Únete a colas virtuales y recibe notificaciones cuando sea tu turno. Ahorra tiempo esperando desde casa.',
  },
  {
    emoji: '⭐',
    title: 'Encuentra Profesionales',
    description:
      'Busca médicos y clínicas cerca de ti, lee reseñas y elige el profesional ideal para tu salud.',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleLogin = () => {
    navigation.navigate('Login' as any);
  };

  const handleRegister = () => {
    navigation.navigate('Register' as any);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleRegister();
    }
  };

  const handleSkip = () => {
    handleLogin();
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text variant="body" style={styles.skipText}>
          Saltar
        </Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Slides */}
        <View style={styles.slideContainer}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{slides[currentSlide].emoji}</Text>
          </View>

          <Text variant="h1" style={styles.title}>
            {slides[currentSlide].title}
          </Text>

          <Text variant="body" color="secondary" style={styles.description}>
            {slides[currentSlide].description}
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentSlide
                      ? theme.colors.primary[500]
                      : theme.colors.text.tertiary,
                  width: index === currentSlide ? 32 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleNext}
            style={styles.button}
          >
            {currentSlide === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Button>

          <Button
            variant="outlined"
            size="lg"
            fullWidth
            onPress={handleLogin}
            style={styles.button}
          >
            Ya tengo cuenta
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    flexGrow: 1,
    paddingTop: 100,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emojiContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 70,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    minHeight: 56,
  },
});

export default OnboardingScreen;
