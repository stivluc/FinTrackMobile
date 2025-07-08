
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, theme } from '../theme';
import apiService from '../services/api';
import { Transaction } from '../types/api';
import { TransactionsSkeleton } from '../components/SkeletonLoader';

type SortOption = '-date' | 'date' | '-amount' | 'amount';
type FilterType = 'all' | 'INCOME' | 'EXPENSE';

// Helper pour s'assurer que l'icône est valide
const getValidIconName = (iconName: string | null | undefined): keyof typeof Ionicons.glyphMap => {
  const validIcons = Ionicons.glyphMap;
  if (iconName && iconName in validIcons) {
    return iconName as keyof typeof Ionicons.glyphMap;
  }
  return 'cash-outline'; // Icône par défaut fiable
};

export default function TransactionsScreen() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('-date');

  const listRef = useRef<FlatList>(null);

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (isLoadingMore) return; // Empêche les appels multiples

    const currentPage = isRefresh ? 1 : page;
    if (isRefresh) setIsRefreshing(true); else setIsLoadingMore(true);

    try {
      const apiParams: any = { page: currentPage, ordering: activeSort, search: searchQuery };
      const data = await apiService.getTransactions(apiParams);

      if (data && Array.isArray(data.results)) {
        const newTransactions = data.results;
        setAllTransactions(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const uniqueNew = newTransactions.filter(t => !existingIds.has(t.id));
          return isRefresh ? newTransactions : [...prev, ...uniqueNew];
        });
        setHasNextPage(!!data.next);
        setPage(currentPage + 1);
      } else {
        setHasNextPage(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les opérations.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
      setIsFilterLoading(false);
    }
  }, [page, searchQuery, activeSort, isLoadingMore]);

  // Premier chargement et changements de filtres/tri
  useEffect(() => {
    const load = async () => {
      setIsFilterLoading(true);
      setPage(1);
      setAllTransactions([]);
      await fetchTransactions(true);
      setIsFilterLoading(false);
    }
    load();
  }, [activeSort, searchQuery]);

  const handleRefresh = () => {
    setPage(1);
    fetchTransactions(true);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isLoadingMore) {
      fetchTransactions();
    }
  };

  // Filtrage côté client
  const filteredTransactions = activeFilter === 'all'
    ? allTransactions
    : allTransactions.filter(t => t.category.type === activeFilter);

  const formatCurrency = (amount: string | number): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(numericAmount));
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIonicon = item.category.icon && item.category.icon in Ionicons.glyphMap;

    return (
      <View style={styles.transactionItem}>
        <View style={[styles.transactionIcon, { backgroundColor: item.category.type === 'INCOME' ? colors.success + '20' : colors.error + '20' }]}>
          {isIonicon ? (
            <Ionicons 
              name={item.category.icon as keyof typeof Ionicons.glyphMap}
              size={20} 
              color={item.category.type === 'INCOME' ? colors.success : colors.error} 
            />
          ) : (
            <Text style={styles.emojiIcon}>{item.category.icon || '💸'}</Text>
          )}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle} numberOfLines={1}>{item.description}</Text>
          <Text style={styles.transactionCategory}>{item.category.name}</Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text style={[styles.amountText, { color: item.category.type === 'INCOME' ? colors.success : colors.error }]}>
            {item.category.type === 'INCOME' ? '+' : ''}{formatCurrency(item.amount)}
          </Text>
          <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Opérations</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("Bientôt disponible", "L'ajout d'opérations sera bientôt possible.")}>
          <Ionicons name="add" size={24} color={colors.background.default} />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <TextInput style={styles.searchInput} placeholder="Rechercher..." value={searchQuery} onChangeText={setSearchQuery} />
        <View style={styles.filtersRow}>
          <TouchableOpacity style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]} onPress={() => setActiveFilter('all')}><Text style={[styles.filterButtonText, activeFilter === 'all' && styles.filterButtonTextActive]}>Toutes</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, activeFilter === 'INCOME' && styles.filterButtonActive]} onPress={() => setActiveFilter('INCOME')}><Text style={[styles.filterButtonText, activeFilter === 'INCOME' && styles.filterButtonTextActive]}>Revenus</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, activeFilter === 'EXPENSE' && styles.filterButtonActive]} onPress={() => setActiveFilter('EXPENSE')}><Text style={[styles.filterButtonText, activeFilter === 'EXPENSE' && styles.filterButtonTextActive]}>Dépenses</Text></TouchableOpacity>
        </View>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Trier par:</Text>
          <TouchableOpacity onPress={() => setActiveSort('-date')}><Text style={[styles.sortText, activeSort === '-date' && styles.sortTextActive]}>Date</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveSort('-amount')}><Text style={[styles.sortText, activeSort === '-amount' && styles.sortTextActive]}>Montant</Text></TouchableOpacity>
        </View>
      </View>

      {isLoading ? <TransactionsSkeleton /> : (
        <FlatList
          ref={listRef}
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore ? <ActivityIndicator style={{ margin: 20 }} /> : null}
          ListEmptyComponent={!isLoading && <Text style={styles.emptyText}>Aucune opération trouvée.</Text>}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary.main} />}
        />
      )}
      {isFilterLoading && <View style={styles.filterLoadingOverlay}><ActivityIndicator size="large" color={colors.primary.main} /></View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
  title: { fontSize: theme.typography.fontSize.xl, fontWeight: 'bold', color: colors.text.primary },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary.main, justifyContent: 'center', alignItems: 'center' },
  controlsContainer: { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  searchInput: { backgroundColor: colors.background.paper, borderRadius: theme.borderRadius.md, height: 44, paddingHorizontal: theme.spacing.md, color: colors.text.primary, marginBottom: theme.spacing.md },
  filtersRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: theme.spacing.md },
  filterButton: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.lg },
  filterButtonActive: { backgroundColor: colors.primary.main + '30' },
  filterButtonText: { fontSize: theme.typography.fontSize.sm, color: colors.text.secondary, fontWeight: '500' },
  filterButtonTextActive: { color: colors.primary.main, fontWeight: 'bold' },
  sortContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border.primary, paddingTop: theme.spacing.sm },
  sortLabel: { color: colors.text.secondary, marginRight: theme.spacing.md },
  sortText: { color: colors.text.secondary, marginHorizontal: theme.spacing.md },
  sortTextActive: { color: colors.primary.main, fontWeight: 'bold' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.paper, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.sm },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  emojiIcon: { fontSize: 20 },
  transactionInfo: { flex: 1, marginRight: theme.spacing.sm },
  transactionTitle: { fontSize: theme.typography.fontSize.md, fontWeight: '600', color: colors.text.primary, marginBottom: 2 },
  transactionCategory: { fontSize: theme.typography.fontSize.sm, color: colors.text.secondary },
  transactionAmountContainer: { alignItems: 'flex-end' },
  amountText: { fontSize: theme.typography.fontSize.md, fontWeight: 'bold', marginBottom: 2 },
  transactionDate: { fontSize: theme.typography.fontSize.xs, color: colors.text.muted },
  emptyText: { textAlign: 'center', marginTop: 50, color: colors.text.secondary },
  filterLoadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
});
