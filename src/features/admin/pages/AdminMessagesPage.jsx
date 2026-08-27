/**
 * AdminMessagesPage — vue admin
 *
 * Flow : L'admin lit les messages reçus des clients.
 * Il répond via moyens externes (téléphone, WhatsApp, email).
 * Pas de réponse inline depuis la plateforme.
 * Les notifications automatiques (réservation, soumission) sont envoyées par email.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { adminAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import {
  Search, Mail, Trash2, RefreshCw, MessageSquare, Clock,
  Inbox, Phone, ExternalLink, CheckCircle, X, Eye,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useMessage } from '../../../contexts/MessageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { toWhatsAppNumber } from '../../../lib/phone';
import toast from 'react-hot-toast';

const LIMIT = 20;

const fmt     = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
const fmtShort= (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '—';
const initials= (n) => {
  const p = String(n || 'U').trim().split(/\s+/).filter(Boolean);
  return !p.length ? 'U' : p.length === 1 ? p[0][0].toUpperCase() : `${p[0][0]}${p[1][0]}`.toUpperCase();
};

/* strip mongo IDs */
const clean = (t) => String(t || '').replace(/\b([0-9a-f]{24})\b/gi, (m) => `[réf. ${m.slice(-6).toUpperCase()}]`);

/* ── message detail panel ── */
const MessageDetail = ({ msg, onClose, onMarkRead, onDelete }) => {
  const sender = msg.expediteur || {};
  const name   = sender.nom || sender.name || (sender.email || '').split('@')[0] || 'Client';
  const phone  = sender.telephone;
  const email  = sender.email;

  const waText = encodeURIComponent(
    `Bonjour ${name}, nous avons bien reçu votre message concernant "${msg.sujet || 'votre demande'}". ` +
    `Voici notre réponse :`
  );
  const waPhone = toWhatsAppNumber(phone);

  useEffect(() => { if (!msg.lu) onMarkRead(msg._id); }, [msg._id, msg.lu]); // eslint-disable-line

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/60 backdrop-blur-sm" />
      <div
        className="w-full max-w-lg bg-[#111] border-l border-white/10 flex flex-col h-full overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary font-black text-base shrink-0">
              {initials(name)}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-white truncate">{name}</h2>
              <p className="text-[10px] text-zinc-500">{fmt(msg.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => { onDelete(msg._id); onClose(); }}
              className="h-8 w-8 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 flex items-center justify-center transition-all">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button onClick={onClose}
              className="h-8 w-8 rounded-xl border border-white/5 bg-zinc-900 text-zinc-500 hover:text-white flex items-center justify-center transition-all">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* subject + content */}
          <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl p-5">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Objet</p>
            <h3 className="text-base font-black text-white italic mb-4">"{msg.sujet || 'Sans sujet'}"</h3>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{clean(msg.contenu)}</p>
          </div>

          {/* contact info */}
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Coordonnées du client</p>
            <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl divide-y divide-white/[0.05]">
              {[
                { icon: '👤', label: 'Nom', value: name },
                { icon: '✉️', label: 'Email', value: email },
                { icon: '📞', label: 'Téléphone', value: phone },
              ].filter(r => r.value).map(r => (
                <div key={r.label} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="text-base shrink-0">{r.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{r.label}</p>
                    <p className="text-sm font-bold text-white truncate">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* external reply actions */}
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Répondre via</p>
            <div className="space-y-2.5">
              {email && (
                <a href={`mailto:${email}?subject=Réponse: ${encodeURIComponent(msg.sujet || 'Votre demande')}&body=Bonjour ${name},%0D%0A%0D%0A`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 rounded-2xl transition-all group">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white">Email</p>
                    <p className="text-[10px] text-blue-400 truncate">{email}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                </a>
              )}
              {phone && waPhone && (
                <a href={`https://wa.me/${waPhone.startsWith('+') ? waPhone.slice(1) : waPhone}?text=${waText}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 rounded-2xl transition-all group">
                  <span className="text-base shrink-0">💬</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white">WhatsApp</p>
                    <p className="text-[10px] text-emerald-400 truncate">{phone}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`}
                  className="flex items-center gap-3 px-5 py-3.5 bg-zinc-900/60 border border-white/[0.07] hover:bg-zinc-900/80 rounded-2xl transition-all group">
                  <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white">Appel téléphonique</p>
                    <p className="text-[10px] text-zinc-500 truncate">{phone}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* info note */}
          <div className="flex items-start gap-3 p-4 bg-zinc-950/50 border border-white/[0.05] rounded-2xl">
            <span className="text-base shrink-0">💡</span>
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              Les réponses se font via les canaux externes. Les notifications automatiques (confirmation de réservation, approbation de soumission) sont envoyées directement par email au client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main page ── */
const AdminMessagesPage = () => {
  const { user } = useAuth();
  const { fetchUnreadCount, unreadCount } = useMessage();

  const [loading,    setLoading]    = useState(true);
  const [messages,   setMessages]   = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [dSearch,    setDSearch]    = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [selected,   setSelected]   = useState(null);

  const loadIdRef  = useRef(0);
  const mountedRef = useRef(false);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!mountedRef.current) return;
    load(1, filter, dSearch);
    fetchUnreadCount();
  }, [dSearch, filter]); // eslint-disable-line

  useEffect(() => {
    mountedRef.current = true;
    load(1, 'all', '');
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => { mountedRef.current = false; clearInterval(interval); };
  }, [fetchUnreadCount]);

  const load = useCallback(async (page = 1, f = filter, q = dSearch) => {
    const callId = ++loadIdRef.current;
    try {
      setLoading(true);
      setMessages([]);
      const res = await adminAPI.getMessages({
        page, limit: LIMIT,
        ...(f !== 'all' ? { status: f } : {}),
        ...(q ? { search: q } : {}),
      });
      if (callId !== loadIdRef.current) return;
      const d = res.data?.data || res.data;
      setMessages(Array.isArray(d?.items) ? d.items : Array.isArray(d) ? d : []);
      setPagination({ page: d?.page || 1, totalPages: d?.totalPages || 1, totalItems: d?.total || 0 });
    } catch {
      if (callId !== loadIdRef.current) return;
      toast.error('Erreur chargement messages');
    } finally {
      if (callId === loadIdRef.current) setLoading(false);
    }
  }, [filter, dSearch]);

  useEffect(() => { mountedRef.current = true; load(1, 'all', ''); }, []); // eslint-disable-line

  const handleMarkRead = useCallback(async (id) => {
    try {
      await adminAPI.updateMessageStatus(id, true);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, lu: true } : m));
      fetchUnreadCount();
    } catch { /* silent */ }
  }, [fetchUnreadCount]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Supprimer ce message définitivement ?')) return;
    try {
      await adminAPI.deleteMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      fetchUnreadCount();
      toast.success('Message supprimé');
    } catch { toast.error('Erreur suppression'); }
  }, [fetchUnreadCount]);

  const localUnread = messages.filter(m => !m.lu).length;

  const tabs = [
    { id: 'all',    label: 'Tous',     badge: 0 },
    { id: 'unread', label: 'Non lus',  badge: unreadCount },
    { id: 'read',   label: 'Lus',      badge: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white overflow-hidden">

      {/* header */}
      <div className="shrink-0 px-6 lg:px-10 pt-8 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/5">
        <div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
            Administration / <span className="text-zinc-300">Messages</span>
          </p>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">
            Messagerie<span className="text-gold-primary">.</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Demandes et informations reçues des clients. Répondez via email, WhatsApp ou téléphone.
          </p>
        </div>
        <button onClick={() => load(pagination.page, filter, dSearch)}
          className="h-10 w-10 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all shrink-0">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* filter tabs */}
        <div className="shrink-0 flex border-b border-white/5 bg-zinc-900/30">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { if (filter === t.id) return; setFilter(t.id); load(1, t.id, dSearch); }}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-2 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2',
                filter === t.id
                  ? 'border-gold-primary text-gold-primary bg-gold-primary/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]',
              )}>
              {t.label}
              {t.badge > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-md bg-gold-primary text-black text-[8px] font-black flex items-center justify-center">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* search */}
        <div className="shrink-0 px-4 py-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Chercher un client, un sujet..."
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/60 border border-white/5 rounded-xl text-xs font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all" />
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-16 opacity-50">
              <LoadingSpinner size="sm" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="h-16 w-16 rounded-3xl bg-zinc-900/60 border border-white/5 flex items-center justify-center mb-4">
                <Inbox className="h-8 w-8 text-zinc-700" />
              </div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Aucun message</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
               {messages.map(m => {
                 const senderName = m.expediteur?.nom || m.expediteur?.name || (m.expediteur?.email || '').split('@')[0] || 'Anonyme';
                 const isActive   = selected?._id === m._id;
                 const isSent = String(m.expediteur?._id || m.expediteur?.id || '') === String(user?._id || user?.id || '');
                 return (
                   <div key={m._id} onClick={() => setSelected(m)}
                     className={cn(
                       'relative flex items-start gap-4 px-5 py-4 cursor-pointer transition-all group',
                       isActive ? 'bg-gold-primary/[0.06] border-l-2 border-gold-primary' : 'hover:bg-zinc-900/60',
                       !m.lu && !isActive && 'bg-gold-primary/[0.025]',
                     )}>
                     {/* unread dot */}
                     {!m.lu && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gold-primary rounded-r-full" />}

                     {/* avatar */}
                     <div className={cn(
                       'h-10 w-10 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 border',
                       isActive ? 'bg-gold-primary text-black border-gold-primary' : 'bg-zinc-800 text-zinc-400 border-white/5'
                     )}>
                       {initials(senderName)}
                     </div>

                     {/* content */}
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between gap-2 mb-0.5">
                         <p className={cn('text-sm font-black truncate', !m.lu ? 'text-white' : 'text-zinc-400')}>
                           {senderName}
                           {isSent && <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 border border-white/10 rounded-md px-1.5 py-0.5">Envoyé</span>}
                         </p>
                        <span className="text-[9px] text-zinc-600 shrink-0">{fmtShort(m.createdAt)}</span>
                      </div>
                      <p className={cn('text-xs font-bold truncate mb-0.5', !m.lu ? 'text-zinc-200' : 'text-zinc-500')}>
                        {m.sujet || 'Sans sujet'}
                      </p>
                      <p className="text-[10px] text-zinc-600 truncate">{clean(m.contenu)}</p>
                    </div>

                    {/* actions */}
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button onClick={e => { e.stopPropagation(); setSelected(m); }}
                        className="h-7 w-7 rounded-lg bg-zinc-800 hover:bg-white/10 text-zinc-500 hover:text-white flex items-center justify-center transition-all" title="Voir">
                        <Eye className="h-3 w-3" />
                      </button>
                      {!m.lu && (
                        <button onClick={e => { e.stopPropagation(); handleMarkRead(m._id); }}
                          className="h-7 w-7 rounded-lg bg-gold-primary/10 hover:bg-gold-primary/20 text-gold-primary flex items-center justify-center transition-all" title="Marquer comme lu">
                          <CheckCircle className="h-3 w-3" />
                        </button>
                      )}
                      <button onClick={e => { e.stopPropagation(); handleDelete(m._id); }}
                        className="h-7 w-7 rounded-lg bg-red-500/5 hover:bg-red-500/15 text-red-500/60 hover:text-red-400 flex items-center justify-center transition-all" title="Supprimer">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-white/5 bg-zinc-900/30">
            <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1, filter, dSearch)}
              className="h-8 px-3 rounded-lg border border-white/5 text-[9px] font-black text-zinc-500 hover:text-white disabled:opacity-30 uppercase tracking-widest transition-all">
              Préc.
            </button>
            <span className="text-[9px] font-black text-zinc-600 uppercase">{pagination.page} / {pagination.totalPages}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1, filter, dSearch)}
              className="h-8 px-3 rounded-lg border border-white/5 text-[9px] font-black text-zinc-500 hover:text-white disabled:opacity-30 uppercase tracking-widest transition-all">
              Suiv.
            </button>
          </div>
        )}
      </div>

      {/* detail drawer */}
      {selected && (
        <MessageDetail
          msg={selected}
          onClose={() => setSelected(null)}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminMessagesPage;
