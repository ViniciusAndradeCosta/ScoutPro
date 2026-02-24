/**
 * Exportações centralizadas de todos os serviços
 * 
 * Importe os serviços necessários a partir deste arquivo:
 * import { authService, playerService } from '../services';
 */

export { authService } from './authService';
export { playerService } from './playerService';
export { reportService } from './reportService';
export { messageService } from './messageService';
export { scoutService, activityService, dashboardService } from './scoutService';

// Re-exportar tipos comuns
export type * from '../types';
