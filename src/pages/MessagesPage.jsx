/**
 * MessagesPage — côté client
 *
 * Flow : Le client envoie des demandes d'information / support à l'admin.
 * L'admin lit et répond via moyens externes (téléphone, WhatsApp, email).
 * Le client reçoit ici les notifications automatiques du système
 * (réservation confirmée/annulée, soumission approuvée/rejetée).
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, Send, Sparkles, CheckCircle, Clock,
  Bell, ChevronRight, Mail, Phone, Building2, FileText,
  Info, RefreshCw, X,
} from 'lucide-react';
import { useMessage } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

/* ── helpers ──
 * Granularité minute -> heure -> jour -> date, pour que l'affichage évolue
 * réellement avec le temps au lieu de rester bloqué sur "À l'instant". */
const fmt = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'À l\'instant';
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffJ = Math.floor(diffH / 24);
  if (diffJ < 7) return `Il y a ${diffJ}j`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

/* strip mongo IDs from system messages */
const cleanText = (t) => {
  if (!t) return '';
  return t.replace(/\b([0-9a-f]{24})\b/gi, (m) => `[réf. ${m.slice(-6).toUpperCase()}]`);
};

/* detect if a message is a system notification */
const isSystemMsg = (msg) => {
  const s = (msg?.sujet || '').toLowerCase();
  return (
    s.includes('confirmée') || s.includes('confirmee') ||
    s.includes('annulée') || s.includes('annulee') ||
    s.includes('approuvé') || s.includes('approuve') ||
    s.includes('rejeté') || s.includes('rejete') ||
    s.includes('enregistrée') || s.includes('visite') ||
    s.includes('réservation') || s.includes('reservation') ||
    s.includes('soumission') || s.includes('bien')
  );
};

const SUBJECTS = [
  { value: 'info_bien',       label: 'Demande d\'information sur un bien' },
  { value: 'visite',          label: 'Planifier / modifier une visite'    },
  { value: 'soumission',      label: 'Question sur ma soumission'         },
  { value: 'reservation',     label: 'Question sur ma réservation'        },
  { value: 'support',         label: 'Support technique'                  },
  { value: 'autre',           label: 'Autre demande'                      },
];

