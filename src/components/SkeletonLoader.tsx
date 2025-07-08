import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, theme } from '../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerSkeleton}>
        <SkeletonLoader width={100} height={24} />
        <SkeletonLoader width={40} height={40} borderRadius={20} />
      </View>

      {/* Period buttons skeleton */}
      <View style={styles.periodSkeleton}>
        <SkeletonLoader width={70} height={32} borderRadius={8} style={styles.periodButton} />
        <SkeletonLoader width={70} height={32} borderRadius={8} style={styles.periodButton} />
        <SkeletonLoader width={70} height={32} borderRadius={8} style={styles.periodButton} />
      </View>

      {/* Summary cards skeleton */}
      <View style={styles.summarySection}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <SkeletonLoader width={48} height={48} borderRadius={24} style={styles.centerMargin} />
            <SkeletonLoader width={100} height={20} style={styles.centerMargin} />
            <SkeletonLoader width={80} height={14} style={styles.centerMargin} />
            <SkeletonLoader width={120} height={12} style={styles.centerMargin} />
          </View>
          <View style={styles.summaryCard}>
            <SkeletonLoader width={48} height={48} borderRadius={24} style={styles.centerMargin} />
            <SkeletonLoader width={100} height={20} style={styles.centerMargin} />
            <SkeletonLoader width={80} height={14} style={styles.centerMargin} />
            <SkeletonLoader width={120} height={12} style={styles.centerMargin} />
          </View>
        </View>

        {/* Savings card skeleton */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsRow}>
            <SkeletonLoader width={48} height={48} borderRadius={24} />
            <View style={styles.savingsInfo}>
              <SkeletonLoader width={120} height={24} style={styles.marginBottom} />
              <SkeletonLoader width={80} height={16} />
            </View>
            <View style={styles.savingsRate}>
              <SkeletonLoader width={60} height={24} style={styles.marginBottom} />
              <SkeletonLoader width={70} height={12} />
            </View>
          </View>
        </View>
      </View>

      {/* Category breakdown skeleton */}
      <View style={styles.sectionWithPadding}>
        <SkeletonLoader width={180} height={20} style={styles.sectionTitle} />
        <View style={styles.categoryContainer}>
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.categoryItem}>
              <View style={styles.categoryRow}>
                <SkeletonLoader width={24} height={24} borderRadius={12} />
                <SkeletonLoader width={100} height={16} style={styles.categoryName} />
                <SkeletonLoader width={40} height={16} />
              </View>
              <SkeletonLoader width="100%" height={6} borderRadius={3} style={styles.categoryBar} />
              <SkeletonLoader width={80} height={14} style={styles.categoryAmount} />
            </View>
          ))}
        </View>
      </View>

      {/* Monthly trend skeleton */}
      <View style={styles.sectionWithPadding}>
        <SkeletonLoader width={160} height={20} style={styles.sectionTitle} />
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <View key={item} style={styles.chartColumn}>
                <SkeletonLoader width={8} height={60} borderRadius={4} style={styles.bar} />
                <SkeletonLoader width={8} height={40} borderRadius={4} style={styles.bar} />
                <SkeletonLoader width={30} height={12} style={styles.chartLabel} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Insights skeleton */}
      <View style={[styles.sectionWithPadding, { paddingBottom: theme.spacing.lg }]}>
        <SkeletonLoader width={80} height={20} style={styles.sectionTitle} />
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.insightCard}>
            <SkeletonLoader width={40} height={40} borderRadius={20} />
            <View style={styles.insightContent}>
              <SkeletonLoader width={150} height={16} style={styles.marginBottom} />
              <SkeletonLoader width="100%" height={14} style={styles.marginBottom} />
              <SkeletonLoader width="70%" height={14} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};


// Skeleton pour un item de la liste des transactions
const TransactionSkeletonItem: React.FC = () => (
  <View style={styles.transactionItem}>
    <SkeletonLoader width={40} height={40} borderRadius={20} style={styles.transactionIcon} />
    <View style={styles.transactionInfo}>
      <SkeletonLoader width={'70%'} height={16} style={{ marginBottom: theme.spacing.xs }} />
      <SkeletonLoader width={'40%'} height={12} />
    </View>
    <View style={styles.transactionAmountSkeleton}>
      <SkeletonLoader width={60} height={16} style={{ marginBottom: theme.spacing.xs }} />
      <SkeletonLoader width={40} height={12} />
    </View>
  </View>
);

// Skeleton pour la liste complète des transactions
export const TransactionsSkeleton: React.FC = () => (
  <View style={styles.sectionWithPadding}>
    {Array.from({ length: 8 }).map((_, index) => (
      <TransactionSkeletonItem key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  periodSkeleton: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  periodButton: {
    marginRight: theme.spacing.sm,
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
  centerMargin: {
    marginBottom: theme.spacing.sm,
  },
  savingsCard: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: theme.spacing.lg,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  savingsRate: {
    alignItems: 'flex-end',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionWithPadding: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  categoryContainer: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  categoryItem: {
    marginBottom: theme.spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  categoryName: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  categoryBar: {
    marginBottom: theme.spacing.xs,
  },
  categoryAmount: {
    alignSelf: 'flex-end',
  },
  chartContainer: {
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    height: 150,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  chartColumn: {
    alignItems: 'center',
  },
  bar: {
    marginBottom: 2,
  },
  chartLabel: {
    marginTop: theme.spacing.sm,
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
  insightContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  marginBottom: {
    marginBottom: theme.spacing.xs,
  },
  // Styles for TransactionsSkeleton
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  transactionIcon: {
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmountSkeleton: {
    alignItems: 'flex-end',
  },
});