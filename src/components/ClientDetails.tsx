import { Invoice } from '../types';
import { ArrowLeft, Mail, Phone, ChevronRight, CheckCircle, AlertTriangle, Send, Clock, FileText, MapPin } from 'lucide-react';

interface ClientDetailsProps {
  clientName: string;
  invoices: Invoice[];
  onBack: () => void;
  onNavigate: (view: any, id?: string) => void;
}

export function ClientDetails({ clientName, invoices, onBack, onNavigate }: ClientDetailsProps) {
  const clientInvoices = invoices.filter(i => i.clientName === clientName).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  
  const totalBilled = clientInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = clientInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const outstanding = totalBilled - totalPaid;
  
  const clientInfo = clientInvoices[0] || {};
  const email = clientInfo.clientEmail;
  const phone = clientInfo.clientPhone;

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

  return (
    <div className="flex flex-col animate-in slide-in-from-right-4 duration-300 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Client Details</h2>
      </div>

      <div className="bg-gradient-to-b from-[#1a1a24] to-[#12121a] border border-[#2a2a35] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-2xl shadow-[0_0_15px_rgba(124,58,237,0.15)]">
            {clientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{clientName}</h3>
            <p className="text-gray-400 text-sm">{clientInvoices.length} {clientInvoices.length === 1 ? 'Project' : 'Projects'}</p>
          </div>
        </div>

        {(email || phone) && (
          <div className="flex flex-col gap-3 mb-6 p-4 bg-[#0a0a0f] rounded-xl border border-[#2a2a35]">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                <div className="p-1.5 bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-purple-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{email}</span>
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-3 group">
                <div className="p-1.5 bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-purple-400 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{phone}</span>
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-4">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1 block">Total Earned</span>
            <span className="text-2xl font-bold text-emerald-400">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-4">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1 block">Outstanding</span>
            <span className="text-2xl font-bold text-white">${outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-4 overflow-hidden relative group">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3 block">Coverage Area (Past Jobs)</span>
          <div className="h-32 w-full bg-gray-900/50 rounded-lg border border-gray-800 relative overflow-hidden flex items-center justify-center">
            {/* Simple abstract map background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-600 via-gray-900 to-[#0a0a0f]" />
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMCAyMGg0ME0wIDMwaDQwTTEwIDB2NDBNMjAgMHY0ME0zMCAwdjQwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            
            {/* Map Pins */}
            <div className="absolute top-[30%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
              <MapPin className="w-5 h-5 text-purple-400 fill-purple-900/50" />
            </div>
            <div className="absolute top-[60%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-150">
              <MapPin className="w-6 h-6 text-pink-400 fill-pink-900/50" />
            </div>
            <div className="absolute top-[40%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-300">
              <MapPin className="w-4 h-4 text-emerald-400 fill-emerald-900/50" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
              <span className="text-white text-xs font-medium px-3 py-1.5 bg-black/60 rounded-full border border-gray-700">Interactive Map Preview</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-white mb-2">Project History</h3>
        
        {clientInvoices.map((invoice) => (
          <div 
            key={invoice.id}
            onClick={() => onNavigate('invoice_detail', invoice.id)}
            className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
              invoice.status === 'Overdue' 
                ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'border-[#2a2a35] bg-[#12121a] hover:border-purple-500/50 hover:bg-[#1a1a24]'
            } flex flex-col gap-3 group`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">{invoice.jobDescription}</h4>
                <p className="text-gray-500 text-xs mt-0.5">{invoice.id}</p>
              </div>
              <span className="text-white font-semibold">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {getStatusIcon(invoice.status)}
                {invoice.status}
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 group-hover:text-purple-400 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
