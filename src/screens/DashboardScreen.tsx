import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, theme } from '../theme';
import { apiService } from '../services/api';
import { DashboardStats, Transaction } from '../types/api';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du dashboard
  const loadDashboardData = async () => {
    try {
      setError(null);
      const [statsData, transactionsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getTransactions({ limit: 3 })
      ]);
      setDashboardData(statsData);
      setRecentTransactions(transactionsData.results || transactionsData);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError('Erreur lors du chargement des données');
      Alert.alert('Erreur', 'Impossible de charger les données du dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Données par défaut si pas de données chargées
  const displayData = dashboardData || {
    current_month: {
      total_wealth: 0,
      wealth_change: 0,
      income: 0,
      income_change: 0,
      expenses: 0,
      expenses_change: 0,
      savings: 0,
      savings_change: 0,
      transactions_count: 0,
    },
    wealth_evolution: [],
    wealth_composition: [],
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return colors.success;
    if (change < 0) return colors.error;
    return colors.text.secondary;
  };

  const getChangeIcon = (change: number): string => {
    if (change > 0) return 'trending-up';
    if (change < 0) return 'trending-down';
    return 'remove';
  };

  const formatPercentage = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        {/* Patrimoine Total - Grande carte */}
        <View style={styles.wealthCard}>
          <View style={styles.wealthHeader}>
            <View style={styles.wealthIcon}>
              <Ionicons name="business" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.wealthInfo}>
              <Text style={styles.wealthTitle}>Patrimoine Total</Text>
              <Text style={styles.wealthAmount}>
                {formatCurrency(displayData.current_month.total_wealth)}
              </Text>
            </View>
            <View style={styles.wealthChange}>
              <Ionicons 
                name={getChangeIcon(displayData.current_month.wealth_change)} 
                size={16} 
                color={getChangeColor(displayData.current_month.wealth_change)} 
              />
              <Text style={[styles.wealthChangeText, { color: getChangeColor(displayData.current_month.wealth_change) }]}>
                {formatPercentage(displayData.current_month.wealth_change)}
              </Text>
            </View>
          </View>
          
          {/* Graphique d'évolution du patrimoine (placeholder) */}
          <View style={styles.wealthChart}>
            <Text style={styles.chartPlaceholder}>Graphique d'évolution du patrimoine</Text>
          </View>
        </View>

        {/* Stats rapides - Revenus/Dépenses/Épargne */}
        <View style={styles.quickStatsCard}>
          <Text style={styles.quickStatsTitle}>30 derniers jours</Text>
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <View style={styles.quickStatIcon}>
                <Ionicons name="trending-up" size={18} color={colors.success} />
              </View>
              <Text style={styles.quickStatLabel}>Revenus</Text>
              <Text style={styles.quickStatAmount}>
                {formatCurrency(displayData.current_month.income)}
              </Text>
              <Text style={[styles.quickStatChange, { color: getChangeColor(displayData.current_month.income_change) }]}>
                {formatPercentage(displayData.current_month.income_change)}
              </Text>
            </View>
            
            <View style={styles.quickStat}>
              <View style={styles.quickStatIcon}>
                <Ionicons name="trending-down" size={18} color={colors.error} />
              </View>
              <Text style={styles.quickStatLabel}>Dépenses</Text>
              <Text style={styles.quickStatAmount}>
                {formatCurrency(Math.abs(displayData.current_month.expenses))}
              </Text>
              <Text style={[styles.quickStatChange, { color: getChangeColor(-displayData.current_month.expenses_change) }]}>
                {formatPercentage(-displayData.current_month.expenses_change)}
              </Text>
            </View>
            
            <View style={styles.quickStat}>
              <View style={styles.quickStatIcon}>
                <Ionicons name="wallet" size={18} color={colors.info} />
              </View>
              <Text style={styles.quickStatLabel}>Épargne</Text>
              <Text style={styles.quickStatAmount}>
                {formatCurrency(displayData.current_month.savings)}
              </Text>
              <Text style={[styles.quickStatChange, { color: getChangeColor(displayData.current_month.savings_change) }]}>
                {formatPercentage(displayData.current_month.savings_change)}
              </Text>
            </View>
          </View>
        </View>

        {/* Composition du patrimoine */}
        <View style={styles.compositionCard}>
          <Text style={styles.compositionTitle}>Composition du patrimoine</Text>
          <View style={styles.compositionChart}>
            <Text style={styles.chartPlaceholder}>Graphique de composition</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => navigation.navigate('Transactions' as never)}
            >
              <Text style={styles.viewMoreText}>Voir plus</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary.main} />
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.slice(0, 3).map((transaction) => {
              const iconMap: Record<string, string> = {
                'Alimentation': 'restaurant',
                'Transport': 'car',
                'Logement': 'home',
                'Santé': 'medical',
                'Loisirs': 'game-controller',
                'Shopping': 'bag',
                'Salaire': 'card',
                'Freelance': 'briefcase',
                'Autres revenus': 'cash',
              };

              const isIncome = transaction.amount > 0;
              const iconName = iconMap[transaction.category.name] || 'card';
              const iconColor = isIncome ? colors.success : colors.error;

              return (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Ionicons name={iconName as any} size={20} color={iconColor} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.description}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <Text style={[styles.transactionAmount, isIncome && styles.incomeAmount]}>
                    {isIncome ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Aucune transaction récente</Text>
          )}
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
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  
  // Carte patrimoine principal
  wealthCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: theme.spacing.md,
  },
  wealthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  wealthIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  wealthInfo: {
    flex: 1,
  },
  wealthTitle: {
    fontSize: theme.typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  wealthAmount: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  wealthChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wealthChangeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  wealthChart: {
    height: 100,
    backgroundColor: colors.background.default,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
  },
  
  // Stats rapides groupées
  quickStatsCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: theme.spacing.md,
  },
  quickStatsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  quickStatLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  quickStatAmount: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  quickStatChange: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Composition du patrimoine
  compositionCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: theme.spacing.md,
  },
  compositionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  compositionChart: {
    height: 120,
    backgroundColor: colors.background.default,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Transactions récentes
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  recentSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  viewMoreText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.primary.main,
    marginRight: theme.spacing.xs,
    fontWeight: '600',
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
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
});