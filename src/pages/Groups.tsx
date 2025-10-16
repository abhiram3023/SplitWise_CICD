import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { CreateGroupModal } from '../components/modals/CreateGroupModal';

export const Groups = ({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) => {
  const { groups, getGroupBalance } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Groups</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your expense groups</p>
        </div>
        <Button onClick={() => setShowCreateGroup(true)}>
          <Plus className="w-5 h-5" />
          Create Group
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group, index) => {
          const { youOwe, oweYou } = getGroupBalance(group.id);
          const netBalance = oweYou - youOwe;

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover onClick={() => onNavigate('group-details', { groupId: group.id })}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{group.name}</h3>
                        {group.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Members</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{group.members.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {group.total_expenses.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Your Balance</span>
                      <span
                        className={`font-bold ${
                          netBalance >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {netBalance >= 0 ? '+' : ''}₹{netBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('group-details', { groupId: group.id });
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No groups found' : 'No groups yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search query' : 'Create your first group to start tracking expenses'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateGroup(true)}>
              <Plus className="w-5 h-5" />
              Create Group
            </Button>
          )}
        </motion.div>
      )}

      <CreateGroupModal isOpen={showCreateGroup} onClose={() => setShowCreateGroup(false)} />
    </div>
  );
};
