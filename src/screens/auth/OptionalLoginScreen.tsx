// src/screens/auth/OptionalLoginScreen.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import { useAuthStore } from '@/store/store';
import { useTheme } from '@/context/ThemeContext';

const OptionalLoginScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { continueAsGuest } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const handleLogin = () => {
    navigation.navigate('Login' as any);
  };

  const handleRegister = () => {
    navigation.navigate('Register' as any);
  };

  const handleContinueAsGuest = async () => {
    try {
      setLoading(true);
      await continueAsGuest();
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      console.error('Guest mode error:', error);
    } finally {
      setLoading(false);
    }
  };

  // DEVELOPMENT ONLY: Quick demo login
  const handleDemoLogin = () => {
    const { setUser } = useAuthStore.getState() as any;

    // Create a mock user for testing
    const mockUser = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@turnify.com',
      phone: '+1234567890',
      role: 'patient',
      avatar: undefined,
      isEmailVerified: true,
      isPhoneVerified: true,
      preferences: {
        language: 'es',
        notifications: {
          push: true,
          email: true,
          sms: false,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Manually set auth state for demo
    useAuthStore.setState({
      user: mockUser,
      token: 'demo-token-123',
      isAuthenticated: true,
      isGuest: false,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🏥</Text>
          </View>
          <Text variant="h1" style={styles.title}>
            Bienvenido a Turnify
          </Text>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            Tu plataforma de gestión de citas médicas y colas virtuales
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📅</Text>
            <Text variant="body" style={styles.featureText}>
              Gestiona tus citas
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔔</Text>
            <Text variant="body" style={styles.featureText}>
              Recibe notificaciones
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text variant="body" style={styles.featureText}>
              Califica profesionales
            </Text>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            style={styles.button}
          >
            Iniciar Sesión
          </Button>

          <Button
            variant="outlined"
            size="lg"
            fullWidth
            onPress={handleRegister}
            style={styles.button}
          >
            Crear Cuenta
          </Button>

          <TouchableOpacity
            onPress={handleContinueAsGuest}
            style={styles.guestButton}
            disabled={loading}
          >
            <Text variant="body" style={styles.guestText}>
              Continuar como invitado
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Mode (Development Only) */}
        {__DEV__ && (
          <Card variant="outlined" style={styles.demoCard}>
            <Card.Content>
              <Text variant="caption" color="secondary" style={styles.demoTitle}>
                🔧 Modo Desarrollo
              </Text>
              <Text variant="caption" style={styles.demoDescription}>
                Acceso rápido para pruebas (solo visible en desarrollo)
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={handleDemoLogin}
                style={styles.demoButton}
              >
                Demo Login (Patient)
              </Button>
            </Card.Content>
          </Card>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 48,
    paddingHorizontal: 12,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    textAlign: 'center',
    fontSize: 12,
  },
  actions: {
    gap: 16,
  },
  button: {
    minHeight: 56,
  },
  guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  demoCard: {
    marginTop: 32,
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  demoTitle: {
    fontWeight: '700',
    marginBottom: 4,
    color: '#92400E',
  },
  demoDescription: {
    marginBottom: 12,
    color: '#78350F',
  },
  demoButton: {
    marginTop: 8,
  },
});

export default OptionalLoginScreen;
