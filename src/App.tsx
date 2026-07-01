import { useState } from 'react';
import { Home, FileText, Users, Settings } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { NewInvoice } from './components/NewInvoice';
import { ClientView } from './components/ClientView';
import { InvoiceDetail } from './components/InvoiceDetail';
import { InvoicesList } from './components/InvoicesList';
import { ClientsList } from './components/ClientsList';
import { ClientDetails } from './components/ClientDetails';
import { DEMO_INVOICES } from './data';
import { Invoice, ViewState } from './types';
import './index.css';

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(DEMO_INVOICES);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [activeClientName, setActiveClientName] = useState<string | null>(null);

  const handleNavigate = (view: ViewState, idOrName?: string) => {
    if (view === 'invoice_detail' || view === 'client_view' || view === 'timeline') {
      if (idOrName) setActiveInvoiceId(idOrName);
    } else if (view === 'client_details') {
      if (idOrName) setActiveClientName(idOrName);
    }
    setCurrentView(view);
  };

  const handleAddInvoice = (newInvoice: Partial<Invoice>) => {
    setInvoices([newInvoice as Invoice, ...invoices]);
  };

  const handleMarkAsPaid = (id: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'Paid' } : inv
    ));
    setCurrentView('home');
  };

  const renderView = () => {
    if (currentView === 'client_view' && activeInvoiceId) {
      const invoice = invoices.find(i => i.id === activeInvoiceId)!;
      return <ClientView invoice={invoice} onBack={() => setCurrentView('home')} onPay={handleMarkAsPaid} />;
    }

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
        <main className="pb-24 px-4 pt-6 max-w-lg mx-auto">
          {currentView === 'home' && (
            <Dashboard invoices={invoices} onNavigate={handleNavigate} />
          )}
          {currentView === 'invoices' && (
            <InvoicesList invoices={invoices} onNavigate={handleNavigate} />
          )}
          {currentView === 'new_invoice' && (
            <NewInvoice 
              onBack={() => setCurrentView('home')} 
              onSubmit={handleAddInvoice}
              onViewClient={(id) => handleNavigate('client_view', id)}
            />
          )}
          {currentView === 'invoice_detail' && activeInvoiceId && (
            <InvoiceDetail 
              invoice={invoices.find(i => i.id === activeInvoiceId)!} 
              onBack={() => setCurrentView('home')} 
              onViewClient={(id) => handleNavigate('client_view', id)}
            />
          )}
          
          {currentView === 'clients' && (
            <ClientsList invoices={invoices} onNavigate={handleNavigate} />
          )}
          {currentView === 'client_details' && activeClientName && (
            <ClientDetails 
              clientName={activeClientName} 
              invoices={invoices} 
              onBack={() => setCurrentView('clients')} 
              onNavigate={handleNavigate} 
            />
          )}
          
          {/* Placeholders for other tabs */}
          {currentView === 'settings' && (
            <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
              <p className="text-lg mb-2">Section in Development</p>
              <p className="text-sm">Building the MVP core loop first.</p>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#12121a]/90 backdrop-blur-md border-t border-[#2a2a35] pb-safe">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
            <button 
              onClick={() => handleNavigate('home')}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'home' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button 
              onClick={() => handleNavigate('invoices')}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'invoices' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] font-medium">Invoices</span>
            </button>
            <button 
              onClick={() => handleNavigate('clients')}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'clients' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-medium">Clients</span>
            </button>
            <button 
              onClick={() => handleNavigate('settings')}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'settings' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-medium">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    );
  };

  return renderView();
}
