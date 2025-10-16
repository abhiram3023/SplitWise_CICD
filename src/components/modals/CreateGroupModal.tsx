import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { useApp } from '../../context/AppContext';
import { Group } from '../../types';
import { mockUsers } from '../../data/mockData';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal = ({ isOpen, onClose }: CreateGroupModalProps) => {
  const { addGroup, currentUser } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || selectedMembers.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    const group: Group = {
      id: Date.now().toString(),
      name,
      description,
      members: mockUsers.filter((u) => selectedMembers.includes(u.id)),
      created_at: new Date().toISOString(),
      total_expenses: 0,
    };

    addGroup(group);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedMembers([currentUser.id]);
    onClose();
  };

  const toggleMember = (memberId: string) => {
    if (memberId === currentUser.id) return;
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Group" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <Input
          label="Group Name"
          placeholder="e.g., Trip to Goa, Apartment Rent"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextArea
          label="Description (Optional)"
          placeholder="What is this group for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Add Members
          </label>
          <div className="space-y-2">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  user.id === currentUser.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(user.id)}
                  onChange={() => toggleMember(user.id)}
                  disabled={user.id === currentUser.id}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.name} {user.id === currentUser.id && '(You)'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
};
