// ============================================
// TIPOS DE USUÁRIO E AUTENTICAÇÃO
// ============================================

export type UserRole = 'admin' | 'scout';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  joinedAt: string;
  isActive: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// TIPOS DE JOGADORES
// ============================================

export type PlayerStatus = 'Em Alta' | 'Regular' | 'Em Baixa';
export type PlayerPosition = 
  | 'Goleiro' 
  | 'Lateral Direito' 
  | 'Lateral Esquerdo' 
  | 'Zagueiro' 
  | 'Volante' 
  | 'Meia' 
  | 'Atacante' 
  | 'Ponta';

export interface PlayerAttributes {
  // Físicos
  velocidade: number;
  resistencia: number;
  forca: number;
  agilidade: number;
  
  // Técnicos
  finalizacao: number;
  passe: number;
  drible: number;
  controle: number;
  cruzamento: number;
  cabeca: number;
  
  // Mentais
  visaoJogo: number;
  posicionamento: number;
  decisao: number;
  concentracao: number;
  
  // Defensivos (se aplicável)
  marcacao?: number;
  desarme?: number;
  antecipacao?: number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: PlayerPosition;
  club: string;
  status: PlayerStatus;
  image?: string; // Alterado de photo para image para bater com o Java
  nationality: string;
  height: number;
  weight: number;
  preferredFoot: 'Direito' | 'Esquerdo' | 'Ambidestro';
  
  matchStats: PlayerMatchStats;
  detailedAttributes: PlayerDetailedAttributes;
  injuries: PlayerInjury[];
  
  createdBy: string; 
  createdByName: string; 
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
}
export interface PlayerInjury {
  id?: string;
  injuryType: string;
  startDate: string;
  returnDate?: string;
  severity: 'Leve' | 'Moderada' | 'Grave';
}

export interface PlayerMatchStats {
  goals: number;
  assists: number;
  yellowCards: number;
  matchesPlayed: number;
}

export interface PlayerDetailedAttributes {
  finishing: number; shotPower: number; longShots: number; volleys: number; penalties: number;
  dribbling: number; ballControl: number; acceleration: number; sprintSpeed: number; agility: number;
  positioning: number; vision: number; crossing: number; freeKick: number; shortPassing: number; longPassing: number;
  marking: number; standingTackle: number; slidingTackle: number; interceptions: number;
  strength: number; stamina: number; jumping: number; aggression: number; composure: number; reactions: number; passing: number; pace: number;
  
}

export interface PlayerFormData {
  name: string;
  age: number;
  position: PlayerPosition;
  club: string;
  nationality: string;
  height: number;
  weight: number;
  preferredFoot: 'Direito' | 'Esquerdo' | 'Ambidestro';
  marketValue: number;
  contractUntil: string;
  photo?: string;
  attributes: PlayerAttributes;
}

// ============================================
// TIPOS DE RELATÓRIOS
// ============================================

export type ReportType = 'Avaliação Técnica' | 'Análise Física' | 'Observação Geral';
export type ReportStatus = 'Pendente' | 'Em Análise' | 'Aprovado' | 'Rejeitado';

export interface Report {
  id: string;
  playerId: string;
  playerName: string;
  scoutId: string;
  scoutName: string;
  type: ReportType;
  status: ReportStatus;
  date: string;
  matchDetails?: {
    opponent: string;
    competition: string;
    result: string;
  };
  performance: {
    rating: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
  };
  technicalAnalysis?: {
    passing: number;
    dribbling: number;
    shooting: number;
    defending: number;
    positioning: number;
  };
  physicalAnalysis?: {
    speed: number;
    stamina: number;
    strength: number;
    agility: number;
  };
  recommendation: 'Contratar' | 'Monitorar' | 'Descartar';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFormData {
  playerId: string;
  type: ReportType;
  matchDetails?: {
    opponent: string;
    competition: string;
    result: string;
  };
  performance: {
    rating: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
  };
  technicalAnalysis?: {
    passing: number;
    dribbling: number;
    shooting: number;
    defending: number;
    positioning: number;
  };
  physicalAnalysis?: {
    speed: number;
    stamina: number;
    strength: number;
    agility: number;
  };
  recommendation: 'Contratar' | 'Monitorar' | 'Descartar';
  notes: string;
}

// ============================================
// TIPOS DE MENSAGENS
// ============================================

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  content: string;
  status: MessageStatus;
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  userId: string;
  userName: string;
  userRole: UserRole;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface SendMessageData {
  receiverId: string;
  content: string;
}

// ============================================
// TIPOS DE NOTIFICAÇÕES
// ============================================

export type NotificationType = 
  | 'new_player' 
  | 'new_report' 
  | 'report_status' 
  | 'new_message' 
  | 'player_updated'
  | 'scout_assigned'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    playerId?: string;
    reportId?: string;
    senderId?: string;
    [key: string]: any;
  };
  createdAt: string;
  readAt?: string;
}

// ============================================
// TIPOS DE ATIVIDADES
// ============================================

export type ActivityType = 
  | 'player_added' 
  | 'report_submitted' 
  | 'player_updated' 
  | 'scout_joined'
  | 'report_reviewed';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userRole: UserRole;
  description: string;
  metadata?: {
    playerId?: string;
    playerName?: string;
    reportId?: string;
    [key: string]: any;
  };
  createdAt: string;
}

// ============================================
// TIPOS DE DASHBOARD
// ============================================

export interface DashboardStats {
  totalPlayers: number;
  totalReports: number;
  activeScouts: number;
  pendingReports: number;
  playersThisMonth: number;
  reportsThisMonth: number;
  playersInHigh: number;
  playersInLow: number;
}

// ============================================
// TIPOS DE RESPOSTA DE API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// ============================================
// TIPOS DE FILTROS E QUERIES
// ============================================

export interface PlayerFilters {
  status?: PlayerStatus[];
  position?: PlayerPosition[];
  ageMin?: number;
  ageMax?: number;
  club?: string;
  createdBy?: string;
  search?: string;
}

export interface ReportFilters {
  playerId?: string;
  scoutId?: string;
  status?: ReportStatus[];
  type?: ReportType[];
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
