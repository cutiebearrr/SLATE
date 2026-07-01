import { Invoice } from './types';

const today = new Date();
const addDays = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const DEMO_INVOICES: Invoice[] = [
  {
    id: 'INV-001',
    clientName: 'Smith Residence',
    clientEmail: 'john.smith@example.com',
    clientPhone: '(555) 123-4567',
    jobDescription: 'Rough-in Plumbing',
    amount: 1675.00,
    dueDate: addDays(-7),
    status: 'Overdue',
    sentDate: addDays(-21),
    autoReminders: true,
    notes: 'Client requested extra care around the new hardwood floors. Left a tarp in the hallway.',
    paymentHistory: [
      { id: 'pay_1', date: addDays(-21), amount: 500, method: 'Credit Card', status: 'Completed' }
    ],
    files: [
      { id: 'f_1', name: 'Original_Quote.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 'f_2', name: 'Permit_Approval.pdf', size: '1.1 MB', type: 'pdf' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400&h=300'
    ],
    paymentLink: 'slate.pay/inv-001'
  },
  {
    id: 'INV-002',
    clientName: 'Johnson HVAC Install',
    jobDescription: 'New Unit Installation',
    amount: 3200.00,
    dueDate: addDays(3),
    status: 'Sent',
    sentDate: addDays(-4),
    autoReminders: true
  },
  {
    id: 'INV-003',
    clientName: 'Martinez Electrical Panel',
    jobDescription: 'Panel Upgrade 200A',
    amount: 890.00,
    dueDate: addDays(-2),
    status: 'Paid',
    sentDate: addDays(-16),
    autoReminders: false
  }
];
