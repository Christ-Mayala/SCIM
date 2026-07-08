import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../lib/api';
import toast from 'react-hot-toast';

const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

const getSocketBaseUrl = () => {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit) return explicit;

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return window.location.origin;

  try {
    const u = new URL(apiUrl);
    return u.origin;
  } catch (_) {
    const stripped = String(apiUrl).replace(/\/api\/.*$/i, '');
    return stripped || window.location.origin;
  }
};

const upsertConversation = (prev, { otherUser, lastMessage, unreadDelta = 0, unreadSet } = {}) => {
  const list = Array.isArray(prev) ? prev : [];
  const id = otherUser?._id || otherUser?.id;
  if (!id) return list;

  const idx = list.findIndex((c) => (c?.otherUser?._id || c?.otherUser?.id) === id);
  const nextUnread = (c) => {
    if (typeof unreadSet === 'number') return Math.max(0, unreadSet);
    const current = Number(c?.unreadCount || 0);
    return Math.max(0, current + Number(unreadDelta || 0));
  };

  if (idx === -1) {
    return [
      {
        otherUser,
        lastMessage: lastMessage || null,
        unreadCount: typeof unreadSet === 'number' ? Math.max(0, unreadSet) : Math.max(0, Number(unreadDelta || 0)),
      },
      ...list,
    ];
  }

  const updated = {
    ...list[idx],
    otherUser: otherUser || list[idx]?.otherUser,
    lastMessage: lastMessage || list[idx]?.lastMessage,
    unreadCount: nextUnread(list[idx]),
  };

  const without = [...list.slice(0, idx), ...list.slice(idx + 1)];
  return [updated, ...without];
};

