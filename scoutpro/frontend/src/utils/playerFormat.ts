/**
 * Helpers compartilhados de formatação de dados de atletas.
 * Centraliza o que antes estava duplicado em ScoutDashboard/PlayersManagement.
 */

export function calculateAge(birthDateString?: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const POSITION_MAP: Record<string, string> = {
  GOALKEEPER: 'Goleiro',
  DEFENDER: 'Defensor',
  MIDFIELDER: 'Meio-campo',
  FORWARD: 'Atacante',
  GOLEIRO: 'Goleiro',
  LATERAL_DIREITO: 'Lateral Direito',
  LATERAL_ESQUERDO: 'Lateral Esquerdo',
  ZAGUEIRO: 'Zagueiro',
  VOLANTE: 'Volante',
  MEIO_CAMPO: 'Meio-campo',
  MEIA_ATACANTE: 'Meia Atacante',
  PONTA_DIREITA: 'Ponta Direita',
  PONTA_ESQUERDA: 'Ponta Esquerda',
  ATACANTE: 'Atacante',
  CENTROAVANTE: 'Centroavante',
  UNKNOWN: 'Não definida',
};

export function formatPosition(pos?: string): string {
  if (!pos) return 'Não definida';
  return (
    POSITION_MAP[pos.toUpperCase()] ||
    pos.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
}
