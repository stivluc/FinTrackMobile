import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors, theme } from '../theme';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinTrack Mobile</Text>
      <Text style={styles.subtitle}>Bienvenue dans votre application de gestion financière</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Bonjour {user.firstName} !</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.lg,
    marginBottom: theme.spacing.xl,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emailText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
  },
  logoutButton: {
    backgroundColor: colors.secondary.main,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  logoutButtonText: {
    color: colors.background.default,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
  },
});