# 🚌 Cidade Real - Sistema de Gestão Operacional

## 📋 Sobre o Sistema

O **Cidade Real** é um sistema completo de gestão operacional para empresas de transporte urbano, desenvolvido para otimizar o controle de fiscalização, registro de ocorrências, gestão de colaboradores e geração de relatórios.

### 👨‍💻 Desenvolvido por
**Tiago Gazzoni Tagliabui**  
TgT Análise Desenvolvimento de Sistemas  
© 2026 - Todos os direitos reservados

---

## 🎯 Funcionalidades

### 🔐 Autenticação e Segurança
- Login seguro com matrícula e senha pessoal
- Primeiro acesso com cadastro de senha
- Recuperação de senha via matrícula
- Diferentes níveis de acesso (Gestor, Fiscalização, Instrutor)
- Painel administrativo com senha master

### 👥 Gestão de Colaboradores (Admin)
- Cadastro de novos colaboradores
- Listagem completa com filtros
- Ativação/Desativação de usuários
- Reset de senha
- Exportação de dados em JSON
- Estatísticas em tempo real

### 📊 Módulo de Fiscalização
- Cadastro de escala de carros com motoristas
- Registro de viagens perdidas
- Registro de trocas de carros
- Interface com abas separadas por funcionalidade
- Dados salvos localmente (localStorage)

### 📝 Módulo de Ocorrências (Instrutor)
- Registro completo de ocorrências operacionais
- Dados de motoristas e veículos envolvidos
- Vítimas, danos e testemunhas
- Múltiplos veículos por ocorrência
- Histórico completo com filtros
- Geração de PDF individual

### 🎛️ Painel do Gestor
- Visão geral do sistema com estatísticas
- Acesso a todos os dados de fiscalização
- Visualização completa de ocorrências
- Central de mensagens entre usuários
- Geração de relatórios gerenciais
- Filtros avançados

### 📄 Relatórios e PDFs
- Relatório geral do sistema
- Relatório de fiscalização (escala, viagens perdidas, trocas)
- Relatório de ocorrências (completo e resumo)
- Relatório de colaboradores
- Exportação em PDF com formatação profissional

### 💬 Comunicação
- Sistema de mensagens internas
- Envio para colaboradores específicos ou todos
- Marcação de mensagens como lidas
- Histórico completo de mensagens

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização responsiva |
| JavaScript (ES6+) | Lógica do sistema |
| IndexedDB | Armazenamento de colaboradores |
| localStorage | Dados de fiscalização e ocorrências |
| jsPDF | Geração de relatórios PDF |
| jsPDF-AutoTable | Tabelas nos PDFs |

---

## 📁 Estrutura de Arquivos
