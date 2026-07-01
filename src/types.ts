export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Sent';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface FileRecord {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc';
  url?: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  jobDescription: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  sentDate: string;
  autoReminders: boolean;
  notes?: string;
  paymentHistory?: PaymentRecord[];
  files?: FileRecord[];
  photos?: string[];
  paymentLink?: string;
}

export type ViewState = 'home' | 'invoices' | 'clients' | 'settings' | 'new_invoice' | 'invoice_detail' | 'client_view' | 'client_details';
