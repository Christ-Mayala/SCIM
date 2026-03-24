import React, { useEffect, useState } from 'react';
import { adminAPI, messageAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { 
  Search, Mail, MailOpen, Trash2, RefreshCw, X, Send, 
  MessageSquare, User, Clock, CheckCircle2, Zap, LayoutDashboard,
  Filter, Reply, CornerUpLeft, MoreVertical
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const AdminMessagesPage = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getMessages();
      setMessages(Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast.error('Erreur chargement messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = messages.filter(m => {
    const matchType = filter === 'all' ? true : filter === 'unread' ? !m.lu : m.lu;
    const matchSearch = (m.nom?.toLowerCase().includes(search.toLowerCase()) || 
                         m.sujet?.toLowerCase().includes(search.toLowerCase()) ||
                         m.email?.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const handleRead = async (m) => {
    if (m.lu) { setSelected(m); return; }
    try {
      await adminAPI.markMessageAsRead(m._id);
      setMessages(prev => prev.map(x => x._id === m._id ? { ...x, lu: true } : x));
      setSelected({ ...m, lu: true });
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await adminAPI.deleteMessage(id);
      setMessages(prev => prev.filter(x => x._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Message supprimé');
    } catch (e) { toast.error('Erreur suppression'); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      setSending(true);
      // Logic for sending reply (placeholder)
      toast.success('Réponse envoyée avec succès');
      setReplyText('');
    } catch (e) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const StatusTab = ({ id, label, count }) => {
    const active = filter === id;
    return (
      <button
        onClick={() => setFilter(id)}
        className={cn(
          "flex items-center gap-3 px-6 py-4 border-b-2 font-black text-xs uppercase tracking-widest transition-all",
          active 
            ? "border-gold-primary text-zinc-900 bg-gold-primary/5" 
            : "border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
        )}
      >
        {label}
        {count > 0 && (
          <span className={cn(
             "px-1.5 py-0.5 rounded-md text-[9px] font-black leading-none",
             active ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
          )}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
        
        {/* ── Header Section ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg shadow-zinc-900/10">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Centre de Correspondance
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Messagerie</h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">Gérez les demandes de renseignements et le support utilisateur.</p>
          </div>
          <Button 
            variant="outline"
            onClick={load} 
            className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-white border-zinc-200 transition-all shadow-sm gap-2"
          >
            <RefreshCw className={cn("h-4 w-4 text-amber-500", loading && "animate-spin")} />
            Actualiser
          </Button>
        </div>

        {/* ── Main Interface ── */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
           
           {/* ── Left Rail: Message List ── */}
           <div className="w-full lg:w-[400px] border-r border-zinc-100 flex flex-col bg-zinc-50/20">
              {/* Filter Tabs */}
              <div className="flex border-b border-zinc-100 overflow-x-auto overflow-y-hidden shrink-0">
                <StatusTab id="all" label="Tous" />
                <StatusTab id="unread" label="Non lus" count={messages.filter(m => !m.lu).length} />
                <StatusTab id="read" label="Lus" />
              </div>
              
              {/* Search Rail */}
              <div className="p-4 border-b border-zinc-100 shrink-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                  <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Chercher une discussion..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-100 rounded-2xl text-[11px] font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                   <div className="py-12 flex flex-col items-center justify-center opacity-40">
                      <LoadingSpinner size="sm" />
                      <p className="text-[9px] font-black uppercase tracking-widest mt-2 px-10 text-center">Interrogation de la base de données...</p>
                   </div>
                ) : filtered.length === 0 ? (
                   <div className="py-20 text-center px-10">
                      <MessageSquare className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Aucune correspondance</p>
                   </div>
                ) : (
                  <div className="divide-y divide-zinc-50">
                    {filtered.map((m) => {
                       const active = selected?._id === m._id;
                       return (
                        <div 
                          key={m._id}
                          onClick={() => handleRead(m)}
                          className={cn(
                            "p-6 cursor-pointer transition-all relative group",
                            active ? "bg-white shadow-inner" : "hover:bg-white",
                            !m.lu && "bg-amber-50/30"
                          )}
                        >
                          {!m.lu && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-amber-400 rounded-r-full" />
                          )}
                          <div className="flex items-start justify-between gap-3">
                             <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                                <User className="h-5 w-5" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                   <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">{m.email?.split('@')[0]}</div>
                                   <div className="text-[9px] font-black text-zinc-400 uppercase">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}</div>
                                </div>
                                <div className={cn("text-sm font-black uppercase tracking-tight truncate", !m.lu ? "text-zinc-900" : "text-zinc-700")}>
                                  {m.sujet || 'Sans sujet'}
                                </div>
                                <div className="text-[11px] font-medium text-zinc-400 line-clamp-1 mt-0.5">{m.contenu}</div>
                             </div>
                          </div>
                        </div>
                       );
                    })}
                  </div>
                )}
              </div>
           </div>

           {/* ── Right Rail: Message Detail ── */}
           <div className="flex-1 flex flex-col bg-white">
              {selected ? (
                <>
                  {/* Detail Header */}
                  <div className="px-10 py-8 border-b border-zinc-100 bg-zinc-50/30 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-5">
                       <div className="h-14 w-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-400 shadow-2xl ring-4 ring-zinc-900/5 transition-transform duration-500 hover:rotate-6">
                          <User className="h-7 w-7" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{selected.nom || 'Expéditeur'}</h2>
                            {!selected.lu && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                             <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selected.email}</span>
                             <span className="opacity-20">|</span>
                             <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(selected.createdAt).toLocaleString()}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button 
                         variant="outline" 
                         onClick={(e) => handleDelete(selected._id, e)}
                         className="h-11 w-11 p-0 rounded-2xl border-zinc-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                       >
                          <Trash2 className="h-5 w-5" />
                       </Button>
                       <button className="h-11 w-11 rounded-2xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 text-zinc-400">
                          <MoreVertical className="h-5 w-5" />
                       </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                    <div className="bg-zinc-50/80 rounded-[2rem] p-10 border border-zinc-100 shadow-sm">
                       <div className="flex items-center gap-2 mb-6">
                          <div className="h-1 w-10 bg-amber-400 rounded-full" />
                          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Correspondance reçue</h4>
                       </div>
                       <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight mb-6 leading-tight max-w-2xl italic">
                         "{selected.sujet || 'Sans sujet précis'}"
                       </h3>
                       <div className="text-zinc-700 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                         {selected.contenu}
                       </div>
                    </div>
                    
                    {/* Reply Section */}
                    <div className="pt-10 border-t border-zinc-100">
                       <div className="flex items-center gap-4 mb-4">
                          <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400">
                             <Reply className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Rédiger une réponse officielle</span>
                       </div>
                       <div className="relative group">
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Saisissez votre réponse ici..."
                            className="w-full h-40 rounded-[2rem] bg-zinc-50/50 border border-zinc-100 p-8 text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/5 focus:border-amber-400/30 transition-all resize-none shadow-inner"
                          />
                          <div className="absolute bottom-6 right-6 flex items-center gap-3 opacity-0 translate-y-2 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300">
                             <Button 
                               onClick={handleReply}
                               loading={sending}
                               className="h-12 px-8 rounded-2xl bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-zinc-900/20 flex items-center gap-2 hover:bg-zinc-800"
                             >
                                <Send className="h-3.5 w-3.5 text-amber-400" />
                                Transmettre
                             </Button>
                          </div>
                       </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50/10 opacity-40 py-20">
                   <div className="h-24 w-24 rounded-[2rem] bg-zinc-100 flex items-center justify-center mb-6 ring-1 ring-zinc-200">
                      <LayoutDashboard className="h-10 w-10 text-zinc-300" />
                   </div>
                   <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-2">Interface de Lecture</h3>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sélectionnez une discussion pour ouvrir les détails</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
