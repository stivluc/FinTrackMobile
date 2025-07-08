// Types pour les réponses de l'API FinTrack

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryTrend {
  category: string;
  data: {
    month: string;
    amount: number;
  }[];
}

export interface Insights {
  avg_monthly_savings: number;
  savings_rate: number;
  biggest_expense: {
    amount: number;
    description: string;
    category: string;
    date: string;
  };
  total_income: number;
  total_expenses: number;
  period_months: number;
}

export interface AnalyticsData {
  monthly_data: MonthlyData[];
  category_trends: CategoryTrend[];
  insights: Insights;
}

export interface DashboardStats {
  current_month: {
    total_wealth: number;
    wealth_change: number;
    income: number;
    income_change: number;
    expenses: number;
    expenses_change: number;
    savings: number;
    savings_change: number;
    transactions_count: number;
  };
  wealth_evolution: {
    month: string;
    wealth: number;
  }[];
  wealth_composition: {
    name: string;
    size: number;
    index: number;
  }[];
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: {
    id: number;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    icon: string;
    color: string;
  };
  account: {
    id: number;
    name: string;
    type: string;
  };
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: number;
  allocated: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  spent: number;
  remaining: number;
  percentage_used: number;
  status: 'good' | 'warning' | 'exceeded';
  created_at: string;
  updated_at: string;
}

export interface BudgetOverview {
  summary: {
    total_allocated: number;
    total_spent: number;
    total_remaining: number;
    overall_percentage: number;
  };
  budgets: Budget[];
}