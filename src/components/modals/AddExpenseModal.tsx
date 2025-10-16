import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, TextArea, Select } from '../ui/Input';
import { useApp } from '../../context/AppContext';
import { Expense, ExpenseParticipant } from '../../types';
import { mockUsers } from '../../data/mockData';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGroupId?: string;
}

export const AddExpenseModal = ({ isOpen, onClose, defaultGroupId }: AddExpenseModalProps) => {
  const { groups, addExpense, currentUser } = useApp();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [groupId, setGroupId] = useState(defaultGroupId || '');
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [category, setCategory] = useState('general');

  const selectedGroup = groups.find((g) => g.id === groupId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !groupId || selectedMembers.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    const totalAmount = parseFloat(amount);
    const paidByUser = mockUsers.find((u) => u.id === paidBy) || currentUser;

    let participants: ExpenseParticipant[];

    if (splitType === 'equal') {
      const amountPerPerson = totalAmount / selectedMembers.length;
      participants = selectedMembers.map((memberId) => ({
        user: mockUsers.find((u) => u.id === memberId)!,
        amount_owed: amountPerPerson,
      }));
    } else {
      participants = selectedMembers.map((memberId) => ({
        user: mockUsers.find((u) => u.id === memberId)!,
        amount_owed: parseFloat(customAmounts[memberId] || '0'),
      }));

      const totalCustom = participants.reduce((sum, p) => sum + p.amount_owed, 0);
      if (Math.abs(totalCustom - totalAmount) > 0.01) {
        alert(`Custom amounts (₹${totalCustom.toFixed(2)}) must equal total amount (₹${totalAmount.toFixed(2)})`);
        return;
      }
    }

    const expense: Expense = {
      id: Date.now().toString(),
      group_id: groupId,
      description,
      amount: totalAmount,
      paid_by: paidByUser,
      split_type: splitType,
      participants,
      category,
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    addExpense(expense);
    handleClose();
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    setGroupId(defaultGroupId || '');
    setPaidBy(currentUser.id);
    setSplitType('equal');
    setSelectedMembers([]);
    setCustomAmounts({});
    setCategory('general');
    onClose();
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Expense" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <Input
          label="Description"
          placeholder="What was this expense for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <Select
          label="Group"
          value={groupId}
          onChange={(e) => {
            setGroupId(e.target.value);
            setSelectedMembers([]);
          }}
          options={[
            { value: '', label: 'Select a group' },
            ...groups.map((g) => ({ value: g.id, label: g.name })),
          ]}
          required
        />

        {selectedGroup && (
          <Select
            label="Paid By"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            options={selectedGroup.members.map((m) => ({ value: m.id, label: m.name }))}
            required
          />
        )}

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: 'general', label: 'General' },
            { value: 'food', label: 'Food' },
            { value: 'transport', label: 'Transport' },
            { value: 'accommodation', label: 'Accommodation' },
            { value: 'rent', label: 'Rent' },
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Split Type
          </label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={splitType === 'equal' ? 'primary' : 'outline'}
              onClick={() => setSplitType('equal')}
              className="flex-1"
            >
              Equal Split
            </Button>
            <Button
              type="button"
              variant={splitType === 'custom' ? 'primary' : 'outline'}
              onClick={() => setSplitType('custom')}
              className="flex-1"
            >
              Custom Split
            </Button>
          </div>
        </div>

        {selectedGroup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Split Between
            </label>
            <div className="space-y-2">
              {selectedGroup.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                  </div>
                  {splitType === 'custom' && selectedMembers.includes(member.id) && (
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={customAmounts[member.id] || ''}
                      onChange={(e) =>
                        setCustomAmounts((prev) => ({ ...prev, [member.id]: e.target.value }))
                      }
                      className="w-32"
                    />
                  )}
                  {splitType === 'equal' && selectedMembers.includes(member.id) && amount && (
                    <span className="text-gray-600 dark:text-gray-400">
                      ₹{(parseFloat(amount) / selectedMembers.length).toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
