-- scout-pro/database/tables.sql

-- Criação das tabelas para o banco de dados Scout Pro
SET search_path TO public;

-- Tabela de Usuários (para Olheiros e Administradores)
CREATE TABLE IF NOT EXISTS users (
    id_user SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'scout' ou 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Jogadores (Unificada com Estatísticas e Atributos)
CREATE TABLE IF NOT EXISTS players (
    id_player SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(100),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    dominant_foot VARCHAR(20),
    position VARCHAR(50),
    club VARCHAR(100),
    previous_club VARCHAR(100),
    contract_end DATE,
    phone VARCHAR(50),
    email VARCHAR(100),
    notes TEXT,
    image TEXT, -- Alterado para TEXT para suportar imagens Base64 longas
    rating DECIMAL(3,1),
    is_favorite BOOLEAN DEFAULT FALSE,
    added_by INT, -- Referência ao ID de quem adicionou o jogador
    
    -- Estatísticas Básicas (Unificadas)
    matches_played INT DEFAULT 0,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,

    -- Atributos (Unificados)
    finishing INT DEFAULT 50,
    dribbling INT DEFAULT 50,
    positioning INT DEFAULT 50,
    pace INT DEFAULT 50,
    strength INT DEFAULT 50,
    stamina INT DEFAULT 50,
    passing INT DEFAULT 50,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar chave estrangeira para 'added_by' na tabela 'players'
ALTER TABLE players
ADD CONSTRAINT fk_added_by
FOREIGN KEY (added_by)
REFERENCES users(id_user)
ON DELETE SET NULL;

-- Tabela de Relatórios de Scouting
CREATE TABLE IF NOT EXISTS reports (
    id_report SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id_player) ON DELETE CASCADE,
    scout_id INT REFERENCES users(id_user) ON DELETE CASCADE,
    analysis TEXT,
    strengths TEXT,
    weaknesses TEXT,
    recommendation TEXT,
    match_context TEXT,
    overall_rating DECIMAL(3,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Mensagens (para comunicação entre olheiros e administradores)
CREATE TABLE IF NOT EXISTS messages (
    id_message SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id_user) ON DELETE CASCADE,
    receiver_id INT REFERENCES users(id_user) ON DELETE CASCADE,
    player_id INT REFERENCES players(id_player) ON DELETE SET NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);