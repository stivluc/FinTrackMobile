import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, theme } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const profileStats = [
    {
      label: 'Transactions ce mois',
      value: '47',
      icon: 'receipt',
      color: colors.primary.main,
    },
    {
      label: 'Budgets actifs',
      value: '8',
      icon: 'wallet',
      color: colors.secondary.main,
    },
    {
      label: 'Objectifs atteints',
      value: '3/5',
      icon: 'trophy',
      color: colors.success,
    },
  ];

  const menuItems = [
    {
      title: 'Paramètres du compte',
      subtitle: 'Modifier vos informations personnelles',
      icon: 'person-circle',
      onPress: () => {
        // TODO: Navigation vers paramètres compte
        Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
      },
    },
    {
      title: 'Sécurité',
      subtitle: 'Mot de passe, authentification',
      icon: 'shield-checkmark',
      onPress: () => {
        // TODO: Navigation vers sécurité
        Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
      },
    },
    {
      title: 'Notifications',
      subtitle: 'Gérer vos alertes et rappels',
      icon: 'notifications',
      onPress: () => {
        // TODO: Navigation vers notifications
        Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
      },
    },
    {
      title: 'Thème et affichage',
      subtitle: 'Personnaliser l\'apparence',
      icon: 'color-palette',
      onPress: () => {
        // TODO: Navigation vers thème
        Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
      },
    },
    {
      title: 'Export des données',
      subtitle: 'Télécharger vos données',
      icon: 'download',
      onPress: () => {
        // TODO: Export fonctionnalité
        Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
      },
    },
    {
      title: 'Aide et support',
      subtitle: 'FAQ, contact, documentation',
      icon: 'help-circle',
      onPress: () => {
        // TODO: Navigation vers aide
        Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color={colors.primary.main} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userSince}>
                Membre depuis {new Date(user?.date_joined || '').toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Vos statistiques</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={22} color={colors.primary.main} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>FinTrack Mobile</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Votre compagnon pour une gestion financière intelligente
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  userSince: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.muted,
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.primary,
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  menuSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
  },
  appInfoSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  appInfo: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    alignItems: 'center',
  },
  appName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  appVersion: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  appDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  logoutSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.error,
    marginLeft: theme.spacing.sm,
  },
});