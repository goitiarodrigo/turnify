// src/screens/patient/PaymentMethodsScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import Badge from '@/components/common/Badge/Badge';

// Mock payment methods
const mockPaymentMethods = [
  {
    id: '1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    brand: 'mastercard',
    last4: '5555',
    expiryMonth: 8,
    expiryYear: 2024,
    isDefault: false,
  },
];

const PaymentMethodsScreen = () => {
  const navigation = useNavigation();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'This would open a payment method form');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
    Alert.alert('Success', 'Default payment method updated');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
            ← Back
          </Button>
          <Text variant="h3">Payment Methods</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Add Button */}
        <View style={styles.addButtonContainer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleAddPaymentMethod}
          >
            + Add Payment Method
          </Button>
        </View>

        {/* Payment Methods List */}
        <View style={styles.methodsList}>
          {paymentMethods.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="h3" style={styles.emptyTitle}>
                No Payment Methods
              </Text>
              <Text variant="body" color="secondary" style={styles.emptyText}>
                Add a payment method to make quick payments
              </Text>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <Card key={method.id} variant="outlined" style={styles.methodCard}>
                <Card.Content>
                  <View style={styles.methodContent}>
                    <View style={styles.methodIcon}>
                      <Text style={styles.iconText}>{getCardIcon(method.brand)}</Text>
                    </View>
                    <View style={styles.methodDetails}>
                      <View style={styles.methodHeader}>
                        <Text variant="body" style={styles.methodBrand}>
                          {method.brand.toUpperCase()} •••• {method.last4}
                        </Text>
                        {method.isDefault && (
                          <Badge variant="success" size="sm">
                            Default
                          </Badge>
                        )}
                      </View>
                      <Text variant="caption" color="secondary">
                        Expires {method.expiryMonth.toString().padStart(2, '0')}/
                        {method.expiryYear}
                      </Text>
                      <View style={styles.methodActions}>
                        {!method.isDefault && (
                          <TouchableOpacity
                            onPress={() => handleSetDefault(method.id)}
                            style={styles.actionButton}
                          >
                            <Text variant="caption" style={styles.actionText}>
                              Set as Default
                            </Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => handleDelete(method.id)}
                          style={styles.actionButton}
                        >
                          <Text variant="caption" style={styles.deleteText}>
                            Remove
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Info Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Card.Content>
            <Text variant="h4" style={styles.infoTitle}>
              💡 Payment Information
            </Text>
            <Text variant="body" color="secondary">
              Your payment information is securely stored and encrypted. We never share
              your payment details with third parties.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  methodsList: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
  methodCard: {
    marginBottom: 12,
  },
  methodContent: {
    flexDirection: 'row',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  methodDetails: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  methodBrand: {
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  methodActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  deleteText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#F0F9FF',
  },
  infoTitle: {
    marginBottom: 8,
  },
});

export default PaymentMethodsScreen;
