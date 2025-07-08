import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, theme } from '../theme';

const { width } = Dimensions.get('window');

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export default function AnalyticsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(6);

  const periods = [
    { value: 3, label: '3 mois' },
    { value: 6, label: '6 mois' },
    { value: 12, label: '1 an' },
  ];

  // Données simulées
  const analyticsData = {
    totalIncome: 19200.00,
    totalExpenses: 13140.50,
    totalSavings: 6059.50,
    savingsRate: 31.56,
    averageMonthlyIncome: 3200.00,
    averageMonthlyExpenses: 2190.08,
  };

  const categoryData: CategoryData[] = [
    {
      name: 'Alimentation',
      amount: 2920.00,
      percentage: 22.2,
      color: colors.primary.main,
      icon: 'restaurant',
    },
    {
      name: 'Transport',
      amount: 1980.00,
      percentage: 15.1,
      color: colors.secondary.main,
      icon: 'car',
    },
    {
      name: 'Logement',
      amount: 4200.00,
      percentage: 32.0,
      color: colors.info,
      icon: 'home',
    },
    {
      name: 'Loisirs',
      amount: 1560.00,
      percentage: 11.9,
      color: colors.success,
      icon: 'game-controller',
    },
    {
      name: 'Shopping',
      amount: 1240.50,
      percentage: 9.4,
      color: colors.warning,
      icon: 'bag',
    },
    {
      name: 'Santé',
      amount: 890.00,
      percentage: 6.8,
      color: colors.error,
      icon: 'medical',
    },
    {
      name: 'Autres',
      amount: 350.00,
      percentage: 2.7,
      color: colors.text.secondary,
      icon: 'ellipsis-horizontal',
    },
  ];

  const monthlyData: MonthlyData[] = [
    { month: 'Août', income: 3200, expenses: 2180, savings: 1020 },
    { month: 'Sept', income: 3200, expenses: 2350, savings: 850 },
    { month: 'Oct', income: 3200, expenses: 2090, savings: 1110 },
    { month: 'Nov', income: 3200, expenses: 2240, savings: 960 },
    { month: 'Déc', income: 3650, expenses: 2890, savings: 760 },
    { month: 'Jan', income: 3200, expenses: 2190, savings: 1010 },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Refresh analytics data
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

  const renderPeriodButton = (period: { value: number; label: string }) => (
    <TouchableOpacity
      key={period.value}
      style={[
        styles.periodButton,
        selectedPeriod === period.value && styles.periodButtonActive
      ]}
      onPress={() => setSelectedPeriod(period.value)}
    >
      <Text style={[
        styles.periodButtonText,
        selectedPeriod === period.value && styles.periodButtonTextActive
      ]}>
        {period.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Period Selection */}
        <View style={styles.periodSelection}>
          {periods.map(renderPeriodButton)}
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="trending-up" size={24} color={colors.success} />
              </View>
              <Text style={styles.summaryAmount}>
                {formatCurrency(analyticsData.totalIncome)}
              </Text>
              <Text style={styles.summaryLabel}>Revenus totaux</Text>
              <Text style={styles.summarySubtext}>
                Moy. {formatCurrency(analyticsData.averageMonthlyIncome)}/mois
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="trending-down" size={24} color={colors.error} />
              </View>
              <Text style={styles.summaryAmount}>
                {formatCurrency(analyticsData.totalExpenses)}
              </Text>
              <Text style={styles.summaryLabel}>Dépenses totales</Text>
              <Text style={styles.summarySubtext}>
                Moy. {formatCurrency(analyticsData.averageMonthlyExpenses)}/mois
              </Text>
            </View>
          </View>

          <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
              <View style={styles.summaryIcon}>
                <Ionicons name="wallet" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.savingsInfo}>
                <Text style={styles.savingsAmount}>
                  {formatCurrency(analyticsData.totalSavings)}
                </Text>
                <Text style={styles.savingsLabel}>Épargne totale</Text>
              </View>
              <View style={styles.savingsRate}>
                <Text style={styles.savingsRateText}>
                  {analyticsData.savingsRate.toFixed(1)}%
                </Text>
                <Text style={styles.savingsRateLabel}>Taux d'épargne</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Répartition par catégorie</Text>
          
          {/* Simple Bar Chart */}
          <View style={styles.chartContainer}>
            {categoryData.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryIcon}>
                    <Ionicons name={category.icon as any} size={16} color={category.color} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                </View>
                
                <View style={styles.categoryBar}>
                  <View style={[
                    styles.categoryBarFill,
                    {
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }
                  ]} />
                </View>
                
                <Text style={styles.categoryAmount}>
                  {formatCurrency(category.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Trend */}
        <View style={styles.trendSection}>
          <Text style={styles.sectionTitle}>Évolution mensuelle</Text>
          
          <View style={styles.trendChart}>
            {monthlyData.map((month, index) => {
              const maxAmount = Math.max(...monthlyData.map(m => m.income));
              const incomeHeight = (month.income / maxAmount) * 100;
              const expensesHeight = (month.expenses / maxAmount) * 100;
              
              return (
                <View key={index} style={styles.monthColumn}>
                  <View style={styles.barsContainer}>
                    <View style={[
                      styles.incomeBar,
                      { height: `${incomeHeight}%` }
                    ]} />
                    <View style={[
                      styles.expensesBar,
                      { height: `${expensesHeight}%` }
                    ]} />
                  </View>
                  <Text style={styles.monthLabel}>{month.month}</Text>
                </View>
              );
            })}
          </View>
          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Revenus</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
              <Text style={styles.legendText}>Dépenses</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="trending-up" size={20} color={colors.success} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Excellente épargne</Text>
              <Text style={styles.insightText}>
                Votre taux d'épargne de 31.6% est supérieur à la moyenne recommandée de 20%.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="warning" size={20} color={colors.warning} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Attention aux loisirs</Text>
              <Text style={styles.insightText}>
                Vos dépenses en loisirs ont augmenté de 15% par rapport au mois dernier.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="bulb" size={20} color={colors.primary.main} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Optimisation possible</Text>
              <Text style={styles.insightText}>
                Vous pourriez économiser 200€/mois en réduisant vos sorties restaurant.
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  scrollView: {
    flex: 1,
  },
  periodSelection: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  periodButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  periodButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  periodButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: colors.background.default,
  },
  summarySection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.primary,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  summarySubtext: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.muted,
    textAlign: 'center',
  },
  savingsCard: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  savingsAmount: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  savingsLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
  },
  savingsRate: {
    alignItems: 'flex-end',
  },
  savingsRateText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  savingsRateLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
  },
  categorySection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  categoryItem: {
    marginBottom: theme.spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  categoryName: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  categoryBar: {
    height: 6,
    backgroundColor: colors.background.default,
    borderRadius: 3,
    marginBottom: theme.spacing.xs,
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryAmount: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  trendSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    height: 150,
    marginBottom: theme.spacing.md,
  },
  monthColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: theme.spacing.sm,
  },
  incomeBar: {
    width: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
    marginRight: 2,
  },
  expensesBar: {
    width: 8,
    backgroundColor: colors.error,
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
  },
  insightsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  insightText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: theme.typography.lineHeight.md,
  },
});