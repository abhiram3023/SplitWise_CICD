import { motion } from 'framer-motion';
import { Plus, DollarSign, Users } from 'lucide-react';
import { Activity } from '../types';

interface ActivityFeedProps {
  activities: Activity[];
  compact?: boolean;
}

export const ActivityFeed = ({ activities, compact = false }: ActivityFeedProps) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'expense_added':
        return <DollarSign className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
      case 'group_created':
        return <Users className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'payment_made':
        return <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return activityTime.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No recent activity
      </div>
    );
  }

  return (
    <div className={`space-y-${compact ? '3' : '4'}`}>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-start gap-3 ${compact ? 'text-sm' : ''}`}
        >
          <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${compact ? '' : 'mt-1'}`}>
            {getIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white font-medium">
              {activity.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getTimeAgo(activity.timestamp)}
              </p>
              {activity.amount && (
                <>
                  <span className="text-gray-400">•</span>
                  <p className="text-xs font-semibold text-blue-600 dark:text-cyan-400">
                    ₹{activity.amount.toFixed(2)}
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
