/**
 * Lista de jogadores favoritos do olheiro, persistida em localStorage.
 * (Antes ficava só em memória e era perdida ao trocar de página ou recarregar.)
 */

const STORAGE_KEY = 'scoutpro_favorites';

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

/** Adiciona/remove um id e devolve a lista atualizada. */
export function toggleFavorite(id: string): string[] {
  const current = getFavorites();
  const next = current.includes(id)
    ? current.filter((favId) => favId !== id)
    : [...current, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
