<p align="center">
<img src="https://capsule-render.vercel.app/api?type=venom&height=260&color=0:020617,50:1e3a8a,100:16a34a&text=ScoutPro&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=40"/>
</p>

<p align="center">
⚽ <strong>Sistema de Gestão e Análise de Scouting Esportivo</strong>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Disciplina-CSI606-14532d?style=for-the-badge">
<img src="https://img.shields.io/badge/Semestre-2025%2F01-14532d?style=for-the-badge">
<img src="https://img.shields.io/badge/Status-Concluído-14532d?style=for-the-badge">
</p>

<p align="center">
👨‍🎓 <strong>Discente:</strong> Vinícius Andrade Costa
</p>

---

# ⚽ ScoutPro

O **ScoutPro** é uma plataforma web desenvolvida para apoiar **olheiros, analistas e administradores de clubes de futebol** na gestão e análise de desempenho de jogadores.

O sistema centraliza **dados técnicos, físicos e relatórios de scouting**, permitindo uma análise mais estruturada do potencial e desempenho dos atletas.

A aplicação foi construída utilizando uma arquitetura **Full Stack**, integrando backend, frontend e banco de dados.

---

# 🧩 Arquitetura da aplicação

O sistema foi desenvolvido seguindo uma arquitetura moderna baseada em separação de camadas.


Frontend
React + TypeScript + Vite

⬇

Backend
Spring Boot (API REST)

⬇

Banco de Dados
PostgreSQL


Essa estrutura permite maior **organização, escalabilidade e manutenção do sistema**.

---

# 🏟️ Funcionalidades Implementadas

## 👤 Gestão de Jogadores

- Cadastro de jogadores
- Informações físicas e técnicas
- Histórico esportivo
- Atualização e remoção de dados

---

## 📊 Relatórios de Scouting

- Criação de relatórios técnicos
- Avaliação de desempenho
- Registro de observações do olheiro
- Visualização detalhada dos atletas

---

## 🧑‍💼 Painel Administrativo

- Gestão de clubes
- Gestão de olheiros
- Visualização de relatórios
- Controle de usuários

---

## 🌐 Interface Web

- Navegação fluida
- Interface responsiva
- Comunicação com API REST
- Experiência otimizada para análise de dados

---

# 🚧 Funcionalidades Previstas

Algumas funcionalidades foram planejadas para futuras versões do sistema:

- Integração com **APIs de partidas em tempo real**
- Exportação de relatórios em **PDF ou Excel**
- Dashboard analítico com estatísticas de jogadores
- Visualização comparativa entre atletas

---

# ⚙️ Outras Funcionalidades Implementadas

- Sistema de **autenticação e autorização**
- API RESTful estruturada
- Comunicação entre frontend e backend
- Estrutura modular para futuras expansões

---

# ⚠️ Principais Desafios

Durante o desenvolvimento do projeto alguns desafios foram enfrentados:

### 🔗 Integração Full Stack

Integração entre:

- **Backend:** Spring Boot
- **Frontend:** React + TypeScript

---

### 🗄️ Modelagem de Banco de Dados

Definir relacionamentos entre:

- jogadores
- relatórios
- avaliações
- histórico esportivo

---

### 🎛️ Gestão de Estado no Frontend

Gerenciamento de formulários complexos para cadastro e avaliação de atletas.

---

# 🚀 Instalação e Execução

## 🔧 Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Docker + Docker Compose
- Java JDK 17+
- Node.js + npm ou yarn

---

# 🗄️ Banco de Dados (Docker)

1️⃣ Acesse o diretório do backend.

2️⃣ Execute o comando:

```bash
docker compose up -d
```
### Configurações PostgreSQL
```bash
Database: scoutpro

Usuário: pgsql-scoutpro-master
Senha: pgsql-scoutpro-password
Porta: 5432
pgAdmin
URL: http://localhost:8124

Email: scoutpro@web.edu.br
Senha: 123456
```
---
# ☕ Backend (Spring Boot)

Verifique o arquivo:
```bash
application.properties
ou
application.yml
```
Certifique-se de que as credenciais do banco estão corretas.

Execute:
```bash
./mvnw spring-boot:run
```
Ou rode diretamente pela IDE.

Porta padrão:
```bash
http://localhost:8080
```
---
# 💻 Frontend (React + Vite)

Acesse a pasta do frontend.

Instale as dependências:
```bash
npm install

Execute a aplicação:

npm run dev
```
Abra no navegador:
```bash
http://localhost:5173
```
---
# 🛠️ Tecnologias Utilizadas
### Backend
- Spring Boot
- Java
- API REST
### Frontend
- React
- TypeScript
- Vite
### Banco de Dados
- PostgreSQL
- pgAdmin
### Infraestrutura
- Docker
- Docker Compose

---

# 📚 Referências

Spring Boot
https://spring.io/projects/spring-boot

React
https://react.dev/

Vite
https://vitejs.dev/

Docker
https://docs.docker.com/
