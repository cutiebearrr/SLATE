import { Invoice } from '../types';
import { Plus, CheckCircle, Clock, AlertTriangle, Send, ChevronRight, FileText, DollarSign, FilePlus, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  invoices: Invoice[];
  onNavigate: (view: any, id?: string) => void;
}

export function Dashboard({ invoices, onNavigate }: DashboardProps) {
  const totalOutstanding = invoices
    .filter(i => i.status !== 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const paidThisMonth = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
  const pendingCount = invoices.filter(i => i.status === 'Pending' || i.status === 'Sent').length;

  const overdueInvoices = [...invoices]
    .filter(i => i.status === 'Overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const chartData = [...invoices]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .reduce((acc, invoice) => {
      const month = new Date(invoice.dueDate).toLocaleString('en-US', { month: 'short' });
      const existing = acc.find(item => item.name === month);
      if (existing) {
        if (invoice.status === 'Paid') {
          existing.paid += invoice.amount;
        } else {
          existing.expected += invoice.amount;
        }
      } else {
        acc.push({ 
          name: month, 
          paid: invoice.status === 'Paid' ? invoice.amount : 0,
          expected: invoice.status !== 'Paid' ? invoice.amount : 0
        });
      }
      return acc;
    }, [] as { name: string, paid: number, expected: number }[]);

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
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Total */}
      <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-[#1a1a24] to-transparent rounded-2xl border border-[#2a2a35]">
        <span className="text-gray-400 text-sm font-medium tracking-wide uppercase">Outstanding Balance</span>
        <h1 className="text-5xl font-bold text-white tracking-tight mt-2 mb-1">
          ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </h1>
        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4"></div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-xs mb-1">Paid (Mo)</span>
          <span className="text-emerald-400 font-semibold">${paidThisMonth.toLocaleString()}</span>
        </div>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-xs mb-1">Overdue</span>
          <span className="text-red-400 font-semibold">{overdueCount}</span>
        </div>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-xs mb-1">Pending</span>
          <span className="text-blue-400 font-semibold">{pendingCount}</span>
        </div>
      </div>

      {/* Action Required: Overdue Invoices */}
      {overdueInvoices.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Action Required
          </h2>
          <div className="flex flex-col gap-3">
            {overdueInvoices.map((invoice) => {
              const days = getDaysOverdue(invoice.dueDate);
              return (
                <div 
                  key={invoice.id}
                  onClick={() => onNavigate('invoice_detail', invoice.id)}
                  className="cursor-pointer p-4 rounded-xl border border-red-500/50 bg-[#12121a] shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-white font-medium">{invoice.clientName}</h3>
                    <p className="text-gray-400 text-sm">{invoice.id} • ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-md text-xs font-bold border border-red-500/30">
                      PAST DUE
                    </span>
                    <span className="text-gray-500 text-xs font-medium">{days} {days === 1 ? 'day' : 'days'} late</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue Trends</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip 
                cursor={{ fill: '#2a2a35', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a35', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ fontSize: '14px' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="paid" name="Paid" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="expected" name="Expected" stackId="a" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
            <span className="text-xs text-gray-400 font-medium">Paid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></div>
            <span className="text-xs text-gray-400 font-medium">Expected</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-center group">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-300 font-medium">Log Payment</span>
          </button>
          <button className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-center group">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <FilePlus className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-300 font-medium">Create Estimate</span>
          </button>
          <button className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-center group">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-300 font-medium">Sync Contacts</span>
          </button>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-semibold text-white">Recent Invoices</h2>
          <button className="text-purple-400 text-sm font-medium">View All</button>
        </div>

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
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => onNavigate('new_invoice')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center text-white hover:scale-105 transition-transform active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
