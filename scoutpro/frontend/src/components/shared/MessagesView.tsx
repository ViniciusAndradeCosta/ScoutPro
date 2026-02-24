import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { MessageSquare, Send, Search, User, CheckCheck, Plus, MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface MessagesViewProps {
  userType: 'admin' | 'scout';
  userName: string;
  initialRecipient?: string;
}

const forceBrasiliaTime = (timestamp: any) => {
  if (!timestamp) return new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
  
  let dateObj;
  try {
    if (Array.isArray(timestamp)) {
      dateObj = new Date(Date.UTC(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5] || 0));
    } else {
      let str = typeof timestamp === 'string' ? timestamp : timestamp.toString();
      if (str.includes('T') && !str.endsWith('Z') && !str.match(/[+-]\d{2}:?\d{2}$/)) {
        str += 'Z';
      }
      dateObj = new Date(str);
    }
    
    return dateObj.toLocaleTimeString('pt-BR', { 
      timeZone: 'America/Sao_Paulo', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (e) {
    return new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
  }
};

const parseFullDate = (timestamp: any) => {
  if (!timestamp) return new Date();
  if (Array.isArray(timestamp)) {
    return new Date(Date.UTC(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5] || 0));
  }
  return new Date(timestamp);
};

export function MessagesView({ userType, userName, initialRecipient }: MessagesViewProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, selectedConversation]);

  useEffect(() => {
    const fetchMessagesAndUsers = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        if (!token) return;
        
        const headers = { 'Authorization': `Bearer ${token}` };

        // CORREÇÃO: URL alterada de /users/all para /users
        const [meRes, msgRes, usersRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/users/me', { headers }),
          fetch('http://localhost:8080/api/v1/messages', { headers }),
          fetch('http://localhost:8080/api/v1/users', { headers }) 
        ]);

        if (meRes.ok && msgRes.ok && usersRes.ok) {
          const meData = await meRes.json();
          const myId = meData.id;
          setCurrentUserId(myId);

          const allMessages = await msgRes.json();
          const allUsers = await usersRes.json();

          const userDict: Record<number, any> = {};
          allUsers.forEach((u: any) => userDict[u.id] = u);

          const convMap: Record<number, any> = {};

          allMessages.forEach((m: any) => {
            const otherUserId = m.senderId === myId ? m.receiverId : m.senderId;
            const msgTime = forceBrasiliaTime(m.timestamp);
            const msgDateObj = parseFullDate(m.timestamp);
            
            if (!convMap[otherUserId]) {
              convMap[otherUserId] = {
                id: otherUserId,
                participant: userDict[otherUserId]?.name || 'Usuário Desconhecido',
                participantRole: userDict[otherUserId]?.role?.toLowerCase() || 'scout',
                lastMessage: m.content,
                timestamp: msgTime,
                fullDate: msgDateObj,
                unread: 0,
                online: false,
                allMessages: [],
                avatar: userDict[otherUserId]?.image || ''
              };
            }
            
            convMap[otherUserId].allMessages.push({
              id: m.id,
              senderId: m.senderId,
              content: m.content,
              timestamp: msgTime,
              fullTimestamp: msgDateObj
            });

            if (msgDateObj > convMap[otherUserId].fullDate) {
              convMap[otherUserId].lastMessage = m.content;
              convMap[otherUserId].timestamp = msgTime;
              convMap[otherUserId].fullDate = msgDateObj;
            }
          });

          Object.values(convMap).forEach((conv: any) => {
            conv.allMessages.sort((a: any, b: any) => a.fullTimestamp - b.fullTimestamp);
          });

          const convArray = Object.values(convMap).sort((a: any, b: any) => b.fullDate - a.fullDate);
          setConversations(convArray);

          if (initialRecipient) {
            const initialConv = convArray.find(c => c.participant.toLowerCase() === initialRecipient.toLowerCase());
            if (initialConv) {
              setSelectedConversation(initialConv);
              setMessages(initialConv.allMessages);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };

    fetchMessagesAndUsers();
  }, [initialRecipient]);

  const handleOpenNewChat = async () => {
    setIsNewChatOpen(true);
    try {
      const token = localStorage.getItem('scoutpro_token');
      // CORREÇÃO: URL alterada de /users/all para /users
      const res = await fetch('http://localhost:8080/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const allUsers = await res.json();
        const others = allUsers.filter((u: any) => u.id !== currentUserId);
        setAvailableContacts(others);
      }
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
    }
  };

  const startConversation = (contact: any) => {
    const existing = conversations.find(c => c.id === contact.id);
    const nowTime = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    if (existing) {
      setSelectedConversation(existing);
      setMessages(existing.allMessages);
    } else {
      const newConv = {
        id: contact.id,
        participant: contact.name,
        participantRole: contact.role.toLowerCase(),
        lastMessage: 'Nova conversa',
        timestamp: nowTime,
        unread: 0,
        avatar: contact.image || '',
        online: true,
        allMessages: []
      };
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv);
      setMessages([]);
    }
    setIsNewChatOpen(false);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const exactLocalTime = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    try {
      const token = localStorage.getItem('scoutpro_token');
      const payload = {
        receiverId: selectedConversation.id,
        content: messageText
      };

      const res = await fetch('http://localhost:8080/api/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const sentMsg = await res.json();
        
        const newMsg = {
          id: sentMsg.id,
          senderId: currentUserId,
          content: sentMsg.content,
          timestamp: exactLocalTime
        };

        setMessages(prev => [...prev, newMsg]);
        setMessageText('');
        
        setConversations(prev => prev.map(c => {
          if (c.id === selectedConversation.id) {
            return { 
              ...c, 
              lastMessage: newMsg.content, 
              timestamp: exactLocalTime,
              allMessages: [...c.allMessages, newMsg] 
            };
          }
          return c;
        }));
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="w-full flex items-stretch gap-4 md:gap-6 mx-auto max-w-[1600px] overflow-hidden"
      style={{ height: 'calc(100vh - 100px)', minHeight: '500px' }}
    >
      <Card className="w-80 lg:w-[380px] h-full flex flex-col bg-card border-border overflow-hidden flex-shrink-0 shadow-sm">
        <div className="p-4 border-b border-border space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Mensagens
            </h2>
            <Button onClick={handleOpenNewChat} size="sm" className="bg-primary text-primary-foreground px-2 h-8">
              <Plus className="w-4 h-4 mr-1" />
              Nova
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar conversas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-muted/30" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredConversations.length === 0 ? (
             <div className="text-center p-4 text-muted-foreground text-sm">Nenhuma conversa.</div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => { setSelectedConversation(conv); setMessages(conv.allMessages); }}
                className={`w-full p-4 rounded-lg text-left transition-all hover:bg-accent/10 ${
                  selectedConversation?.id === conv.id ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
                      {conv.avatar ? (
                        <img src={conv.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-background">{conv.participant.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm truncate">{conv.participant}</div>
                      <div className="text-xs text-muted-foreground flex-shrink-0 ml-2">{conv.timestamp}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate flex-1">{conv.lastMessage}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>

      {selectedConversation ? (
        <Card className="flex-1 h-full flex flex-col bg-card border-border overflow-hidden shadow-sm">
          
          <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
                {selectedConversation.avatar ? (
                  <img src={selectedConversation.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-background">{selectedConversation.participant.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{selectedConversation.participant}</h3>
                <Badge variant="outline" className="bg-muted text-[10px]">{selectedConversation.participantRole === 'admin' ? 'Administrador' : 'Olheiro'}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical className="w-5 h-5" /></Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/30 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">Envie uma mensagem para iniciar o papo.</div>
            ) : (
              messages.map((msg, index) => {
                const isOwnMessage = msg.senderId === currentUserId;
                return (
                  <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted/50'} rounded-2xl p-4 shadow-sm`}>
                      <p className="leading-relaxed text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isOwnMessage ? 'opacity-80' : 'text-muted-foreground'}`}>
                        {msg.timestamp}
                        {isOwnMessage && <CheckCheck className="w-3 h-3 ml-1" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-card/50 border-t border-border flex-shrink-0">
            <div className="flex gap-2">
              <Textarea 
                placeholder="Digite sua mensagem..." 
                value={messageText} 
                onChange={(e) => setMessageText(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} 
                className="min-h-[44px] max-h-[120px] bg-muted/30 resize-none py-3" 
              />
              <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="h-auto px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 self-stretch">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 h-full flex flex-col items-center justify-center bg-muted/30 border-dashed">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">Área de Mensagens</h3>
            <p className="text-muted-foreground">Selecione uma conversa ao lado ou inicie uma nova.</p>
          </div>
        </Card>
      )}

      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader><DialogTitle>Nova Conversa</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">Selecione um usuário do sistema.</p>
            <ScrollArea className="h-72 border border-border rounded-md p-2">
              {availableContacts.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Nenhum contato encontrado.</div>
              ) : (
                availableContacts.map(contact => (
                  <button key={contact.id} onClick={() => startConversation(contact)} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {contact.image ? <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-muted-foreground">{contact.name.substring(0, 2).toUpperCase()}</span>}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{contact.name}</h4><p className="text-[10px] text-muted-foreground">{contact.role === 'ADMIN' ? 'Administrador' : 'Olheiro'}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}