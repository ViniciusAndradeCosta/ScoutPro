import type { 
  Message, 
  Conversation,
  SendMessageData,
  MessageStatus,
} from '../types';
import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * Serviço de Mensagens
 */

// ============================================
// DADOS MOCKADOS
// ============================================

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Carlos Administrador',
    senderRole: 'admin',
    receiverId: '2',
    receiverName: 'Carlos Scout',
    receiverRole: 'scout',
    content: 'Olá! Como está o relatório do João Silva?',
    status: 'read',
    createdAt: '2024-02-20T09:00:00Z',
    readAt: '2024-02-20T09:15:00Z',
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Carlos Scout',
    senderRole: 'scout',
    receiverId: '1',
    receiverName: 'Carlos Administrador',
    receiverRole: 'admin',
    content: 'Oi! Já finalizei o relatório. Ele teve uma atuação excelente!',
    status: 'read',
    createdAt: '2024-02-20T09:30:00Z',
    readAt: '2024-02-20T09:45:00Z',
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'Carlos Administrador',
    senderRole: 'admin',
    receiverId: '2',
    receiverName: 'Carlos Scout',
    receiverRole: 'scout',
    content: 'Perfeito! Vou revisar agora.',
    status: 'read',
    createdAt: '2024-02-20T10:00:00Z',
    readAt: '2024-02-20T10:05:00Z',
  },
  {
    id: '4',
    senderId: '1',
    senderName: 'Carlos Administrador',
    senderRole: 'admin',
    receiverId: '2',
    receiverName: 'Carlos Scout',
    receiverRole: 'scout',
    content: 'Gostei do relatório! Você pode fazer uma análise do Pedro Henrique também?',
    status: 'delivered',
    createdAt: '2024-02-20T14:00:00Z',
  },
];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// SERVIÇO DE MENSAGENS
// ============================================

