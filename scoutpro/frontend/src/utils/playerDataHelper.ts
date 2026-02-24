export interface DetailedStats {
  // Ataque
  finishing: number;
  shotPower: number;
  longShots: number;
  volleys: number;
  penalties: number;
  
  // Habilidade
  dribbling: number;
  ballControl: number;
  acceleration: number;
  sprintSpeed: number;
  agility: number;
  
  // Movimento
  positioning: number;
  vision: number;
  crossing: number;
  freeKick: number;
  shortPassing: number;
  longPassing: number;
  
  // Defesa
  marking: number;
  standingTackle: number;
  slidingTackle: number;
  interceptions: number;
  
  // Físico
  strength: number;
  stamina: number;
  jumping: number;
  
  // Mental
  aggression: number;
  composure: number;
  reactions: number;
}

export function generateDetailedStats(position: string, overallRating: number): DetailedStats {
  const baseVariation = () => (Math.random() * 2 - 1) * 1.5; // -1.5 to +1.5 variation
  const base = overallRating / 10; // Convert 85 to 8.5

  if (position === 'Atacante') {
    return {
      finishing: Math.min(10, Math.max(1, base + 1 + baseVariation())),
      shotPower: Math.min(10, Math.max(1, base + 0.8 + baseVariation())),
      longShots: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      volleys: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      penalties: Math.min(10, Math.max(1, base + 0.6 + baseVariation())),
      
      dribbling: Math.min(10, Math.max(1, base + 0.9 + baseVariation())),
      ballControl: Math.min(10, Math.max(1, base + 0.7 + baseVariation())),
      acceleration: Math.min(10, Math.max(1, base + 1 + baseVariation())),
      sprintSpeed: Math.min(10, Math.max(1, base + 0.9 + baseVariation())),
      agility: Math.min(10, Math.max(1, base + 0.8 + baseVariation())),
      
      positioning: Math.min(10, Math.max(1, base + 0.7 + baseVariation())),
      vision: Math.min(10, Math.max(1, base + 0.4 + baseVariation())),
      crossing: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      freeKick: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      shortPassing: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      longPassing: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      
      marking: Math.min(10, Math.max(1, base - 1.5 + baseVariation())),
      standingTackle: Math.min(10, Math.max(1, base - 1.8 + baseVariation())),
      slidingTackle: Math.min(10, Math.max(1, base - 2 + baseVariation())),
      interceptions: Math.min(10, Math.max(1, base - 1.2 + baseVariation())),
      
      strength: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      stamina: Math.min(10, Math.max(1, base + 0.6 + baseVariation())),
      jumping: Math.min(10, Math.max(1, base + 0.4 + baseVariation())),
      
      aggression: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      composure: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      reactions: Math.min(10, Math.max(1, base + 0.7 + baseVariation())),
    };
  } else if (position === 'Meio-campo') {
    return {
      finishing: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      shotPower: Math.min(10, Math.max(1, base + 0.4 + baseVariation())),
      longShots: Math.min(10, Math.max(1, base + 0.6 + baseVariation())),
      volleys: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      penalties: Math.min(10, Math.max(1, base + 0.1 + baseVariation())),
      
      dribbling: Math.min(10, Math.max(1, base + 0.8 + baseVariation())),
      ballControl: Math.min(10, Math.max(1, base + 0.9 + baseVariation())),
      acceleration: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      sprintSpeed: Math.min(10, Math.max(1, base + 0.4 + baseVariation())),
      agility: Math.min(10, Math.max(1, base + 0.7 + baseVariation())),
      
      positioning: Math.min(10, Math.max(1, base + 0.9 + baseVariation())),
      vision: Math.min(10, Math.max(1, base + 1.2 + baseVariation())),
      crossing: Math.min(10, Math.max(1, base + 0.6 + baseVariation())),
      freeKick: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      shortPassing: Math.min(10, Math.max(1, base + 1.1 + baseVariation())),
      longPassing: Math.min(10, Math.max(1, base + 0.9 + baseVariation())),
      
      marking: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      standingTackle: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      slidingTackle: Math.min(10, Math.max(1, base + 0.1 + baseVariation())),
      interceptions: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      
      strength: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      stamina: Math.min(10, Math.max(1, base + 1 + baseVariation())),
      jumping: Math.min(10, Math.max(1, base + 0.1 + baseVariation())),
      
      aggression: Math.min(10, Math.max(1, base + 0.1 + baseVariation())),
      composure: Math.min(10, Math.max(1, base + 0.8 + baseVariation())),
      reactions: Math.min(10, Math.max(1, base + 0.6 + baseVariation())),
    };
  } else if (position === 'Defesa') {
    return {
      finishing: Math.min(10, Math.max(1, base - 1.5 + baseVariation())),
      shotPower: Math.min(10, Math.max(1, base - 1 + baseVariation())),
      longShots: Math.min(10, Math.max(1, base - 1.3 + baseVariation())),
      volleys: Math.min(10, Math.max(1, base - 1.2 + baseVariation())),
      penalties: Math.min(10, Math.max(1, base - 0.8 + baseVariation())),
      
      dribbling: Math.min(10, Math.max(1, base - 0.5 + baseVariation())),
      ballControl: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      acceleration: Math.min(10, Math.max(1, base + 0.4 + baseVariation())),
      sprintSpeed: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      agility: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      
      positioning: Math.min(10, Math.max(1, base + 1 + baseVariation())),
      vision: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      crossing: Math.min(10, Math.max(1, base - 0.3 + baseVariation())),
      freeKick: Math.min(10, Math.max(1, base - 0.5 + baseVariation())),
      shortPassing: Math.min(10, Math.max(1, base + 0.4 + baseVariation())),
      longPassing: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      
      marking: Math.min(10, Math.max(1, base + 1.2 + baseVariation())),
      standingTackle: Math.min(10, Math.max(1, base + 1.3 + baseVariation())),
      slidingTackle: Math.min(10, Math.max(1, base + 1.1 + baseVariation())),
      interceptions: Math.min(10, Math.max(1, base + 1 + baseVariation())),
      
      strength: Math.min(10, Math.max(1, base + 1.1 + baseVariation())),
      stamina: Math.min(10, Math.max(1, base + 0.6 + baseVariation())),
      jumping: Math.min(10, Math.max(1, base + 0.9 + baseVariation())),
      
      aggression: Math.min(10, Math.max(1, base + 0.6 + baseVariation())),
      composure: Math.min(10, Math.max(1, base + 0.7 + baseVariation())),
      reactions: Math.min(10, Math.max(1, base + 0.8 + baseVariation())),
    };
  } else { // Goleiro
    return {
      finishing: Math.min(10, Math.max(1, base - 3 + baseVariation())),
      shotPower: Math.min(10, Math.max(1, base - 2.5 + baseVariation())),
      longShots: Math.min(10, Math.max(1, base - 2.8 + baseVariation())),
      volleys: Math.min(10, Math.max(1, base - 3 + baseVariation())),
      penalties: Math.min(10, Math.max(1, base - 2 + baseVariation())),
      
      dribbling: Math.min(10, Math.max(1, base - 1.5 + baseVariation())),
      ballControl: Math.min(10, Math.max(1, base - 1 + baseVariation())),
      acceleration: Math.min(10, Math.max(1, base - 0.5 + baseVariation())),
      sprintSpeed: Math.min(10, Math.max(1, base - 0.7 + baseVariation())),
      agility: Math.min(10, Math.max(1, base + 0.8 + baseVariation())),
      
      positioning: Math.min(10, Math.max(1, base + 1.1 + baseVariation())),
      vision: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      crossing: Math.min(10, Math.max(1, base - 1 + baseVariation())),
      freeKick: Math.min(10, Math.max(1, base - 1.2 + baseVariation())),
      shortPassing: Math.min(10, Math.max(1, base - 0.5 + baseVariation())),
      longPassing: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      
      marking: Math.min(10, Math.max(1, base + 0.5 + baseVariation())),
      standingTackle: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      slidingTackle: Math.min(10, Math.max(1, base + 0.2 + baseVariation())),
      interceptions: Math.min(10, Math.max(1, base + 0.9 + baseVariation())),
      
      strength: Math.min(10, Math.max(1, base + 0.7 + baseVariation())),
      stamina: Math.min(10, Math.max(1, base + 0.4 + baseVariation())),
      jumping: Math.min(10, Math.max(1, base + 1 + baseVariation())),
      
      aggression: Math.min(10, Math.max(1, base + 0.3 + baseVariation())),
      composure: Math.min(10, Math.max(1, base + 1.2 + baseVariation())),
      reactions: Math.min(10, Math.max(1, base + 1.3 + baseVariation())),
    };
  }
}
