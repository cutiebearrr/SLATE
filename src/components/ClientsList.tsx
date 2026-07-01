import { Invoice } from '../types';
import { Users, ChevronRight, Search } from 'lucide-react';

interface ClientsListProps {
  invoices: Invoice[];
  onNavigate: (view: any, clientName?: string) => void;
}

export function ClientsList({ invoices, onNavigate }: ClientsListProps) {
  const clientsMap = invoices.reduce((acc, invoice) => {
    if (!acc[invoice.clientName]) {
      acc[invoice.clientName] = {
        name: invoice.clientName,
        totalBilled: 0,
        totalPaid: 0,
        invoiceCount: 0,
        email: invoice.clientEmail,
        phone: invoice.clientPhone
      };
    }
    acc[invoice.clientName].totalBilled += invoice.amount;
    if (invoice.status === 'Paid') {
      acc[invoice.clientName].totalPaid += invoice.amount;
    }
    acc[invoice.clientName].invoiceCount += 1;
    return acc;
  }, {} as Record<string, any>);

  const clients = Object.values(clientsMap).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mt-2">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-4">Clients</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search clients..." 
            className="w-full bg-[#12121a] border border-[#2a2a35] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {clients.map((client) => (
          <div 
            key={client.name}
            onClick={() => onNavigate('client_details', client.name)}
            className="cursor-pointer p-4 rounded-xl border border-[#2a2a35] bg-[#12121a] hover:border-purple-500/50 hover:bg-[#1a1a24] transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-medium">{client.name}</h3>
                <p className="text-gray-500 text-xs">{client.invoiceCount} {client.invoiceCount === 1 ? 'Project' : 'Projects'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-semibold">${client.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p className="text-gray-500 text-xs">Total Earned</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 bg-[#0a0a0f] rounded-lg border border-[#2a2a35] border-dashed">
            <Users className="w-8 h-8 mb-3 opacity-50" />
            <p className="text-sm">No clients found</p>
          </div>
        )}
      </div>
    </div>
  );
}
