import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Send, User, Search, MapPin, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Messages = () => {
  const { t } = useTranslation();
  const { partnerId } = useParams();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.io
  useEffect(() => {
    socketRef.current = io();
    if (user) {
      socketRef.current.emit('join', user.id);
    }

    socketRef.current.on('message', (message: any) => {
      // Update messages if it's the current active chat
      if (
        partnerId &&
        ((message.senderId === user?.id && message.receiverId === partnerId) ||
        (message.senderId === partnerId && message.receiverId === user?.id))
      ) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.find(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }

      // Update conversations list (last message)
      setConversations((prev) => {
        const partnerInfo = message.senderId === user?.id ? message.receiver : message.sender;
        const existingConvIndex = prev.findIndex(c => c.partner.id === partnerInfo.id);
        
        const updatedConv = {
          partner: partnerInfo,
          lastMessage: message
        };

        if (existingConvIndex > -1) {
          const newConvs = [...prev];
          newConvs.splice(existingConvIndex, 1);
          return [updatedConv, ...newConvs];
        } else {
          return [updatedConv, ...prev];
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, partnerId]);

  // Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to fetch conversations', err);
      } finally {
        setConversationsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch Messages for active chat
  useEffect(() => {
    if (!partnerId) {
      setMessages([]);
      setPartner(null);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/messages/${partnerId}`);
        setMessages(res.data);
        
        // Find partner info from conversations or messages
        const conv = conversations.find(c => c.partner.id === partnerId);
        if (conv) {
          setPartner(conv.partner);
        } else {
          const firstMsg = res.data.find((m: any) => m.senderId === partnerId || m.receiverId === partnerId);
          if (firstMsg) {
            setPartner(firstMsg.senderId === partnerId ? firstMsg.sender : firstMsg.receiver);
          } else {
            // Fetch partner info from API if it's a new chat
            try {
              const partnerRes = await api.get(`/users/${partnerId}`);
              setPartner(partnerRes.data);
            } catch (partnerErr) {
              console.error('Failed to fetch partner info', partnerErr);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch messages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [partnerId, conversations.length]); // Re-run if partnerId changes or conversations are loaded

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerId) return;

    try {
      const res = await api.post('/messages', {
        receiverId: partnerId,
        content: newMessage,
        propertyId: propertyId || undefined
      });
      
      // Optimistically update messages if socket is slow or fails
      const sentMsg = res.data;
      setMessages((prev) => {
        if (prev.find(m => m.id === sentMsg.id)) return prev;
        return [...prev, sentMsg];
      });

      setNewMessage('');
      // Remove propertyId from URL after first message
      if (propertyId) {
        navigate(`/messages/${partnerId}`, { replace: true });
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.partner.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col ${partnerId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-800 space-y-4">
          <h2 className="text-2xl font-black text-white">{t('messages.title')}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder={t('messages.searchPlaceholder')}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {conversationsLoading ? (
            <div className="p-10 text-center text-slate-500">{t('common.loading')}</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <MessageSquare size={40} className="mx-auto text-slate-800" />
              <p className="text-slate-500 text-sm">{t('messages.noConversations')}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredConversations.map((c) => (
                <Link 
                  key={c.partner.id}
                  to={`/messages/${c.partner.id}`}
                  className={`flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors group ${partnerId === c.partner.id ? 'bg-slate-800/50' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 font-black text-lg border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
                      {c.partner.fullName?.[0] || <User size={20} />}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="text-sm font-bold text-white truncate">{c.partner.fullName}</h3>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(c.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {c.lastMessage.property && (
                      <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <MapPin size={10} /> {c.lastMessage.property.address}
                      </p>
                    )}
                    <p className="text-slate-400 text-xs truncate">
                      {c.lastMessage.senderId === user?.id ? 'You: ' : ''}{c.lastMessage.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`flex-1 flex flex-col bg-slate-900/50 ${!partnerId ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!partnerId ? (
          <div className="text-center space-y-4 opacity-20">
            <MessageSquare size={80} className="mx-auto" />
            <h3 className="text-2xl font-black">{t('messages.selectConversation')}</h3>
            <p>{t('messages.selectSubtitle')}</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-800/20 backdrop-blur-md">
              <button onClick={() => navigate('/messages')} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={24} />
              </button>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl">
                {partner?.fullName?.[0] || <User />}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{partner?.fullName || 'Chat'}</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{t('messages.activeNow')}</p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-500">{t('messages.loadingMessages')}</div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        {msg.property && (
                          <Link 
                            to={`/properties/${msg.property.id}`}
                            className={`mb-2 p-3 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center gap-4 hover:border-emerald-500/50 transition-all max-w-[85%] md:max-w-[70%]`}
                          >
                            <img 
                              src={msg.property.images?.[0]?.url || 'https://picsum.photos/seed/p/100/100'} 
                              className="w-12 h-12 rounded-xl object-cover" 
                            />
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">{msg.property.address}</p>
                              <p className="text-emerald-500 font-black text-xs">{t('common.etb')} {msg.property.price.toLocaleString()}</p>
                            </div>
                          </Link>
                        )}
                        <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl ${isMine ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center gap-2 mt-1.5 opacity-50 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[9px] uppercase font-bold">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={scrollRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-800/10">
              <form onSubmit={handleSendMessage} className="flex gap-3 md:gap-4">
                <input
                  type="text"
                  placeholder={t('messages.writeMessage')}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white p-3 md:p-4 rounded-2xl transition-all active:scale-95 shrink-0"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
