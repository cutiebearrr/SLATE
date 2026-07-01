import { useState } from 'react';
import { ArrowLeft, Link as LinkIcon, Send } from 'lucide-react';
import { Invoice } from '../types';

interface NewInvoiceProps {
  onBack: () => void;
  onSubmit: (invoice: Partial<Invoice>) => void;
  onViewClient: (id: string) => void;
}

export function NewInvoice({ onBack, onSubmit, onViewClient }: NewInvoiceProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [newId, setNewId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `INV-00${Math.floor(Math.random() * 900) + 100}`;
    setNewId(id);
    setIsGenerated(true);
    
    // In a real app we'd gather form data, but for MVP we mock it
    onSubmit({
      id,
      clientName: (document.getElementById('client') as HTMLInputElement).value || 'New Client',
      jobDescription: (document.getElementById('job') as HTMLInputElement).value || 'Standard Service',
      amount: parseFloat((document.getElementById('amount') as HTMLInputElement).value) || 0,
      dueDate: (document.getElementById('date') as HTMLInputElement).value || new Date().toISOString().split('T')[0],
      status: 'Sent',
      sentDate: new Date().toISOString().split('T')[0],
      autoReminders: (document.getElementById('reminders') as HTMLInputElement).checked
    });
  };

  if (isGenerated) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in zoom-in-95 duration-300 text-center px-4">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
          <Send className="w-8 h-8 ml-1" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Invoice Generated!</h2>
        <p className="text-gray-400 mb-8">The secure payment link is ready to share with your client.</p>
        
        <div className="w-full max-w-sm bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-gray-300 font-mono text-sm truncate mr-3">slate.pay/{newId.toLowerCase()}</span>
          <button className="bg-[#2a2a35] hover:bg-gray-600 p-2 rounded-lg text-white transition-colors">
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-col w-full gap-3 max-w-sm">
          <button 
            onClick={() => onViewClient(newId)}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Preview Client View
          </button>
          <button 
            onClick={onBack}
            className="w-full py-3.5 bg-transparent border border-[#2a2a35] text-white rounded-xl font-semibold hover:bg-[#1a1a24] active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">Create Invoice</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400" htmlFor="client">Client Name</label>
          <input 
            id="client" 
            type="text" 
            placeholder="e.g. John Smith" 
            className="w-full bg-[#12121a] border border-[#2a2a35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400" htmlFor="job">Job Description</label>
          <input 
            id="job" 
            type="text" 
            placeholder="e.g. Rough-in Plumbing" 
            className="w-full bg-[#12121a] border border-[#2a2a35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-gray-400" htmlFor="amount">Amount ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <input 
                id="amount" 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                className="w-full bg-[#12121a] border border-[#2a2a35] rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-gray-400" htmlFor="date">Due Date</label>
            <input 
              id="date" 
              type="date" 
              className="w-full bg-[#12121a] border border-[#2a2a35] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-white font-medium">Automated Follow-ups</span>
            <span className="text-gray-400 text-xs mt-0.5">Send reminders at 1, 7, and 14 days</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input id="reminders" type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-[#2a2a35] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <button 
          type="submit"
          className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] active:scale-95 transition-all"
        >
          Generate Invoice & Link
        </button>
      </form>
    </div>
  );
}
