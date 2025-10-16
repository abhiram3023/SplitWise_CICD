import { createContext, useContext, useState, ReactNode } from 'react';
import { Group, Expense, Activity, User, Balance } from '../types';
import { mockGroups, mockExpenses, mockActivities, currentUser, mockUsers } from '../data/mockData';

interface AppContextType {
  groups: Group[];
  expenses: Expense[];
  activities: Activity[];
  currentUser: User;
  addGroup: (group: Group) => void;
  addExpense: (expense: Expense) => void;
  getGroupById: (id: string) => Group | undefined;
  getExpensesByGroup: (groupId: string) => Expense[];
  calculateBalances: () => Balance[];
  getGroupBalance: (groupId: string) => { youOwe: number; oweYou: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const addGroup = (group: Group) => {
    setGroups((prev) => [group, ...prev]);
    const activity: Activity = {
      id: Date.now().toString(),
      type: 'group_created',
      description: `You created group "${group.name}"`,
      user: currentUser,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [activity, ...prev]);
  };

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
    const group = groups.find((g) => g.id === expense.group_id);
    const activity: Activity = {
      id: Date.now().toString(),
      type: 'expense_added',
      description: `${expense.paid_by.name} added "${expense.description}" in ${group?.name}`,
      amount: expense.amount,
      user: expense.paid_by,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [activity, ...prev]);

    setGroups((prev) =>
      prev.map((g) =>
        g.id === expense.group_id
          ? { ...g, total_expenses: g.total_expenses + expense.amount }
          : g
      )
    );
  };

  const getGroupById = (id: string) => {
    return groups.find((g) => g.id === id);
  };

  const getExpensesByGroup = (groupId: string) => {
    return expenses.filter((e) => e.group_id === groupId);
  };

  const calculateBalances = (): Balance[] => {
    const balanceMap = new Map<string, number>();

    expenses.forEach((expense) => {
      expense.participants.forEach((participant) => {
        if (participant.user.id === currentUser.id) {
          if (expense.paid_by.id !== currentUser.id) {
            const current = balanceMap.get(expense.paid_by.id) || 0;
            balanceMap.set(expense.paid_by.id, current + participant.amount_owed);
          }
        } else if (expense.paid_by.id === currentUser.id) {
          const current = balanceMap.get(participant.user.id) || 0;
          balanceMap.set(participant.user.id, current - participant.amount_owed);
        }
      });
    });

    const balances: Balance[] = [];
    balanceMap.forEach((amount, userId) => {
      const user = mockUsers.find((u) => u.id === userId);
      if (user && amount !== 0) {
        balances.push({
          user,
          amount: Math.abs(amount),
          type: amount > 0 ? 'owe' : 'owed',
        });
      }
    });

    return balances;
  };

  const getGroupBalance = (groupId: string) => {
    const groupExpenses = expenses.filter((e) => e.group_id === groupId);
    let youOwe = 0;
    let oweYou = 0;

    groupExpenses.forEach((expense) => {
      expense.participants.forEach((participant) => {
        if (participant.user.id === currentUser.id) {
          if (expense.paid_by.id !== currentUser.id) {
            youOwe += participant.amount_owed;
          }
        } else if (expense.paid_by.id === currentUser.id) {
          oweYou += participant.amount_owed;
        }
      });
    });

    return { youOwe, oweYou };
  };

  return (
    <AppContext.Provider
      value={{
        groups,
        expenses,
        activities,
        currentUser,
        addGroup,
        addExpense,
        getGroupById,
        getExpensesByGroup,
        calculateBalances,
        getGroupBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
