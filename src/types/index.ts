export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  created_at: string;
  total_expenses: number;
}

export interface Expense {
  id: string;
  group_id: string;
  description: string;
  amount: number;
  paid_by: User;
  split_type: 'equal' | 'custom';
  participants: ExpenseParticipant[];
  category: string;
  date: string;
  created_at: string;
}

export interface ExpenseParticipant {
  user: User;
  amount_owed: number;
}

export interface Balance {
  user: User;
  amount: number;
  type: 'owe' | 'owed';
}

export interface Activity {
  id: string;
  type: 'expense_added' | 'payment_made' | 'group_created';
  description: string;
  amount?: number;
  user: User;
  timestamp: string;
}

export type Theme = 'light' | 'dark';
