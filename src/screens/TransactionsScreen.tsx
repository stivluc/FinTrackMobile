import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, theme } from '../theme';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  icon: string;
}

export default function TransactionsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Données simulées
  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Salaire',
      category: 'Revenus',
      amount: 3200.00,
      date: '2025-01-01',
      type: 'income',
      icon: 'card',
    },
    {
      id: '2',
      title: 'Restaurant Le Gourmet',
      category: 'Alimentation',
      amount: -45.80,
      date: '2025-01-08',
      type: 'expense',
      icon: 'restaurant',
    },
    {
      id: '3',
      title: 'Station Total',
      category: 'Transport',
      amount: -67.20,
      date: '2025-01-07',
      type: 'expense',
      icon: 'car',
    },
    {
      id: '4',
      title: 'Freelance',
      category: 'Revenus',
      amount: 450.00,
      date: '2025-01-05',
      type: 'income',
      icon: 'laptop',
    },
    {
      id: '5',
      title: 'Supermarché',
      category: 'Alimentation',
      amount: -89.45,
      date: '2025-01-04',
      type: 'expense',
      icon: 'bag',
    },
    {
      id: '6',
      title: 'Netflix',
      category: 'Divertissement',
      amount: -15.99,
      date: '2025-01-03',
      type: 'expense',
      icon: 'play',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Refresh transactions data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const renderFilterButton = (filter: 'all' | 'income' | 'expense', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.background.default} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une transaction..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'Toutes')}
        {renderFilterButton('income', 'Revenus')}
        {renderFilterButton('expense', 'Dépenses')}
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <View style={[
                styles.transactionIcon,
                { backgroundColor: transaction.type === 'income' ? colors.success + '20' : colors.error + '20' }
              ]}>
                <Ionicons 
                  name={transaction.icon as any} 
                  size={20} 
                  color={transaction.type === 'income' ? colors.success : colors.error} 
                />
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
              </View>
              
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.amountText,
                  { color: transaction.type === 'income' ? colors.success : colors.error }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyStateTitle}>Aucune transaction trouvée</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery ? 'Essayez un autre terme de recherche' : 'Vos transactions apparaîtront ici'}
            </Text>
          </View>
        )}
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
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  transactionCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text.muted,
  },
  transactionAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
});