export const messageService = {
  /**
   * Obter todas as mensagens do usuário atual
   */
  async getMessages(): Promise<Message[]> {
    await delay(400);
    
    const currentUserId = localStorage.getItem('current_user_id');
    
    if (!currentUserId) {
      return [];
    }
    
    // MODO MOCK
    return MOCK_MESSAGES.filter(
      m => m.senderId === currentUserId || m.receiverId === currentUserId
    ).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Message[]>(API_ENDPOINTS.MESSAGES.LIST);
  },

  /**
   * Obter conversas (lista de usuários com quem houve troca de mensagens)
   */
  async getConversations(): Promise<Conversation[]> {
    await delay(400);
    
    const currentUserId = localStorage.getItem('current_user_id');
    
    if (!currentUserId) {
      return [];
    }
    
    // MODO MOCK
    const userMessages = MOCK_MESSAGES.filter(
      m => m.senderId === currentUserId || m.receiverId === currentUserId
    );
    
    // Agrupar por usuário
    const conversationsMap = new Map<string, Conversation>();
    
    userMessages.forEach(msg => {
      const otherUserId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
      const otherUserName = msg.senderId === currentUserId ? msg.receiverName : msg.senderName;
      const otherUserRole = msg.senderId === currentUserId ? msg.receiverRole : msg.senderRole;
      
      const existing = conversationsMap.get(otherUserId);
      const msgDate = new Date(msg.createdAt);
      
      if (!existing || new Date(existing.lastMessageAt) < msgDate) {
        const unreadCount = MOCK_MESSAGES.filter(
          m => m.senderId === otherUserId && 
               m.receiverId === currentUserId && 
               m.status !== 'read'
        ).length;
        
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          userRole: otherUserRole,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount,
        });
      }
    });
    
    return Array.from(conversationsMap.values()).sort((a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Conversation[]>(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
  },

  /**
   * Obter mensagens com um usuário específico
   */
  async getMessagesWithUser(userId: string): Promise<Message[]> {
    await delay(300);
    
    const currentUserId = localStorage.getItem('current_user_id');
    
    if (!currentUserId) {
      return [];
    }
    
    // MODO MOCK
    return MOCK_MESSAGES.filter(
      m => (m.senderId === currentUserId && m.receiverId === userId) ||
           (m.senderId === userId && m.receiverId === currentUserId)
    ).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Message[]>(
    //   API_ENDPOINTS.MESSAGES.WITH_USER(userId)
    // );
  },

  /**
   * Enviar mensagem
   */
  async sendMessage(data: SendMessageData): Promise<Message> {
    await delay(500);
    
    const currentUserId = localStorage.getItem('current_user_id');
    const currentUserRole = localStorage.getItem('current_user_role') as 'admin' | 'scout';
    const currentUserName = currentUserRole === 'admin' ? 'Carlos Administrador' : 'Carlos Scout';
    
    if (!currentUserId) {
      throw new Error('Usuário não autenticado');
    }
    
    // MODO MOCK
    // Buscar dados do destinatário
    const receiverRole: 'admin' | 'scout' = currentUserRole === 'admin' ? 'scout' : 'admin';
    const receiverName = receiverRole === 'admin' ? 'Carlos Administrador' : 'Carlos Scout';
    
    const newMessage: Message = {
      id: `${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      receiverId: data.receiverId,
      receiverName,
      receiverRole,
      content: data.content,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };
    
    MOCK_MESSAGES.push(newMessage);
    
    // Simular entrega após 1 segundo
    setTimeout(() => {
      newMessage.status = 'delivered';
    }, 1000);
    
    return newMessage;
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Message>(
    //   API_ENDPOINTS.MESSAGES.SEND,
    //   {
    //     method: 'POST',
    //     body: data,
    //   }
    // );
  },

  /**
   * Marcar mensagem como lida
   */
  async markAsRead(messageId: string): Promise<void> {
    await delay(200);
    
    // MODO MOCK
    const message = MOCK_MESSAGES.find(m => m.id === messageId);
    
    if (message) {
      message.status = 'read';
      message.readAt = new Date().toISOString();
    }
    
    // MODO BACKEND (Descomentar quando integrar)
    // await apiRequest(
    //   API_ENDPOINTS.MESSAGES.MARK_READ(messageId),
    //   {
    //     method: 'PATCH',
    //   }
    // );
  },

  /**
   * Marcar todas as mensagens de um usuário como lidas
   */
  async markAllAsReadFromUser(userId: string): Promise<void> {
    await delay(300);
    
    const currentUserId = localStorage.getItem('current_user_id');
    
    if (!currentUserId) {
      return;
    }
    
    // MODO MOCK
    MOCK_MESSAGES.forEach(msg => {
      if (msg.senderId === userId && msg.receiverId === currentUserId && msg.status !== 'read') {
        msg.status = 'read';
        msg.readAt = new Date().toISOString();
      }
    });
    
    // MODO BACKEND (Descomentar quando integrar)
    // await apiRequest(
    //   `/messages/mark-all-read/${userId}`,
    //   {
    //     method: 'PATCH',
    //   }
    // );
  },

  /**
   * Obter contagem de mensagens não lidas
   */
  async getUnreadCount(): Promise<number> {
    await delay(200);
    
    const currentUserId = localStorage.getItem('current_user_id');
    
    if (!currentUserId) {
      return 0;
    }
    
    // MODO MOCK
    return MOCK_MESSAGES.filter(
      m => m.receiverId === currentUserId && m.status !== 'read'
    ).length;
    
    // MODO BACKEND (Descomentar quando integrar)
    // const response = await apiRequest<{ count: number }>(
    //   API_ENDPOINTS.MESSAGES.UNREAD_COUNT
    // );
    // return response.count;
  },

  /**
   * Obter dados mockados
   */
  getMockMessages(): Message[] {
    return [...MOCK_MESSAGES];
  },
};