const MessagesPage = () => {
  const { user } = useAuth();
  const {
    messages, conversations, inboxLoading, isContactSending,
    fetchInbox, fetchMessagesWithUser, contactScim, markMessageAsRead,
  } = useMessage();

  /* ── form state ── */
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);

  /* ── notifications : messages reçus DE l'admin (system messages) ── */
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [openNotification, setOpenNotification] = useState(null);
  const [notifPage, setNotifPage] = useState(1);
  const NOTIFS_PER_PAGE = 3;

  const handleOpenNotification = (msg) => {
    setOpenNotification(msg);
    if (!msg.lu) {
      markMessageAsRead(msg._id);
      setNotifications((prev) => prev.map((n) => (n._id === msg._id ? { ...n, lu: true } : n)));
    }
  };

  /* ── load inbox on mount to get notifications ── */
  useEffect(() => { fetchInbox(1); }, [fetchInbox]);

  /* ── extract system notifications from conversations ── */
  const adminConv = conversations.find(
    c => (c?.otherUser?.role === 'admin') || (c?.otherUser?.nom || '').toLowerCase().includes('admin')
  );
  const adminConvId = adminConv?.otherUser?._id || adminConv?.otherUser?.id || '';
  const adminConvLastMessageId = adminConv?.lastMessage?._id || '';

  useEffect(() => {
    if (!adminConvId) {
      setNotifications([]);
      return;
    }
    setNotifLoading(true);
    // silent:true + noMarkRead:true : ne pas marquer comme lu automatiquement à l'ouverture
    fetchMessagesWithUser(adminConvId, 1, { limit: 50, silent: true, noMarkRead: true })
      .finally(() => setNotifLoading(false));
  }, [adminConvId, adminConvLastMessageId]); // eslint-disable-line

  useEffect(() => {
    const systemMessages = messages.filter(msg => {
      const fromAdmin = msg?.expediteur?.role === 'admin' ||
        (msg?.expediteur?._id && msg?.expediteur?._id !== (user?._id || user?.id));
      return fromAdmin && isSystemMsg(msg);
    });
    const sorted = systemMessages.slice().reverse();
    setNotifications(sorted);
    setNotifPage(1);
  }, [messages, user]);

  /* ── send ── */
  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    if (!subject || !content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    const subjectLabel = SUBJECTS.find(s => s.value === subject)?.label || subject;
    const res = await contactScim(subjectLabel, content.trim());
    if (res.success) {
      setSent(true);
      setSubject('');
      setContent('');
      setTimeout(() => setSent(false), 4000);
    }
  }, [subject, content, contactScim]);

  const notifIcon = (msg) => {
    const s = (msg?.sujet || '').toLowerCase();
    if (s.includes('confirmée') || s.includes('confirmee') || s.includes('approuvé')) return '✅';
    if (s.includes('annulée') || s.includes('annulee') || s.includes('rejeté')) return '❌';
    if (s.includes('soumission') || s.includes('bien')) return '🏠';
    if (s.includes('visite') || s.includes('réservation')) return '📅';
    return '📬';
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {/* ── Page header ── */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gold-primary mb-4">
            <Sparkles className="w-3 h-3" /> Centre de contact
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic">
            Messages<span className="text-gold-primary">.</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Envoyez vos demandes à l'équipe SCIM. Nous répondons dans les plus brefs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT : form + contact info ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Contact form */}
            <div className="bg-zinc-900/50 border border-white/[0.07] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
                  <Send className="h-4 w-4 text-gold-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Nouvelle demande</h2>
                  <p className="text-[10px] text-zinc-500">Votre message sera traité dans les meilleurs délais</p>
                </div>
              </div>

              {sent && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-5 animate-in fade-in duration-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-emerald-300">Message envoyé !</p>
                    <p className="text-xs text-emerald-400/70">Notre équipe vous recontactera par email ou téléphone.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSend} className="space-y-4">
                {/* Subject select */}
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                    Type de demande *
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                    className="w-full bg-zinc-950/60 border border-white/8 rounded-2xl px-4 py-3.5 text-sm text-white appearance-none outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
                  >
                    <option value="" className="bg-zinc-900">Sélectionner un type…</option>
                    {SUBJECTS.map(s => (
                      <option key={s.value} value={s.value} className="bg-zinc-900">{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                    Votre message *
                  </label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Décrivez votre demande en détail : référence du bien, date souhaitée, questions spécifiques..."
                    rows={6}
                    required
                    className="w-full bg-zinc-950/60 border border-white/8 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-gold-primary/30 resize-none transition-all"
                  />
                  <p className="text-[10px] text-zinc-600 mt-1.5">{content.length} / 2000 caractères</p>
                </div>

                <button
                  type="submit"
                  disabled={isContactSending || !subject || !content.trim()}
                  className="w-full h-13 flex items-center justify-center gap-2.5 bg-gold-primary hover:bg-amber-300 text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-gold-primary/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isContactSending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer à l'équipe SCIM
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="bg-zinc-900/40 border border-white/[0.07] rounded-3xl p-6">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">
                Autres moyens de contact
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Phone, label: 'Téléphone', value: '+242 06 57 45 422', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { icon: Mail,  label: 'Email',     value: 'contact@scim.com',  color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-4 p-4 bg-zinc-950/40 border border-white/[0.06] rounded-2xl">
                    <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', c.bg)}>
                      <c.icon className={cn('h-4 w-4', c.color)} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{c.label}</p>
                      <p className="text-sm font-bold text-white">{c.value}</p>
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-zinc-600 leading-relaxed pt-1">
                  Notre équipe est disponible du lundi au vendredi, de 8h à 17h (heure de Brazzaville).
                  Nous répondons à toutes les demandes sous 24h ouvrées.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT : notifications ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* quick links */}
            <div className="bg-zinc-900/40 border border-white/[0.07] rounded-3xl p-5">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Accès rapide</h3>
              <div className="space-y-2">
                {[
                  { to: '/dashboard',     icon: Building2,  label: 'Mes réservations', color: 'text-gold-primary',  bg: 'bg-gold-primary/10'  },
                  { to: '/soumettre-bien', icon: FileText,   label: 'Soumettre un bien', color: 'text-blue-400',    bg: 'bg-blue-500/10'      },
                  { to: '/properties',    icon: Building2,  label: 'Voir les biens',    color: 'text-emerald-400', bg: 'bg-emerald-500/10'   },
                ].map(l => (
                  <Link key={l.to} to={l.to}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-950/50 transition-all group">
                    <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center shrink-0', l.bg)}>
                      <l.icon className={cn('h-4 w-4', l.color)} />
                    </div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors flex-1">{l.label}</span>
                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* system notifications */}
            <div className="bg-zinc-900/40 border border-white/[0.07] rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gold-primary" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Notifications</h3>
                </div>
                <button onClick={() => fetchInbox(1)}
                  className="h-7 w-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                  <RefreshCw className="h-3 w-3" />
                </button>
              </div>

              {notifLoading || inboxLoading ? (
                <div className="flex justify-center py-8"><LoadingSpinner size="sm" /></div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs text-zinc-600 font-bold">Aucune notification</p>
                  <p className="text-[10px] text-zinc-700 mt-1">Vous serez notifié ici des mises à jour importantes</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5">
                    {notifications
                      .slice((notifPage - 1) * NOTIFS_PER_PAGE, notifPage * NOTIFS_PER_PAGE)
                      .map(msg => (
                      <button key={msg._id}
                        type="button"
                        onClick={() => handleOpenNotification(msg)}
                        className={cn(
                          'w-full text-left flex items-start gap-3 p-3.5 rounded-2xl border transition-all hover:border-gold-primary/30 cursor-pointer',
                          !msg.lu
                            ? 'bg-gold-primary/[0.05] border-gold-primary/20'
                            : 'bg-zinc-950/40 border-white/[0.05]'
                        )}>
                        <span className="text-lg shrink-0 mt-0.5">{notifIcon(msg)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-black truncate', !msg.lu ? 'text-white' : 'text-zinc-300')}>
                            {msg.sujet || 'Notification'}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">
                            {cleanText(msg.contenu)}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="h-3 w-3 text-zinc-600" />
                            <p className="text-[9px] text-zinc-600 font-bold">{fmt(msg.createdAt)}</p>
                            {!msg.lu && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-primary" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {notifications.length > NOTIFS_PER_PAGE && (
                    <div className="flex items-center justify-between pt-3">
                      <button
                        disabled={notifPage <= 1}
                        onClick={() => setNotifPage((p) => Math.max(1, p - 1))}
                        className="h-8 px-3 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:border-gold-primary/30 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Précédent
                      </button>
                      <span className="text-[10px] text-zinc-500 font-bold">
                        Page {notifPage} / {Math.max(1, Math.ceil(notifications.length / NOTIFS_PER_PAGE))}
                      </span>
                      <button
                        disabled={notifPage >= Math.ceil(notifications.length / NOTIFS_PER_PAGE)}
                        onClick={() => setNotifPage((p) => Math.min(Math.ceil(notifications.length / NOTIFS_PER_PAGE), p + 1))}
                        className="h-8 px-3 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:border-gold-primary/30 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* info banner */}
            <div className="flex items-start gap-3 p-4 bg-zinc-900/40 border border-white/[0.06] rounded-2xl">
              <Info className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                L'équipe SCIM vous recontacte par <strong className="text-zinc-400">email ou téléphone</strong> suite à votre message.
                Vous recevez automatiquement des notifications par email pour les confirmations de visite et l'approbation de vos biens.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lecture complète d'une notification ── */}
      {openNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpenNotification(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-5 border-b border-white/[0.07]">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-xl shrink-0 mt-0.5">{notifIcon(openNotification)}</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-white">{openNotification.sujet || 'Notification'}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {fmt(openNotification.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenNotification(null)}
                className="h-8 w-8 rounded-xl border border-white/5 bg-zinc-900 text-zinc-500 hover:text-white flex items-center justify-center transition-all shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {cleanText(openNotification.contenu)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
