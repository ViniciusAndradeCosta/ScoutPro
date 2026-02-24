package br.edu.ufop.web.scoutpro.enums;

public enum Position {
    // Posições em Português (Exatamente como estão no seu AddPlayerForm.tsx)
    GOLEIRO,
    LATERAL_DIREITO,
    LATERAL_ESQUERDO,
    ZAGUEIRO,
    VOLANTE,
    MEIO_CAMPO,
    MEIA_ATACANTE,
    PONTA_DIREITA,
    PONTA_ESQUERDA,
    ATACANTE,
    CENTROAVANTE,

    // Posições em Inglês (Mantidas para os jogadores antigos que já estão na base de dados)
    GOALKEEPER,
    DEFENDER,
    MIDFIELDER,
    FORWARD
}