export const MessageProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  // Wait for AuthContext to finish loading before making any authenticated calls
  const userId = (isAuthenticated && !authLoading) ? (user?._id || user?.id) : null;

  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isContactSending, setIsContactSending] = useState(false);
  const [inboxPage, setInboxPage] = useState(1);
  const [inboxTotalPages, setInboxTotalPages] = useState(1);
  const [convPage, setConvPage] = useState(1);
  const [convTotalPages, setConvTotalPages] = useState(1);
  const [typingFromOther, setTypingFromOther] = useState(false);

  const socketRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);
  const typingStartTimeoutRef = useRef(null);
  const typingActiveRef = useRef(false);
  const conversationRequestIdRef = useRef(0);

  const currentConversationRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const fetchInbox = useCallback(
    async (page = 1, { silent = false } = {}) => {
      if (!userId) return;
      try {
        if (!silent) setInboxLoading(true);
        const response = await api.get('/message/inbox', { params: { page, limit: 10 } });
        const threads = response.data?.threads || [];
        const normalized = threads
          .map((t) => ({
            otherUser: t.correspondant,
            lastMessage: t.dernierMessage,
            unreadCount: t.nonLus || 0,
          }))
          .filter((t) => t?.otherUser?._id || t?.otherUser?.id);

        setConversations((prev) => {
          if (page === 1) return normalized;
          const map = new Map();
          for (const c of prev || []) {
            const id = c?.otherUser?._id || c?.otherUser?.id;
            if (id) map.set(String(id), c);
          }
          for (const c of normalized) {
            const id = c?.otherUser?._id || c?.otherUser?.id;
            if (id) map.set(String(id), c);
          }
          return Array.from(map.values());
        });

        setInboxPage(response.data?.page || page);
        setInboxTotalPages(response.data?.totalPages || 1);
      } catch (_) {
        // toast.error('Erreur lors du chargement de la boîte de réception');
      } finally {
        if (!silent) setInboxLoading(false);
      }
    },
    [userId],
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await api.get('/message/unread');
      setUnreadCount(response.data?.unread || 0);
    } catch (_) {}
  }, [userId]);

  const markThreadAsRead = useCallback(
    async (otherUserId) => {
      if (!userId || !otherUserId) return;
      try {
        await api.patch(`/message/thread/${otherUserId}/read`);
        setMessages((prev) => prev.map((msg) => ({ ...msg, lu: true })));
        setConversations((prev) =>
          (prev || []).map((conv) =>
            (conv?.otherUser?._id || conv?.otherUser?.id) === otherUserId ? { ...conv, unreadCount: 0 } : conv,
          ),
        );
        fetchUnreadCount();
      } catch (_) {}
    },
    [fetchUnreadCount, userId],
  );

  const fetchMessagesWithUser = useCallback(
    async (otherUserId, page = 1, { silent = false } = {}) => {
      if (!userId || !otherUserId) return;
      const conversationId = String(otherUserId);
      const requestId = ++conversationRequestIdRef.current;

      if (page === 1) {
        setCurrentConversation(conversationId);
        setTypingFromOther(false);
      }

      try {
        if (!silent) setConversationLoading(true);
        const response = await api.get(`/message/${conversationId}`, { params: { page, limit: 20 } });
        if (requestId !== conversationRequestIdRef.current) return;
        const list = response.data?.messages || response.data || [];

        setMessages((prev) => (page === 1 ? list : [...list, ...(prev || [])]));
        setConvPage(response.data?.page || page);
        setConvTotalPages(response.data?.totalPages || 1);

        await markThreadAsRead(conversationId);
      } catch (_) {
        if (requestId === conversationRequestIdRef.current) {
          toast.error('Erreur lors du chargement des messages');
        }
      } finally {
        if (!silent && requestId === conversationRequestIdRef.current) {
          setConversationLoading(false);
        }
      }
    },
    [markThreadAsRead, userId],
  );

  const sendMessage = useCallback(
    async (receiverId, content) => {
      if (!userId) return { success: false };
      const trimmed = String(content || '').trim();
      if (!receiverId || !trimmed || isSending) return { success: false };

      try {
        setIsSending(true);
        const response = await api.post(`/message/${receiverId}`, { contenu: trimmed });
        const sent = response.data;

        setMessages((prev) => {
          const conv = currentConversationRef.current;
          if (conv !== receiverId) return prev;
          if ((prev || []).some((m) => m._id === sent?._id)) return prev;
          return [...(prev || []), sent];
        });

        setConversations((prev) => {
          const otherUser = sent?.destinataire || sent?.expediteur;
          return upsertConversation(prev, { otherUser, lastMessage: sent, unreadDelta: 0 });
        });

        fetchInbox(1, { silent: true });
        return { success: true };
      } catch (error) {
        toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message");
        return { success: false, error: error.response?.data?.message || 'Erreur inconnue' };
      } finally {
        setIsSending(false);
      }
    },
    [fetchInbox, isSending, userId],
  );

  const contactScim = useCallback(
    async (subject, content) => {
      if (!userId || isContactSending) return { success: false };
      try {
        setIsContactSending(true);
        await api.post('/message/scim', { sujet: subject, contenu: content });
        toast.success("Message envoye a l'administration");
        fetchInbox(1, { silent: true });
        fetchUnreadCount();
        return { success: true };
      } catch (error) {
        toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message a l'administration");
        return { success: false, error: error.response?.data?.message || 'Erreur inconnue' };
      } finally {
        setIsContactSending(false);
      }
    },
    [fetchInbox, fetchUnreadCount, isContactSending, userId],
  );

  const markMessageAsRead = useCallback(
    async (messageId) => {
      if (!messageId) return;
      try {
        await api.patch(`/message/${messageId}/read`);
        setMessages((prev) => (prev || []).map((msg) => (msg._id === messageId ? { ...msg, lu: true } : msg)));
        fetchUnreadCount();
      } catch (_) {}
    },
    [fetchUnreadCount],
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      if (!messageId) return;
      try {
        await api.del(`/message/${messageId}`);
        setMessages((prev) => (prev || []).filter((m) => m._id !== messageId));
        fetchInbox(1, { silent: true });
        fetchUnreadCount();
        toast.success('Message supprimé');
      } catch (_) {
        toast.error('Suppression impossible');
      }
    },
    [fetchInbox, fetchUnreadCount],
  );

  const deleteThread = useCallback(
    async (otherUserId) => {
      if (!otherUserId) return;
      try {
        await api.del(`/message/thread/${otherUserId}`);
        setMessages([]);
        setConversations((prev) => (prev || []).filter((conv) => (conv?.otherUser?._id || conv?.otherUser?.id) !== otherUserId));
        if (currentConversationRef.current === otherUserId) {
          conversationRequestIdRef.current += 1;
          setCurrentConversation(null);
          setConversationLoading(false);
          setTypingFromOther(false);
        }
        fetchUnreadCount();
        toast.success('Conversation supprimée');
      } catch (_) {
        toast.error('Suppression de la conversation impossible');
      }
    },
    [fetchUnreadCount],
  );

  const clearCurrentConversation = useCallback(() => {
    conversationRequestIdRef.current += 1;
    setCurrentConversation(null);
    setMessages([]);
    setConversationLoading(false);
    setTypingFromOther(false);
    if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
    if (typingStartTimeoutRef.current) clearTimeout(typingStartTimeoutRef.current);
    typingActiveRef.current = false;
  }, []);

  const notifyTyping = useCallback(() => {
    const socket = socketRef.current;
    const conv = currentConversationRef.current;
    if (!socket || !conv) return;

    if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
    typingStopTimeoutRef.current = setTimeout(() => {
      const s = socketRef.current;
      const c = currentConversationRef.current;
      if (!s || !c) return;
      if (typingActiveRef.current) {
        s.emit('typing:stop', { to: c });
        typingActiveRef.current = false;
      }
    }, 600);

    if (!typingActiveRef.current && !typingStartTimeoutRef.current) {
      typingStartTimeoutRef.current = setTimeout(() => {
        const s = socketRef.current;
        const c = currentConversationRef.current;
        if (!s || !c) return;
        s.emit('typing:start', { to: c });
        typingActiveRef.current = true;
        typingStartTimeoutRef.current = null;
      }, 250);
    }
  }, []);

  const stopTyping = useCallback(() => {
    const socket = socketRef.current;
    const conv = currentConversationRef.current;
    if (!socket || !conv) return;

    if (typingStartTimeoutRef.current) clearTimeout(typingStartTimeoutRef.current);
    typingStartTimeoutRef.current = null;

    if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
    typingStopTimeoutRef.current = null;

    if (typingActiveRef.current) {
      socket.emit('typing:stop', { to: conv });
      typingActiveRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      conversationRequestIdRef.current += 1;
      setConversations([]);
      setMessages([]);
      setCurrentConversation(null);
      setUnreadCount(0);
      setInboxLoading(false);
      setConversationLoading(false);
      setIsSending(false);
      setIsContactSending(false);
      setTypingFromOther(false);
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    let cancelled = false;

    import('socket.io-client')
      .then(({ io }) => {
        if (cancelled) return;
        const token = localStorage.getItem('token');
        const socket = io(getSocketBaseUrl(), {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 60000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          const uid = userIdRef.current;
          if (uid) socket.emit('join', uid);
        });

        socket.on('message:new', (msg) => {
          const myId = userIdRef.current;
          if (!myId) return;

          const from = msg?.expediteur?._id || msg?.expediteur?.id;
          const to = msg?.destinataire?._id || msg?.destinataire?.id;
          const otherId = String(from) === String(myId) ? String(to || '') : String(from || '');
          const openConv = currentConversationRef.current;

          if (otherId && openConv && String(openConv) === String(otherId)) {
            setMessages((prev) => {
              if ((prev || []).some((m) => m._id === msg?._id)) return prev;
              return [...(prev || []), msg];
            });
            markThreadAsRead(otherId);
          } else {
            fetchUnreadCount();
          }

          const otherUser = String(from) === String(myId) ? msg?.destinataire : msg?.expediteur;
          setConversations((prev) => {
            const unreadDelta = String(from) === String(myId) ? 0 : 1;
            return upsertConversation(prev, { otherUser, lastMessage: msg, unreadDelta });
          });
        });

        socket.on('thread:read', ({ userId: otherUserId } = {}) => {
          if (!otherUserId) return;
          const openConv = currentConversationRef.current;
          if (openConv && String(openConv) === String(otherUserId)) {
            setMessages((prev) => (prev || []).map((m) => ({ ...m, lu: true })));
          }
          setConversations((prev) =>
            (prev || []).map((c) =>
              (c?.otherUser?._id || c?.otherUser?.id) === otherUserId ? { ...c, unreadCount: 0 } : c,
            ),
          );
        });

        socket.on('message:deleted', ({ id } = {}) => {
          if (!id) return;
          setMessages((prev) => (prev || []).filter((m) => m._id !== id));
          fetchInbox(1, { silent: true });
        });

        socket.on('thread:deleted', ({ userId: otherUserId } = {}) => {
          if (!otherUserId) return;
          setConversations((prev) => (prev || []).filter((c) => (c?.otherUser?._id || c?.otherUser?.id) !== otherUserId));
          const openConv = currentConversationRef.current;
          if (openConv && String(openConv) === String(otherUserId)) {
            setCurrentConversation(null);
            setMessages([]);
            setTypingFromOther(false);
          }
          fetchUnreadCount();
        });

        socket.on('typing', ({ from, isTyping } = {}) => {
          const openConv = currentConversationRef.current;
          if (openConv && from && String(from) === String(openConv)) {
            setTypingFromOther(Boolean(isTyping));
          }
        });

        socket.on('connect_error', () => {
          fetchUnreadCount();
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchInbox, fetchUnreadCount, markThreadAsRead, userId]);

  useEffect(() => {
    if (!userId) return;
    fetchInbox(1, { silent: true });
    fetchUnreadCount();
  }, [fetchInbox, fetchUnreadCount, userId]);

  const value = useMemo(
    () => ({
      messages,
      conversations,
      currentConversation,
      unreadCount,
      loading: inboxLoading || conversationLoading,
      inboxLoading,
      conversationLoading,
      isSending,
      isContactSending,
      fetchInbox,
      fetchMessagesWithUser,
      inboxPage,
      inboxTotalPages,
      convPage,
      convTotalPages,
      sendMessage,
      contactScim,
      fetchUnreadCount,
      markMessageAsRead,
      markThreadAsRead,
      clearCurrentConversation,
      typingFromOther,
      notifyTyping,
      stopTyping,
      deleteMessage,
      deleteThread,
    }),
    [
      clearCurrentConversation,
      contactScim,
      convPage,
      convTotalPages,
      currentConversation,
      deleteMessage,
      deleteThread,
      fetchInbox,
      fetchMessagesWithUser,
      fetchUnreadCount,
      inboxPage,
      inboxTotalPages,
      inboxLoading,
      conversationLoading,
      isSending,
      isContactSending,
      markMessageAsRead,
      markThreadAsRead,
      messages,
      conversations,
      notifyTyping,
      sendMessage,
      stopTyping,
      typingFromOther,
      unreadCount,
    ],
  );

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export default MessageContext;
