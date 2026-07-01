import { useState } from 'react';
import { Invoice } from '../types';
import { ShieldCheck, ArrowLeft, Download, CreditCard, Apple, Loader2 } from 'lucide-react';

interface ClientViewProps {
  invoice: Invoice;
  onBack: () => void;
  onPay: (id: string) => void;
}

export function ClientView({ invoice, onBack, onPay }: ClientViewProps) {
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      onPay(invoice.id);
    }, 1500);
  };

  // We use a light theme here, completely overriding the app's dark theme
  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto animate-in fade-in duration-300">
      {/* Contractor returning back bar (Only for demo purposes, wouldn't be visible to real client) */}
      <div className="bg-gray-900 text-white p-3 flex justify-between items-center text-xs">
        <span className="opacity-70">Contractor Preview Mode</span>
        <button onClick={onBack} className="flex items-center gap-1 font-medium hover:text-purple-400">
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-md mx-auto p-6 pt-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SLATE</h1>
            <p className="text-sm text-gray-500 font-medium">Powered by Slate Payments</p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-gray-400">
                {invoice.clientName.charAt(0)}
              </span>
            </div>
            <h2 className="text-gray-500 font-medium mb-1">Invoice for {invoice.clientName}</h2>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
              ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
              invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {invoice.status === 'Paid' ? 'PAID IN FULL' : `DUE ${new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}`}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-6 mb-8">
            <div className="flex justify-between mb-4">
              <span className="text-gray-500 text-sm">Description</span>
              <span className="text-gray-900 font-medium text-sm text-right max-w-[60%]">{invoice.jobDescription}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-500 text-sm">Invoice Number</span>
              <span className="text-gray-900 font-medium text-sm">{invoice.id}</span>
            </div>
          </div>

          {invoice.status !== 'Paid' ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={handlePay}
                disabled={isPaying}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
              >
                {isPaying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                {isPaying ? 'Processing...' : 'Pay with Card'}
              </button>
              <button 
                onClick={handlePay}
                disabled={isPaying}
                className="w-full py-4 bg-black text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
              >
                {isPaying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Apple className="w-5 h-5" fill="currentColor" />}
                {isPaying ? 'Processing...' : 'Pay'}
              </button>
            </div>
          ) : (
            <div className="w-full py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Payment Successful
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <button className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors">
              <Download className="w-4 h-4" /> Download PDF Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
