import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, theme } from '../theme';
import { apiService } from '../services/api';
import { BudgetOverview } from '../types/api';

interface Budget {
  id: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
  period: string;
  icon: string;
  color: string;
}

export default function BudgetsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de budgets depuis l'API
  const loadBudgetData = async () => {
    try {
      setError(null);
      const data = await apiService.getBudgetOverview();
      setBudgetData(data);
    } catch (error: any) {
      console.error('Error loading budget data:', error);
      setError('Erreur lors du chargement des budgets');
      Alert.alert('Erreur', 'Impossible de charger les données des budgets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadBudgetData();
    setRefreshing(false);
  }, []);

  const handleAddBudget = () => {
    Alert.alert('Nouveau budget', 'Fonctionnalité en cours de développement');
  };

  const handleNewBudget = () => {
    Alert.alert('Nouveau budget', 'Fonctionnalité en cours de développement');
  };

  const handleAnalytics = () => {
    Alert.alert('Analyse des budgets', 'Fonctionnalité en cours de développement');
  };

  const handleSettings = () => {
    Alert.alert('Paramètres budgets', 'Fonctionnalité en cours de développement');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return colors.error;
    if (percentage >= 75) return colors.warning;
    return colors.success;
  };

  const getProgressWidth = (spent: number, allocated: number): number => {
    const percentage = (spent / allocated) * 100;
    return Math.min(percentage, 100);
  };

  const getBudgetStatus = (spent: number, allocated: number): string => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 100) return 'Dépassé';
    if (percentage >= 90) return 'Attention';
    if (percentage >= 75) return 'En approche';
    return 'OK';
  };

  // Si pas de données chargées, utiliser des données par défaut
  const displayData = budgetData || {
    summary: {
      total_allocated: 0,
      total_spent: 0,
      total_remaining: 0,
      overall_percentage: 0,
    },
    budgets: [],
  };

  // Mapper les budgets de l'API vers le format local
  const mappedBudgets = displayData.budgets.map((budget, index) => {
    const iconMap: Record<string, string> = {
      'Alimentation': 'restaurant',
      'Transport': 'car',
      'Loisirs': 'game-controller',
      'Divertissement': 'game-controller',
      'Shopping': 'bag',
      'Santé': 'medical',
      'Éducation': 'school',
      'Formation': 'school',
    };

    const colorMap = [
      colors.primary.main,
      colors.secondary.main,
      colors.info,
      colors.success,
      colors.error,
      colors.warning,
    ];

    return {
      id: budget.id.toString(),
      name: budget.category.name,
      category: budget.category.name,
      allocated: budget.allocated,
      spent: budget.spent,
      period: 'Mensuel',
      icon: iconMap[budget.category.name] || 'cash',
      color: colorMap[index % colorMap.length],
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBudget}>
          <Ionicons name="add" size={24} color={colors.background.default} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Résumé du mois</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Budget total</Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(displayData.summary.total_allocated)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Dépensé</Text>
              <Text style={[styles.summaryAmount, { color: colors.warning }]}>
                {formatCurrency(Math.abs(displayData.summary.total_spent))}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Restant</Text>
              <Text style={[styles.summaryAmount, { color: displayData.summary.total_remaining >= 0 ? colors.success : colors.error }]}>
                {formatCurrency(displayData.summary.total_remaining)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Utilisé</Text>
              <Text style={[styles.summaryAmount, { color: getProgressColor(displayData.summary.overall_percentage || 0) }]}>
                {(displayData.summary.overall_percentage || 0).toFixed(1)}%
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.overallProgress}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                {
                  width: `${Math.min(displayData.summary.overall_percentage || 0, 100)}%`,
                  backgroundColor: getProgressColor(displayData.summary.overall_percentage || 0),
                }
              ]} />
            </View>
          </View>
        </View>

        {/* Budgets List */}
        <View style={styles.budgetsSection}>
          <Text style={styles.sectionTitle}>Mes budgets</Text>
          
          {mappedBudgets.map((budget) => {
            const spentAmount = Math.abs(budget.spent);
            const percentage = (spentAmount / budget.allocated) * 100;
            const progressColor = getProgressColor(percentage);
            const status = getBudgetStatus(spentAmount, budget.allocated);
            
            return (
              <TouchableOpacity key={budget.id} style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetIcon}>
                    <Ionicons name={budget.icon as any} size={24} color={budget.color} />
                  </View>
                  <View style={styles.budgetInfo}>
                    <Text style={styles.budgetName}>{budget.name}</Text>
                    <Text style={styles.budgetCategory}>{budget.category}</Text>
                    <Text style={styles.budgetPeriod}>{budget.period}</Text>
                  </View>
                  <View style={styles.budgetStatus}>
                    <Text style={[styles.statusText, { color: progressColor }]}>
                      {status}
                    </Text>
                    <Text style={styles.budgetPercentage}>
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.budgetAmounts}>
                  <Text style={styles.budgetSpent}>
                    {formatCurrency(spentAmount)} / {formatCurrency(budget.allocated)}
                  </Text>
                  <Text style={styles.budgetRemaining}>
                    Reste : {formatCurrency(budget.allocated - spentAmount)}
                  </Text>
                </View>

                <View style={styles.budgetProgress}>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      {
                        width: `${getProgressWidth(spentAmount, budget.allocated)}%`,
                        backgroundColor: progressColor,
                      }
                    ]} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleNewBudget}>
              <Ionicons name="add-circle" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Nouveau budget</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleAnalytics}>
              <Ionicons name="analytics" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Analyse</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
              <Ionicons name="settings" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Paramètres</Text>
            </TouchableOpacity>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  summaryAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  overallProgress: {
    marginTop: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.default,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  budgetCard: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  budgetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  budgetCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  budgetPeriod: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.muted,
  },
  budgetStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  budgetPercentage: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  budgetSpent: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  budgetRemaining: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
  },
  budgetProgress: {
    marginTop: theme.spacing.sm,
  },
  quickActions: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    minWidth: 80,
  },
  actionText: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});