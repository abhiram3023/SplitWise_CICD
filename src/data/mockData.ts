import { User, Group, Expense, Activity } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'You',
  email: 'you@example.com',
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100',
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Rahul',
    email: 'rahul@example.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    name: 'Ananya',
    email: 'ananya@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '4',
    name: 'Priya',
    email: 'priya@example.com',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '5',
    name: 'Arjun',
    email: 'arjun@example.com',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Trip to Goa',
    description: 'Beach vacation expenses',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    created_at: '2025-09-15T10:00:00Z',
    total_expenses: 15000,
  },
  {
    id: '2',
    name: 'Apartment Rent',
    description: 'Monthly shared expenses',
    members: [mockUsers[0], mockUsers[3], mockUsers[4]],
    created_at: '2025-08-01T10:00:00Z',
    total_expenses: 45000,
  },
  {
    id: '3',
    name: 'Office Lunch',
    description: 'Daily lunch expenses',
    members: [mockUsers[0], mockUsers[1], mockUsers[3]],
    created_at: '2025-10-01T10:00:00Z',
    total_expenses: 3500,
  },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    group_id: '1',
    description: 'Hotel Booking',
    amount: 12000,
    paid_by: mockUsers[1],
    split_type: 'equal',
    participants: [
      { user: mockUsers[0], amount_owed: 4000 },
      { user: mockUsers[1], amount_owed: 4000 },
      { user: mockUsers[2], amount_owed: 4000 },
    ],
    category: 'accommodation',
    date: '2025-09-20T10:00:00Z',
    created_at: '2025-09-20T10:00:00Z',
  },
  {
    id: '2',
    group_id: '1',
    description: 'Dinner at Beach Shack',
    amount: 1500,
    paid_by: mockUsers[0],
    split_type: 'equal',
    participants: [
      { user: mockUsers[0], amount_owed: 500 },
      { user: mockUsers[1], amount_owed: 500 },
      { user: mockUsers[2], amount_owed: 500 },
    ],
    category: 'food',
    date: '2025-09-21T19:30:00Z',
    created_at: '2025-09-21T19:30:00Z',
  },
  {
    id: '3',
    group_id: '1',
    description: 'Scooter Rental',
    amount: 1500,
    paid_by: mockUsers[2],
    split_type: 'equal',
    participants: [
      { user: mockUsers[0], amount_owed: 500 },
      { user: mockUsers[1], amount_owed: 500 },
      { user: mockUsers[2], amount_owed: 500 },
    ],
    category: 'transport',
    date: '2025-09-22T09:00:00Z',
    created_at: '2025-09-22T09:00:00Z',
  },
  {
    id: '4',
    group_id: '2',
    description: 'September Rent',
    amount: 45000,
    paid_by: mockUsers[0],
    split_type: 'equal',
    participants: [
      { user: mockUsers[0], amount_owed: 15000 },
      { user: mockUsers[3], amount_owed: 15000 },
      { user: mockUsers[4], amount_owed: 15000 },
    ],
    category: 'rent',
    date: '2025-09-01T10:00:00Z',
    created_at: '2025-09-01T10:00:00Z',
  },
  {
    id: '5',
    group_id: '3',
    description: 'Team Lunch',
    amount: 1200,
    paid_by: mockUsers[1],
    split_type: 'equal',
    participants: [
      { user: mockUsers[0], amount_owed: 400 },
      { user: mockUsers[1], amount_owed: 400 },
      { user: mockUsers[3], amount_owed: 400 },
    ],
    category: 'food',
    date: '2025-10-10T13:00:00Z',
    created_at: '2025-10-10T13:00:00Z',
  },
  {
    id: '6',
    group_id: '3',
    description: 'Coffee Break',
    amount: 450,
    paid_by: mockUsers[3],
    split_type: 'custom',
    participants: [
      { user: mockUsers[0], amount_owed: 150 },
      { user: mockUsers[1], amount_owed: 150 },
      { user: mockUsers[3], amount_owed: 150 },
    ],
    category: 'food',
    date: '2025-10-12T16:00:00Z',
    created_at: '2025-10-12T16:00:00Z',
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'expense_added',
    description: 'Rahul added "Hotel Booking" in Trip to Goa',
    amount: 12000,
    user: mockUsers[1],
    timestamp: '2025-09-20T10:00:00Z',
  },
  {
    id: '2',
    type: 'expense_added',
    description: 'You added "Dinner at Beach Shack" in Trip to Goa',
    amount: 1500,
    user: mockUsers[0],
    timestamp: '2025-09-21T19:30:00Z',
  },
  {
    id: '3',
    type: 'expense_added',
    description: 'Ananya added "Scooter Rental" in Trip to Goa',
    amount: 1500,
    user: mockUsers[2],
    timestamp: '2025-09-22T09:00:00Z',
  },
  {
    id: '4',
    type: 'group_created',
    description: 'You created group "Office Lunch"',
    user: mockUsers[0],
    timestamp: '2025-10-01T10:00:00Z',
  },
  {
    id: '5',
    type: 'expense_added',
    description: 'Rahul added "Team Lunch" in Office Lunch',
    amount: 1200,
    user: mockUsers[1],
    timestamp: '2025-10-10T13:00:00Z',
  },
];
