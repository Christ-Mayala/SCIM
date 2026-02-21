import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Search, 
  MoreVertical,
  Phone,

  Info,
  ArrowLeft,
  Trash
} from 'lucide-react';
import { useMessage } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input'; 
import { Textarea } from '../components/ui/Textarea'; 
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { formatDate, formatTime } from '../lib/utils';

const MessagesPage = () => {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const {
    messages,
    conversations,
    currentConversation,
    unreadCount,
    inboxLoading,
    conversationLoading,
    isSending,
    isContactSending,
    fetchInbox,
    inboxPage,
    inboxTotalPages,
    convPage,
    convTotalPages,
    fetchMessagesWithUser,
    sendMessage,
    contactScim,
    markMessageAsRead,
    clearCurrentConversation,
    typingFromOther,
    notifyTyping,
    stopTyping,
    deleteMessage,
    deleteThread,
  } = useMessage();

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageForm, setNewMessageForm] = useState({
    subject: '',
    content: ''
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isMobile && currentConversation) {
      setShowConversationList(false);
    }
  }, [currentConversation, isMobile]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation || isSending) return;
    const result = await sendMessage(currentConversation, newMessage);
    if (result.success) {
      setNewMessage('');
      stopTyping();
    }
  };

  const handleContactScim = async (e) => {
    e.preventDefault();
    if (!newMessageForm.subject.trim() || !newMessageForm.content.trim() || isContactSending) return;
    const result = await contactScim(newMessageForm.subject, newMessageForm.content);
    if (result.success) {
      setNewMessageForm({ subject: '', content: '' });
      setShowNewMessageModal(false);
    }
  };

  const handleConversationClick = (userId) => {
    if (!userId) return;
    fetchMessagesWithUser(userId);
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    clearCurrentConversation();
  };

  const filteredConversations = conversations.filter((conv) =>
    (conv?.otherUser?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv?.lastMessage?.contenu || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConversationList = () => (
    <div className="w-full md:w-96 lg:w-[420px] bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Messages</h1>
          <Button
            size="sm"
            onClick={() => setShowNewMessageModal(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau</span>
          </Button>
        </div>
        <div className="relative">
          <Input
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {inboxLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune conversation</p>
            <Button size="sm" onClick={() => setShowNewMessageModal(true)} className="mt-4">
              Commencer une conversation
            </Button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation?.otherUser?._id || conversation?.lastMessage?._id || index}
                  onClick={() => handleConversationClick(conversation?.otherUser?._id)}
                  className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    currentConversation === conversation?.otherUser?._id ? 'bg-gold-light/30 border-r-2 border-gold-primary' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-gold-primary to-gold-dark rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {(conversation?.otherUser?.nom || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation?.otherUser?.nom || 'Utilisateur'}
                        </p>
                        {conversation?.lastMessage && (
                          <p className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </p>
                        )}
                      </div>
                      {conversation?.lastMessage && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage.contenu}
                        </p>
                      )}
                      {conversation?.unreadCount > 0 && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {conversation.unreadCount} non lu{conversation.unreadCount > 1 ? 's' : ''}
                          </span>
                          <div className="w-2 h-2 bg-gold-primary rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {inboxPage < inboxTotalPages && (
              <div className="p-4">
                <Button variant="outline" className="w-full" onClick={() => fetchInbox(inboxPage + 1)}>
                  Charger plus de conversations
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderConversation = () => (
    <div className="flex-1 flex flex-col bg-gray-50">
      {currentConversation ? (
        <>
          <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <Button variant="ghost" size="sm" onClick={handleBackToList} className="mr-2">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <div className="w-8 h-8 bg-gradient-to-r from-gold-primary to-gold-dark rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {(conversations.find(c => c?.otherUser?._id === currentConversation)?.otherUser?.nom || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {conversations.find(c => c?.otherUser?._id === currentConversation)?.otherUser?.nom || 'Administration'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {typingFromOther ? "L'autre écrit…" : 'En ligne'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setShowUserInfo(true)}>
                  <Info className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!currentConversation) return;
                    if (window.confirm('Supprimer toute la conversation ?')) {
                      deleteThread(currentConversation);
                    }
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
            {currentConversation && convPage < convTotalPages && (
              <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={() => fetchMessagesWithUser(currentConversation, convPage + 1)}>
                  Charger plus d'anciens messages
                </Button>
              </div>
            )}
            {conversationLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun message dans cette conversation</p>
                <p className="text-sm text-gray-500 mt-2">Commencez la conversation en envoyant un message</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message?.expediteur?._id === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md lg:max-w-lg px-3 sm:px-4 py-2 rounded-lg ${
                      message?.expediteur?._id === currentUserId
                        ? 'bg-gold-primary text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.contenu}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-xs ${
                          message?.expediteur?._id === currentUserId ? 'text-gold-light' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.createdAt)}
                        {user?.role === 'admin' && message?.expediteur?._id === currentUserId && (
                          <span className="ml-2">{message.lu ? 'Lu' : 'Non lu'}</span>
                        )}
                      </p>
                      {message?.expediteur?._id === currentUserId && (
                        <button
                          className={`text-xs flex items-center space-x-1 ${message?.expediteur?._id === currentUserId ? 'text-gold-light hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => {
                            if (window.confirm('Supprimer ce message ?')) {
                              deleteMessage(message._id);
                            }
                          }}
                        >
                          <Trash className="w-3 h-3" />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    notifyTyping();
                  }}
                  onBlur={stopTyping}
                  placeholder="Tapez votre message..."
                  rows={1}
                  className="resize-none"
                  disabled={isSending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
              <Button type="submit" disabled={!newMessage.trim() || isSending} className="flex items-center space-x-1 shrink-0">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{isSending ? 'Envoi...' : 'Envoyer'}</span>
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
            <p className="text-gray-600 mb-6">Choisissez une conversation existante ou commencez-en une nouvelle</p>
            <Button onClick={() => setShowNewMessageModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle conversation
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-4">
        <div className="flex h-[calc(100dvh-4rem)]">
          {(!isMobile || showConversationList) && renderConversationList()}
          {(!isMobile || !showConversationList) && renderConversation()}
        </div>
      </div>
      <Modal
        isOpen={showUserInfo}
        onClose={() => setShowUserInfo(false)}
        title="Informations de l'utilisateur"
      >
        {(() => {
          const other = conversations.find(c => c?.otherUser?._id === currentConversation)?.otherUser;
          if (!other) return <div className="text-gray-600">Aucune information disponible.</div>;
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Nom</span>
                <span className="font-medium">{other.nom || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{other.email || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Téléphone</span>
                <span className="font-medium">{other.telephone || '—'}</span>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        title="Contacter l'administration"
      >
        <form onSubmit={handleContactScim} className="space-y-3 sm:space-y-4">
          <Input
            label="Sujet"
            value={newMessageForm.subject}
            onChange={(e) => setNewMessageForm(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Objet de votre message"
            required
          />
          <Textarea
            label="Message"
            value={newMessageForm.content}
            onChange={(e) => setNewMessageForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Votre message..."
            rows={4}
            required
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isContactSending} className="w-full sm:flex-1">
              {isContactSending ? 'Envoi...' : 'Envoyer'}
            </Button>
            <Button type="button" variant="outline" disabled={isContactSending} className="w-full sm:w-auto" onClick={() => setShowNewMessageModal(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessagesPage;
