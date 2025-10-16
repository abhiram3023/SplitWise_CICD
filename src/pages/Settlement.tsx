import { motion } from 'framer-motion';
import { Wallet, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export const Settlement = () => {
  const { calculateBalances } = useApp();
  const [settledBalances, setSettledBalances] = useState<Set<string>>(new Set());

  const balances = calculateBalances();
  const oweBalances = balances.filter((b) => b.type === 'owe');
  const owedBalances = balances.filter((b) => b.type === 'owed');

  const handleSettle = (userId: string) => {
    setSettledBalances((prev) => new Set(prev).add(userId));
  };

  const totalOwe = oweBalances.reduce((sum, b) => sum + b.amount, 0);
  const totalOwed = owedBalances.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Settlement</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Settle your balances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <Wallet className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total You Owe</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalOwe.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Owed to You</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalOwed.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {oweBalances.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">You Owe</h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {oweBalances.map((balance, index) => {
                const isSettled = settledBalances.has(balance.user.id);
                return (
                  <motion.div
                    key={balance.user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 ${isSettled ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={balance.user.avatar || `https://ui-avatars.com/api/?name=${balance.user.name}`}
                          alt={balance.user.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {balance.user.name}
                            </p>
                            {isSettled && (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-600 dark:text-gray-400">You owe</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="text-red-600 dark:text-red-400 font-bold">
                              ₹{balance.amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={isSettled ? 'outline' : 'primary'}
                        disabled={isSettled}
                        onClick={() => handleSettle(balance.user.id)}
                        size="md"
                      >
                        {isSettled ? 'Settled' : 'Settle Up'}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {owedBalances.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Owed to You</h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {owedBalances.map((balance, index) => (
                <motion.div
                  key={balance.user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={balance.user.avatar || `https://ui-avatars.com/api/?name=${balance.user.name}`}
                        alt={balance.user.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {balance.user.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-600 dark:text-gray-400">{balance.user.name} owes you</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            ₹{balance.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="md">
                      Remind
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {balances.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Wallet className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">All settled up!</h3>
          <p className="text-gray-600 dark:text-gray-400">You don't owe anyone and no one owes you</p>
        </motion.div>
      )}
    </div>
  );
};
