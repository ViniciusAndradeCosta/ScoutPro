<h1 align="center">
  ⚽ ScoutPro
</h1>

<p align="center">
  <strong>Sistema de Gestão e Análise de Scouting Esportivo</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/DISCIPLINA-CSI606-blue?style=for-the-badge&logo=university" alt="Disciplina CSI606">
  <img src="https://img.shields.io/badge/SEMESTRE-2025%2F01-green?style=for-the-badge" alt="Semestre 2025/01">
  <img src="https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-orange?style=for-the-badge" alt="Status">
</p>

<p align="center">
  <strong>Discente:</strong> Vinícius Andrade Costa
</p>

---
# CSI606-2024-02 - Remoto - Trabalho Final - Resultados

## Resumo

O presente trabalho apresenta o **ScoutPro**, um sistema web desenvolvido para auxiliar olheiros de futebol e administradores de clubes. O principal objetivo da aplicação é gerir dados de jogadores e centralizar relatórios de desempenho, otimizando o processo de análise técnica, tática e estatística de atletas. A solução foi construída através de uma arquitetura full-stack.

## 1. Funcionalidades implementadas

* Cadastro e gestão de jogadores (informações técnicas, físicas e histórico).
* Criação, edição e visualização de relatórios de desempenho detalhados pelos olheiros.
* Painel administrativo para a gestão do clube e dos utilizadores (olheiros) cadastrados.
* Interface web interativa e navegação fluida entre os módulos do sistema.

## 2. Funcionalidades previstas e não implementadas

* *[Adicione aqui funcionalidades que planeou inicialmente, como alertas automáticos ou integrações com APIs externas de partidas, mas que não entraram na versão final]*
* Exportação massiva de relatórios de scout em PDF/Excel.

## 3. Outras funcionalidades implementadas

* Sistema de controlo de acesso (autenticação e autorização).
* Desenvolvimento de uma API RESTful padronizada no backend.
* Responsividade na interface de utilizador.

## 4. Principais desafios e dificuldades

* Integração entre o backend em Java (Spring Boot) e a interface do utilizador em React (TypeScript/Vite).
* Modelação da base de dados para relacionar eficientemente as avaliações dos olheiros com o histórico e as métricas de cada jogador.
* Gestão de estado no frontend para garantir que os formulários complexos de avaliação desportiva funcionassem sem falhas.

## 5. Instruções para instalação e execução

**Pré-requisitos:**
* Java (JDK 17 ou superior)
* Node.js e gestor de pacotes (npm/yarn)
* Base de dados configurada (PostgreSQL, MySQL, etc.)

**Passo a passo para o Backend (Spring Boot):**
1. Abra um terminal e navegue até ao diretório do backend.
2. Certifique-se de que configura as variáveis de ambiente e credenciais da base de dados no ficheiro `application.properties` (ou `.yml`).
3. Execute o projeto usando o Maven ou diretamente pela sua IDE (ex: `./mvnw spring-boot:run`). O servidor iniciará por padrão na porta 8080.

**Passo a passo para o Frontend (React/Vite):**
1. Abra outro terminal e navegue até ao diretório do frontend.
2. Execute o comando `npm install` (ou `yarn`) para instalar todas as dependências.
3. Execute `npm run dev` (ou `yarn dev`) para rodar o servidor local.
4. Aceda ao sistema pelo navegador através da porta indicada no terminal (geralmente `http://localhost:5173`).

## 6. Referências

* Documentação Oficial do Spring Boot: https://spring.io/projects/spring-boot
* Documentação Oficial do React: https://react.dev/
* Documentação do Vite: https://vitejs.dev/

[![Acessar Protótipo no Figma](https://img.shields.io/badge/Figma-Acessar%20Layout-black?style=for-the-badge&logo=figma)](https://www.figma.com/make/5ByncZFogmFCyt2MCXITwd/Layout-ScoutPro-Web-I?t=PDTTtIItFj37U7o8-20&fullscreen=1)

</div>
