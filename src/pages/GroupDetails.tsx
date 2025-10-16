import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Users, TrendingUp, Calendar, User, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';

interface GroupDetailsProps {
  onNavigate: (page: string, data?: any) => void;
  groupId: string;
}

export const GroupDetails = ({ onNavigate, groupId }: GroupDetailsProps) => {
  const { getGroupById, getExpensesByGroup, getGroupBalance } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);

  const group = getGroupById(groupId);
  const expenses = getExpensesByGroup(groupId);
  const { youOwe, oweYou } = getGroupBalance(groupId);

  if (!group) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Group not found</h2>
        <Button onClick={() => onNavigate('groups')} className="mt-4">
          Back to Groups
        </Button>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    food: 'bg-orange-500',
    transport: 'bg-blue-500',
    accommodation: 'bg-purple-500',
    rent: 'bg-green-500',
    general: 'bg-gray-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('groups')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
          {group.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{group.description}</p>
          )}
        </div>
        <Button onClick={() => setShowAddExpense(true)}>
          <Plus className="w-5 h-5" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{group.members.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">You Owe</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{youOwe.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Owed to You</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{oweYou.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Expenses</h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <IndianRupee className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No expenses yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first expense to get started</p>
                    <Button onClick={() => setShowAddExpense(true)}>
                      <Plus className="w-5 h-5" />
                      Add Expense
                    </Button>
                  </div>
                ) : (
                  expenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-2 h-14 rounded-full ${categoryColors[expense.category] || categoryColors.general}`} />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                  {expense.description}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>Paid by {expense.paid_by.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  ₹{expense.amount.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                  {expense.split_type} split
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {expense.participants.map((participant) => (
                                <div
                                  key={participant.user.id}
                                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                                >
                                  <span className="text-gray-700 dark:text-gray-300">{participant.user.name}</span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    ₹{participant.amount_owed.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Members</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <img
                      src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        defaultGroupId={groupId}
      />
    </div>
  );
};
