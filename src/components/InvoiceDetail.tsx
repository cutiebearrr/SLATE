import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Mail, AlertTriangle, Settings2, PlayCircle, Copy, FileText, Image as ImageIcon, DollarSign, Edit, Send, Phone, MoreHorizontal, ExternalLink, Download, Plus, Trash2 } from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
  onViewClient: (id: string) => void;
}

export function InvoiceDetail({ invoice, onBack, onViewClient }: InvoiceDetailProps) {
  const [tone, setTone] = useState<'Friendly' | 'Professional' | 'Firm'>('Professional');
  const [activeTab, setActiveTab] = useState<'details' | 'timeline'>('details');

  const handleCopyLink = () => {
    // In a real app we'd use navigator.clipboard
    alert('Link copied to clipboard!');
  };

  const templates = {
    Day1: {
      Friendly: `Hi ${invoice.clientName.split(' ')[0]}, just a quick reminder that invoice ${invoice.id} for ${invoice.jobDescription} in the amount of $${invoice.amount} was due on ${new Date(invoice.dueDate).toLocaleDateString()}. Please let me know if you have any questions. Thanks!`,
      Professional: `Hello ${invoice.clientName}, this is a reminder that payment for invoice ${invoice.id} ($${invoice.amount}) was due on ${new Date(invoice.dueDate).toLocaleDateString()}. Please process this at your earliest convenience.`,
      Firm: `${invoice.clientName}, invoice ${invoice.id} for $${invoice.amount} is now past due. Please remit payment immediately to avoid further delays.`
    },
    Day7: {
      Friendly: `Hi ${invoice.clientName.split(' ')[0]}, I'm following up on invoice ${invoice.id}. It's now a week past due. Let me know if you need another copy of the link!`,
      Professional: `Hi ${invoice.clientName}, following up on invoice ${invoice.id} for $${invoice.amount}, now 7 days past due. Please arrange payment at your earliest convenience or contact me to discuss.`,
      Firm: `Attention: ${invoice.clientName}. Invoice ${invoice.id} is 7 days overdue. Immediate payment of $${invoice.amount} is required.`
    },
    Day14: {
      Friendly: `Hi ${invoice.clientName.split(' ')[0]}, I haven't heard back regarding invoice ${invoice.id}. Please reach out so we can get this settled. Thank you.`,
      Professional: `Hello ${invoice.clientName}, invoice ${invoice.id} is now 14 days overdue. Please prioritize this payment today to keep your account in good standing.`,
      Firm: `${invoice.clientName}, invoice ${invoice.id} for $${invoice.amount} is now 14 days overdue. This is my final notice before I pursue additional options. Please remit payment immediately.`
    }
  };

  const remainingBalance = invoice.paymentHistory 
    ? invoice.amount - invoice.paymentHistory.reduce((sum, p) => sum + p.amount, 0)
    : invoice.amount;

  const handleEmailReminder = () => {
    if (!invoice.clientEmail) {
      alert('No client email address found. Please add an email to this client first.');
      return;
    }
    const subject = encodeURIComponent(`Invoice ${invoice.id} - ${invoice.jobDescription}`);
    const body = encodeURIComponent(`Hello ${invoice.clientName.split(' ')[0]},\n\nThis is a friendly reminder that payment for invoice ${invoice.id} in the amount of $${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} was due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nYou can view and pay your invoice securely using this link: ${invoice.paymentLink || `slate.pay/${invoice.id.toLowerCase()}`}\n\nPlease let me know if you have any questions.\n\nThank you.`);
    window.location.href = `mailto:${invoice.clientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col animate-in slide-in-from-right-4 duration-300 pb-10">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{invoice.id}</h2>
            <p className="text-xs text-gray-500">Sent {new Date(invoice.sentDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-[#12121a] border border-[#2a2a35] text-gray-400 rounded-lg hover:text-white transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 bg-[#12121a] border border-[#2a2a35] text-gray-400 rounded-lg hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Status Card */}
      <div className="bg-gradient-to-b from-[#1a1a24] to-[#12121a] border border-[#2a2a35] rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{invoice.clientName}</h3>
            <p className="text-gray-400 text-sm">{invoice.jobDescription}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
            invoice.status === 'Overdue' ? 'bg-red-400/10 text-red-400 border border-red-400/20' : 
            invoice.status === 'Paid' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
            'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
          }`}>
            {invoice.status}
          </span>
        </div>

        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Balance Due</p>
            <p className="text-4xl font-bold text-white tracking-tight">
              ${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Total</p>
            <p className="text-lg font-semibold text-gray-300">
              ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Payment Link Box */}
        <div className="bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-purple-500/50 transition-colors" onClick={handleCopyLink}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-purple-500/20 text-purple-400 p-1.5 rounded-lg">
              <ExternalLink className="w-4 h-4" />
            </div>
            <span className="text-gray-300 font-mono text-sm truncate">{invoice.paymentLink || `slate.pay/${invoice.id.toLowerCase()}`}</span>
          </div>
          <button className="text-gray-500 group-hover:text-white transition-colors p-1">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onViewClient(invoice.id)}
            className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            Preview Share Page
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all active:scale-95">
            <Send className="w-4 h-4" />
            Resend SMS
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3 mb-8">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-center group">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Edit className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-300 font-medium">Edit</span>
          </button>
          <button onClick={handleEmailReminder} className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-center group">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-300 font-medium">Email Reminder</span>
          </button>
          <button className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] hover:border-red-500/30 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-center group">
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-xs text-red-400 font-medium group-hover:text-red-300">Delete</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#2a2a35] mb-6 px-2">
        <button 
          onClick={() => setActiveTab('details')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'details' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Details & Files
          {activeTab === 'details' && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-purple-500 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'timeline' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Escalation Engine
          <div className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
            <PlayCircle className="w-3 h-3" /> On
          </div>
          {activeTab === 'timeline' && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-purple-500 rounded-t-full"></div>}
        </button>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* Contact Info */}
          {(invoice.clientEmail || invoice.clientPhone) && (
            <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4">
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Client Contact</h4>
              <div className="flex flex-col gap-3">
                {invoice.clientEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300 text-sm">{invoice.clientEmail}</span>
                  </div>
                )}
                {invoice.clientPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300 text-sm">{invoice.clientPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Internal Notes</h4>
                <Edit className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-white" />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* Attachments & Photos */}
          {(invoice.files?.length || invoice.photos?.length) && (
            <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4">
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Files & Evidence</h4>
              
              {invoice.photos && invoice.photos.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-gray-500 mb-2 block">Completed Work Photos</span>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {invoice.photos.map((photo, idx) => (
                      <div key={idx} className="relative min-w-[120px] h-[90px] rounded-lg overflow-hidden border border-[#2a2a35] group cursor-pointer">
                        <img src={photo} alt="Work evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ))}
                    <button className="min-w-[120px] h-[90px] rounded-lg border border-dashed border-[#2a2a35] flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-colors">
                      <Plus className="w-5 h-5 mb-1" />
                      <span className="text-xs">Add Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {invoice.files && invoice.files.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 mb-2 block">Documents</span>
                  <div className="flex flex-col gap-2">
                    {invoice.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-[#0a0a0f] border border-[#2a2a35] rounded-lg hover:border-purple-500/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-800/50 rounded text-gray-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} • {file.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment History */}
          <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Payment History</h4>
                <button className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Record Manual Payment
                </button>
              </div>
            {invoice.paymentHistory && invoice.paymentHistory.length > 0 ? (
              <div className="flex flex-col gap-3">
                {invoice.paymentHistory.map(payment => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-[#0a0a0f] rounded-lg border border-[#2a2a35]">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Payment via {payment.method}</p>
                        <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">+${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-gray-500 bg-[#0a0a0f] rounded-lg border border-[#2a2a35] border-dashed">
                <DollarSign className="w-6 h-6 mb-2 opacity-50" />
                <p className="text-sm">No payments recorded yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6 px-1 mt-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-gray-400" /> Auto-Pilot Tone
            </h3>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="bg-[#12121a] border border-[#2a2a35] text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500"
            >
              <option value="Friendly">Friendly</option>
              <option value="Professional">Professional</option>
              <option value="Firm">Firm</option>
            </select>
          </div>

          <div className="relative pl-6 border-l-2 border-[#2a2a35] ml-4 flex flex-col gap-8">
            {/* Day 0 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-1 bg-[#0a0a0f] p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-white font-bold mb-1">Day 0: Invoice Sent</h4>
              <p className="text-xs text-gray-500 mb-3">Delivered on {new Date(invoice.sentDate).toLocaleDateString()}</p>
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 flex items-center justify-between opacity-70">
                <span className="text-sm text-gray-400">Initial invoice delivery via SMS & Email.</span>
              </div>
            </div>

            {/* Day 1 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-1 bg-[#0a0a0f] p-1 rounded-full">
                <Clock className={`w-5 h-5 ${invoice.status === 'Overdue' ? 'text-emerald-500' : 'text-purple-500'}`} />
              </div>
              <h4 className="text-white font-bold mb-1">Day 1: First Reminder</h4>
              <p className="text-xs text-gray-500 mb-3">Triggers 24 hours after due date</p>
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-gray-400">
                  <Mail className="w-3.5 h-3.5" /> SMS & Email Template
                </div>
                <textarea 
                  className="w-full bg-transparent text-sm text-gray-300 resize-none focus:outline-none focus:text-white transition-colors"
                  rows={4}
                  value={templates.Day1[tone]}
                  readOnly
                />
              </div>
            </div>

            {/* Day 7 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-1 bg-[#0a0a0f] p-1 rounded-full">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <h4 className="text-white font-bold mb-1">Day 7: Second Reminder</h4>
              <p className="text-xs text-gray-500 mb-3">Escalated visibility</p>
              <div className="bg-[#12121a] border border-yellow-500/20 rounded-xl p-4 shadow-[0_0_15px_rgba(234,179,8,0.05)]">
                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-yellow-500/80">
                  <Mail className="w-3.5 h-3.5" /> SMS & Email Template
                </div>
                <textarea 
                  className="w-full bg-transparent text-sm text-gray-300 resize-none focus:outline-none focus:text-white transition-colors"
                  rows={4}
                  value={templates.Day7[tone]}
                  readOnly
                />
              </div>
            </div>

            {/* Day 14 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-1 bg-[#0a0a0f] p-1 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h4 className="text-white font-bold mb-1">Day 14: Final Notice</h4>
              <p className="text-xs text-gray-500 mb-3">Pre-collections warning</p>
              <div className="bg-[#12121a] border border-red-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-red-400">
                  <Mail className="w-3.5 h-3.5" /> SMS & Email Template
                </div>
                <textarea 
                  className="w-full bg-transparent text-sm text-gray-300 resize-none focus:outline-none focus:text-white transition-colors"
                  rows={4}
                  value={templates.Day14[tone]}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
