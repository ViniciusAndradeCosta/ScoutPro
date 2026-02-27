<h1 align="center">
  ⚽ ScoutPro
</h1>

<p align="center">
  <strong>Sistema de Gestão e Análise de Scouting Esportivo</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/DISCIPLINA-CSI606-blue?style=for-the-badge&logo=university" alt="Disciplina CSI606">
  <img src="https://img.shields.io/badge/SEMESTRE-2025%2F01-blue?style=for-the-badge" alt="Semestre 2025/01">
  <img src="https://img.shields.io/badge/STATUS-CONCLUÍDO-green?style=for-the-badge" alt="Status">
</p>

<p align="center">
  <strong>Discente:</strong> Vinícius Andrade Costa
</p>

---

# 📘 CSI606 - Trabalho Final - Resultados

## 🧾 Resumo

O presente trabalho apresenta o **ScoutPro**, um sistema web desenvolvido para auxiliar olheiros de futebol e administradores de clubes.

O principal objetivo da aplicação é gerir dados de jogadores e centralizar relatórios de desempenho, otimizando o processo de análise técnica, tática e estatística de atletas.

A solução foi construída utilizando uma arquitetura **full-stack**.

---

## ⚙️ 1. Funcionalidades implementadas

- Cadastro e gestão de jogadores (informações técnicas, físicas e histórico)
- Criação, edição e visualização de relatórios de desempenho detalhados
- Painel administrativo para gestão de clube e utilizadores (olheiros)
- Interface web interativa com navegação fluida

---

## 🚧 2. Funcionalidades previstas e não implementadas

- Integração com APIs externas de partidas em tempo real  
- Exportação de relatórios em PDF/Excel

---

## 🧩 3. Outras funcionalidades implementadas

- Sistema de autenticação e autorização
- API RESTful padronizada no backend
- Interface responsiva

---

## ⚠️ 4. Principais desafios e dificuldades

- Integração entre backend (**Spring Boot**) e frontend (**React + TypeScript + Vite**)
- Modelagem do banco de dados para relacionar avaliações e histórico dos jogadores
- Gestão de estado no frontend para formulários complexos

---

## 🚀 5. Instruções para instalação e execução

### 🔧 Pré-requisitos

- Docker e Docker Compose  
- Java JDK 17+  
- Node.js + npm ou yarn  

---

### 🗄️ Banco de Dados (Docker)

1. Navegue até o diretório do backend (onde está o `compose.yaml`)
2. Execute:

```bash
docker compose up -d
 ```

### Configurações do PostgreSQL:

```bash
Database: scoutpro

Usuário: pgsql-scoutpro-master

Senha: pgsql-scoutpro-password

Porta: 5432

pgAdmin:

URL: http://localhost:8124

Email: scoutpro@web.edu.br

Senha: 123456
 ```
### ☕ Backend (Spring Boot)
```bash
Verifique o arquivo application.properties ou .yml

Certifique-se de que as credenciais do banco estão corretas

Execute:

./mvnw spring-boot:run

Ou rode diretamente pela IDE.

Porta padrão: 8080
```
### 💻 Frontend (React + Vite)
```bash
Acesse a pasta do frontend

Instale as dependências:

npm install

Execute o projeto:

npm run dev

Acesse no navegador:

http://localhost:5173
```
📚 6. Referências

Spring Boot: https://spring.io/projects/spring-boot

React: https://react.dev/

Vite: https://vitejs.dev/

Docker: https://docs.docker.com/
