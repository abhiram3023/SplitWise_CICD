import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, TrendingUp, TrendingDown, Wallet, Activity as ActivityIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { CreateGroupModal } from '../components/modals/CreateGroupModal';
import { ActivityFeed } from '../components/ActivityFeed';

export const Dashboard = ({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) => {
  const { calculateBalances, activities } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const balances = calculateBalances();
  const totalOwe = balances.filter((b) => b.type === 'owe').reduce((sum, b) => sum + b.amount, 0);
  const totalOwed = balances.filter((b) => b.type === 'owed').reduce((sum, b) => sum + b.amount, 0);
  const netBalance = totalOwed - totalOwe;

  const stats = [
    {
      title: 'Total Balance',
      value: `₹${netBalance.toFixed(2)}`,
      icon: Wallet,
      color: netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: netBalance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      trend: netBalance >= 0 ? 'positive' : 'negative',
    },
    {
      title: 'You Owe',
      value: `₹${totalOwe.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Owed to You',
      value: `₹${totalOwed.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your shared expenses</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowAddExpense(true)} size="md">
            <Plus className="w-5 h-5" />
            Add Expense
          </Button>
          <Button onClick={() => setShowCreateGroup(true)} variant="outline" size="md">
            <Users className="w-5 h-5" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => onNavigate('groups')}
                  variant="outline"
                  className="h-24 text-lg justify-start"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>View All Groups</span>
                  </div>
                </Button>
                <Button
                  onClick={() => onNavigate('settlement')}
                  variant="outline"
                  className="h-24 text-lg justify-start"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Settle Up</span>
                  </div>
                </Button>
                <Button
                  onClick={() => onNavigate('summary')}
                  variant="outline"
                  className="h-24 text-lg justify-start"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>View Summary</span>
                  </div>
                </Button>
                <Button
                  onClick={() => setShowAddExpense(true)}
                  variant="outline"
                  className="h-24 text-lg justify-start"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Plus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>Add New Expense</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <ActivityIcon className="w-6 h-6" />
                Recent Activity
              </h2>
              <ActivityFeed activities={activities.slice(0, 5)} compact />
              {activities.length > 5 && (
                <Button
                  onClick={() => onNavigate('groups')}
                  variant="ghost"
                  className="w-full mt-4"
                  size="sm"
                >
                  View All Activity
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AddExpenseModal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} />
      <CreateGroupModal isOpen={showCreateGroup} onClose={() => setShowCreateGroup(false)} />
    </div>
  );
};
