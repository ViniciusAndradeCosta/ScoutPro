import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { Send, Search } from 'lucide-react';

interface ChatViewProps {
  userType: 'admin' | 'scout';
  initialRecipient?: string | null;
}

export function ChatView({ userType, initialRecipient }: ChatViewProps) {
  const [selectedChat, setSelectedChat] = useState('1');
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: userType === 'admin' ? 'Carlos Mendes' : 'Admin João',
      role: userType === 'admin' ? 'Olheiro' : 'Administrador',
      lastMessage: 'O jogador João Silva mostrou um ótimo desempenho',
      time: '2 min',
      unread: 2,
      player: 'João Silva',
    },
    {
      id: '2',
      name: userType === 'admin' ? 'Maria Oliveira' : 'Admin Pedro',
      role: userType === 'admin' ? 'Olheiro' : 'Administrador',
      lastMessage: 'Quando podemos discutir o relatório?',
      time: '1h',
      unread: 0,
      player: 'Pedro Santos',
    },
    {
      id: '3',
      name: userType === 'admin' ? 'Roberto Lima' : 'Admin Lucas',
      role: userType === 'admin' ? 'Olheiro' : 'Administrador',
      lastMessage: 'Obrigado pelo feedback!',
      time: '3h',
      unread: 0,
      player: 'Lucas Costa',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: userType === 'admin' ? 'scout' : 'admin',
      text: 'Olá! Vi seu relatório sobre o João Silva. Excelente trabalho!',
      time: '10:30',
    },
    {
      id: 2,
      sender: userType === 'admin' ? 'admin' : 'scout',
      text: 'Obrigado! Ele realmente demonstrou habilidades impressionantes no último jogo.',
      time: '10:32',
    },
    {
      id: 3,
      sender: userType === 'admin' ? 'scout' : 'admin',
      text: 'O jogador João Silva mostrou um ótimo desempenho especialmente no ataque. A finalização dele está muito acima da média para a categoria.',
      time: '10:35',
    },
    {
      id: 4,
      sender: userType === 'admin' ? 'admin' : 'scout',
      text: 'Concordo completamente. Você acha que ele está pronto para uma promoção?',
      time: '10:38',
    },
    {
      id: 5,
      sender: userType === 'admin' ? 'scout' : 'admin',
      text: 'Acredito que sim. Precisaria de mais alguns treinos táticos, mas o potencial está lá.',
      time: '10:40',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Aqui seria enviada a mensagem
      setMessage('');
    }
  };

  const currentConversation = conversations.find((c) => c.id === selectedChat);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-80 bg-card border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">Conversas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversa..."
              className="pl-10 bg-input-background border-border"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`w-full p-4 rounded-lg text-left transition-colors mb-2 ${
                  selectedChat === conv.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-background">
                      {conv.name.charAt(0)}
                    </span>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="font-semibold text-sm">{conv.name}</div>
                        <div className="text-xs text-muted-foreground">{conv.role}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                        {conv.unread > 0 && (
                          <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">
                            {conv.unread}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {conv.lastMessage}
                    </p>
                    <div className="text-xs text-primary">Re: {conv.player}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 bg-card border-border flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-semibold text-background">
                {currentConversation?.name.charAt(0)}
              </span>
            </Avatar>
            <div>
              <div className="font-semibold">{currentConversation?.name}</div>
              <div className="text-sm text-muted-foreground">
                Sobre: {currentConversation?.player}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === (userType === 'admin' ? 'admin' : 'scout')
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === (userType === 'admin' ? 'admin' : 'scout')
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-input-background border-border"
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
