import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, theme } from '../theme';
import { apiService } from '../services/api';
import { AnalyticsData } from '../types/api';
import { AnalyticsSkeleton } from '../components/SkeletonLoader';

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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periods = [
    { value: 3, label: '3 mois' },
    { value: 6, label: '6 mois' },
    { value: 12, label: '1 an' },
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setError(null);
      const data = await apiService.getAnalytics(selectedPeriod);
      setAnalyticsData(data);
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      setError('Erreur lors du chargement des données');
      Alert.alert('Erreur', 'Impossible de charger les données analytics');
    } finally {
      setIsLoading(false);
      setIsFilterLoading(false);
    }
  };

  // Préparer les données pour les graphiques
  const getCategoryData = (): CategoryData[] => {
    if (!analyticsData?.category_trends) return [];
    
    const categoryIcons: Record<string, string> = {
      'Alimentation': 'restaurant',
      'Transport': 'car',
      'Logement': 'home',
      'Loisirs': 'game-controller',
      'Shopping': 'bag',
      'Santé': 'medical',
      'Divertissement': 'play',
      'Autres': 'ellipsis-horizontal',
    };

    const categoryColors = [
      colors.primary.main,
      colors.secondary.main,
      colors.info,
      colors.success,
      colors.warning,
      colors.error,
      colors.text.secondary,
    ];

    // Utilisons directement total_expenses comme référence 
    const totalExpenses = Math.abs(analyticsData.insights.total_expenses);
    
    // NOUVEAU: Ne prendre que la première occurrence de chaque catégorie
    // car il semble y avoir une duplication massive dans l'API
    const categoryMap: Record<string, number> = {};
    const seenCategories = new Set<string>();
    
    
    analyticsData.category_trends.forEach((trend, index) => {
      if (!seenCategories.has(trend.category)) {
        // Première occurrence de cette catégorie
        const totalAmount = trend.data.reduce((sum, item) => sum + Math.abs(item.amount), 0);
        categoryMap[trend.category] = totalAmount;
        seenCategories.add(trend.category);
      } else {
        // Doublon détecté - on ignore
        const totalAmount = trend.data.reduce((sum, item) => sum + Math.abs(item.amount), 0);
      }
    });
    
    // Calculer notre propre total pour voir la différence avec l'API
    const ourCalculatedTotal = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0);

    // Utiliser notre total calculé pour les pourcentages pour garantir que ça fait 100%
    const totalForPercentages = ourCalculatedTotal > 0 ? ourCalculatedTotal : totalExpenses;
    
    // Convertir en tableau et trier par montant décroissant
    return Object.entries(categoryMap)
      .map(([category, amount], index) => {
        const percentage = totalForPercentages > 0 
          ? (amount / totalForPercentages) * 100 
          : 0;
        
        return {
          name: category,
          amount: amount,
          percentage: Math.round(percentage * 10) / 10,
          color: categoryColors[index % categoryColors.length],
          icon: categoryIcons[category] || 'ellipsis-horizontal',
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const getMonthlyData = (): MonthlyData[] => {
    return analyticsData?.monthly_data || [];
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  }, [selectedPeriod]);

  const handlePeriodChange = (newPeriod: number) => {
    if (newPeriod !== selectedPeriod) {
      setSelectedPeriod(newPeriod);
      setIsFilterLoading(true);
    }
  };

  if (isLoading && !analyticsData) {
    return <AnalyticsSkeleton />;
  }

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
      onPress={() => handlePeriodChange(period.value)}
      disabled={isFilterLoading}
    >
      <Text style={[
        styles.periodButtonText,
        selectedPeriod === period.value && styles.periodButtonTextActive
      ]}>
        {period.label}
      </Text>
    </TouchableOpacity>
  );

  // Utiliser les données réelles ou fallback
  const displayData = analyticsData || {
    insights: {
      total_income: 0,
      total_expenses: 0,
      savings_rate: 0,
      avg_monthly_savings: 0,
    },
    monthly_data: [],
    category_trends: [],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={() => Alert.alert('Export', 'Fonctionnalité d\'export en cours de développement')}
        >
          <Ionicons name="download" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Loading overlay when changing filters */}
        {isFilterLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={24} color={colors.primary.main} />
              <Text style={styles.loadingText}>Mise à jour des données...</Text>
            </View>
          </View>
        )}
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
                {formatCurrency(displayData.insights.total_income)}
              </Text>
              <Text style={styles.summaryLabel}>Revenus totaux</Text>
              <Text style={styles.summarySubtext}>
                Moy. {formatCurrency(displayData.insights.avg_monthly_savings)}/mois
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="trending-down" size={24} color={colors.error} />
              </View>
              <Text style={styles.summaryAmount}>
                {formatCurrency(displayData.insights.total_expenses)}
              </Text>
              <Text style={styles.summaryLabel}>Dépenses totales</Text>
              <Text style={styles.summarySubtext}>
                Moy. {formatCurrency(displayData.insights.total_expenses / selectedPeriod)}/mois
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
                  {formatCurrency(displayData.insights.total_income - displayData.insights.total_expenses)}
                </Text>
                <Text style={styles.savingsLabel}>Épargne totale</Text>
              </View>
              <View style={styles.savingsRate}>
                <Text style={styles.savingsRateText}>
                  {displayData.insights.savings_rate.toFixed(1)}%
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
            {getCategoryData().map((category, index) => (
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
            {getMonthlyData().map((month, index) => {
              const monthlyData = getMonthlyData();
              const maxAmount = Math.max(...monthlyData.map(m => m.income));
              const incomeHeight = maxAmount > 0 ? (month.income / maxAmount) * 100 : 0;
              const expensesHeight = maxAmount > 0 ? (Math.abs(month.expenses) / maxAmount) * 100 : 0;
              
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
          
          {analyticsData?.insights && (
            <>
              <View style={styles.insightCard}>
                <View style={styles.insightIcon}>
                  <Ionicons 
                    name={analyticsData.insights.savings_rate >= 20 ? "trending-up" : "warning"} 
                    size={20} 
                    color={analyticsData.insights.savings_rate >= 20 ? colors.success : colors.warning} 
                  />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>
                    {analyticsData.insights.savings_rate >= 20 ? "Excellente épargne" : "Épargne à améliorer"}
                  </Text>
                  <Text style={styles.insightText}>
                    Votre taux d'épargne de {analyticsData.insights.savings_rate.toFixed(1)}% est{' '}
                    {analyticsData.insights.savings_rate >= 20 ? "supérieur" : "inférieur"} à la moyenne recommandée de 20%.
                  </Text>
                </View>
              </View>

              {analyticsData.insights.biggest_expense && (
                <View style={styles.insightCard}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="alert-circle" size={20} color={colors.error} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Plus grosse dépense</Text>
                    <Text style={styles.insightText}>
                      {formatCurrency(analyticsData.insights.biggest_expense.amount)} pour{' '}
                      {analyticsData.insights.biggest_expense.description} ({analyticsData.insights.biggest_expense.category})
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.insightCard}>
                <View style={styles.insightIcon}>
                  <Ionicons name="bulb" size={20} color={colors.primary.main} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Épargne mensuelle moyenne</Text>
                  <Text style={styles.insightText}>
                    Vous épargnez en moyenne {formatCurrency(analyticsData.insights.avg_monthly_savings)} par mois.
                  </Text>
                </View>
              </View>
            </>
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
    marginTop: theme.spacing.sm,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: '500',
  },
});