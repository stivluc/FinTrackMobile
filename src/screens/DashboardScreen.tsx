import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, theme } from '../theme';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Refresh dashboard data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Données simulées pour le moment
  const dashboardData = {
    totalBalance: 5420.50,
    monthlyIncome: 3200.00,
    monthlyExpenses: 2180.75,
    savingsRate: 31.8,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.first_name || 'Utilisateur'}</Text>
          </View>
          <View style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary.main} />
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde total</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(dashboardData.totalBalance)}
          </Text>
          <View style={styles.balanceChange}>
            <Ionicons name="trending-up" size={16} color={colors.success} />
            <Text style={styles.balanceChangeText}>+2.4% ce mois</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="arrow-down" size={20} color={colors.success} />
            </View>
            <Text style={styles.statAmount}>
              {formatCurrency(dashboardData.monthlyIncome)}
            </Text>
            <Text style={styles.statLabel}>Revenus</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="arrow-up" size={20} color={colors.error} />
            </View>
            <Text style={styles.statAmount}>
              {formatCurrency(dashboardData.monthlyExpenses)}
            </Text>
            <Text style={styles.statLabel}>Dépenses</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="wallet" size={20} color={colors.primary.main} />
            </View>
            <Text style={styles.statAmount}>{dashboardData.savingsRate}%</Text>
            <Text style={styles.statLabel}>Épargne</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionButtons}>
            <View style={styles.actionButton}>
              <Ionicons name="add-circle" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Ajouter</Text>
            </View>
            <View style={styles.actionButton}>
              <Ionicons name="analytics" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Analyser</Text>
            </View>
            <View style={styles.actionButton}>
              <Ionicons name="card" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Budgets</Text>
            </View>
            <View style={styles.actionButton}>
              <Ionicons name="settings" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Réglages</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions Preview */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Transactions récentes</Text>
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Ionicons name="restaurant" size={20} color={colors.error} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Restaurant Le Gourmet</Text>
              <Text style={styles.transactionDate}>Aujourd'hui, 12:30</Text>
            </View>
            <Text style={styles.transactionAmount}>-45.80 €</Text>
          </View>

          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Ionicons name="car" size={20} color={colors.error} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Station Total</Text>
              <Text style={styles.transactionDate}>Hier, 17:45</Text>
            </View>
            <Text style={styles.transactionAmount}>-67.20 €</Text>
          </View>

          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Ionicons name="card" size={20} color={colors.success} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Salaire</Text>
              <Text style={styles.transactionDate}>01 Jan 2025</Text>
            </View>
            <Text style={[styles.transactionAmount, styles.incomeAmount]}>+3200.00 €</Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: theme.typography.fontSize.md,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  balanceCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  balanceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.fontSize.xxxl + 4,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceChangeText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.success,
    marginLeft: theme.spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statAmount: {
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
  quickActions: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    minWidth: 70,
  },
  actionText: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  recentSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
  },
  transactionAmount: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.error,
  },
  incomeAmount: {
    color: colors.success,
  },
});