import { Invoice } from '../types';
import { Download, ChevronRight, CheckCircle, AlertTriangle, Send, Clock, FileText } from 'lucide-react';

interface InvoicesListProps {
  invoices: Invoice[];
  onNavigate: (view: any, id?: string) => void;
}

export function InvoicesList({ invoices, onNavigate }: InvoicesListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Overdue': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Sent': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Overdue': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'Sent': return <Send className="w-3.5 h-3.5" />;
      case 'Pending': return <Clock className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Invoice ID', 'Client Name', 'Job Description', 'Amount', 'Due Date', 'Status', 'Sent Date'];
    const rows = invoices.map(i => [
      i.id,
      `"${i.clientName}"`, // Escape commas in names
      `"${i.jobDescription}"`, // Escape commas in descriptions
      i.amount.toString(),
      i.dueDate,
      i.status,
      i.sentDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `slate_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">All Invoices</h1>
        <button 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span className="text-sm">Export CSV</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {invoices.map((invoice) => (
          <div 
            key={invoice.id}
            onClick={() => onNavigate('invoice_detail', invoice.id)}
            className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
              invoice.status === 'Overdue' 
                ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'border-[#2a2a35] bg-[#12121a] hover:border-purple-500/50 hover:bg-[#1a1a24]'
            } flex flex-col gap-3`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium">{invoice.clientName}</h3>
                <p className="text-gray-400 text-sm">{invoice.jobDescription}</p>
              </div>
              <span className="text-white font-semibold">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {getStatusIcon(invoice.status)}
                {invoice.status}
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                {invoice.status === 'Overdue' ? 'Due ' : 'Due '} 
                {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <ChevronRight className="w-4 h-4 ml-1 opacity-50" />
              </div>
            </div>
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 bg-[#0a0a0f] rounded-lg border border-[#2a2a35] border-dashed">
            <FileText className="w-8 h-8 mb-3 opacity-50" />
            <p className="text-sm">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
}
