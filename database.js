// database.js - Banco de dados centralizado para todo o sistema
let db = null;

// Inicializar banco de dados
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CidadeRealDB', 8);
    
    request.onerror = () => reject('Erro ao abrir banco de dados');
    
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Banco de dados conectado');
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Colaboradores
      if (!db.objectStoreNames.contains('colaboradores')) {
        const store = db.createObjectStore('colaboradores', { keyPath: 'matricula' });
        store.createIndex('matricula', 'matricula', { unique: true });
        store.createIndex('tipo', 'tipo', { unique: false });
        
        const colaboradoresPadrao = [
          { matricula: "2024001", senha: null, nome: "Carlos Eduardo Silva", tipo: "gestor", pagina: "gestor.html", cargo: "Gestor Geral", primeiroAcesso: true, ativo: true, dataCadastro: new Date().toISOString() },
          { matricula: "2024002", senha: null, nome: "Mariana Oliveira Santos", tipo: "fiscalizacao", pagina: "fiscalizacao.html", cargo: "Fiscal de Operações", primeiroAcesso: true, ativo: true, dataCadastro: new Date().toISOString() },
          { matricula: "2024003", senha: null, nome: "Roberto Almeida Costa", tipo: "instrutor", pagina: "instrucao.html", cargo: "Instrutor de Campo", primeiroAcesso: true, ativo: true, dataCadastro: new Date().toISOString() },
          { matricula: "2024004", senha: null, nome: "Fernanda Lima Rocha", tipo: "gestor", pagina: "gestor.html", cargo: "Coordenadora Administrativa", primeiroAcesso: true, ativo: true, dataCadastro: new Date().toISOString() }
        ];
        
        const transaction = db.transaction(['colaboradores'], 'readwrite');
        const userStore = transaction.objectStore('colaboradores');
        colaboradoresPadrao.forEach(user => userStore.add(user));
      }
      
      // Fiscalização - Escala de Carros
      if (!db.objectStoreNames.contains('fiscalizacao_carros')) {
        db.createObjectStore('fiscalizacao_carros', { keyPath: 'id', autoIncrement: true });
      }
      
      // Fiscalização - Viagens Perdidas
      if (!db.objectStoreNames.contains('fiscalizacao_viagens')) {
        db.createObjectStore('fiscalizacao_viagens', { keyPath: 'id', autoIncrement: true });
      }
      
      // Fiscalização - Trocas
      if (!db.objectStoreNames.contains('fiscalizacao_trocas')) {
        db.createObjectStore('fiscalizacao_trocas', { keyPath: 'id', autoIncrement: true });
      }
      
      // Ocorrências do Instrutor
      if (!db.objectStoreNames.contains('ocorrencias')) {
        db.createObjectStore('ocorrencias', { keyPath: 'id', autoIncrement: true });
      }
      
      // Mensagens
      if (!db.objectStoreNames.contains('mensagens')) {

  const msgStore = db.createObjectStore('mensagens', {
    keyPath: 'id',
    autoIncrement: true
  });

  msgStore.createIndex('destinatario', 'destinatario', {
    unique: false
  });

  msgStore.createIndex('lida', 'lida', {
    unique: false
  });
}
      
      // Boletins
      if (!db.objectStoreNames.contains('logs_email')) {

  db.createObjectStore('logs_email', {
    keyPath: 'id',
    autoIncrement: true
  });

}
      
      console.log('Banco de dados inicializado com sucesso');
    };
  });
}

// Funções genéricas CRUD
async function getStoreData(storeName) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco não inicializado');
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject('Erro ao buscar dados');
  });
}

async function addToStore(storeName, data) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco não inicializado');
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Erro ao adicionar');
  });
}

async function updateInStore(storeName, data) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco não inicializado');
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject('Erro ao atualizar');
  });
}

async function deleteFromStore(storeName, id) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco não inicializado');
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject('Erro ao deletar');
  });
}

async function clearStore(storeName) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco não inicializado');
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject('Erro ao limpar');
  });
}

// Funções específicas
async function buscarColaborador(matricula) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco não inicializado');
    const transaction = db.transaction(['colaboradores'], 'readonly');
    const store = transaction.objectStore('colaboradores');
    const request = store.get(matricula);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Erro ao buscar colaborador');
  });
}

async function salvarColaborador(colaborador) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['colaboradores'], 'readwrite');
    const store = transaction.objectStore('colaboradores');
    const request = store.put(colaborador);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject('Erro ao salvar');
  });
}

async function getAllColaboradores() {
  return getStoreData('colaboradores');
}

async function getMensagensByDestinatario(destinatario) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco não inicializado');
    const transaction = db.transaction(['mensagens'], 'readonly');
    const store = transaction.objectStore('mensagens');
    const index = store.index('destinatario');
    const request = index.getAll(destinatario);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject('Erro ao buscar mensagens');
  });
}

async function enviarMensagem(remetente, destinatario, titulo, mensagem) {
  const novaMensagem = {
    remetente,
    destinatario,
    titulo,
    mensagem,
    data: new Date().toLocaleString('pt-BR'),
    lida: false,
    dataEnvio: new Date().toISOString()
  };
  return addToStore('mensagens', novaMensagem);
}

// Função para enviar PDF por email
async function enviarPDFPorEmail(email, assunto, pdfBase64, nomeArquivo) {
  // Simula envio de email - em produção, isso seria uma chamada API
  console.log(`📧 Email enviado para: ${email}`);
  console.log(`📄 Assunto: ${assunto}`);
  console.log(`📎 Anexo: ${nomeArquivo}`);
  
  // Salvar log de envio
  const logEnvio = {
    email,
    assunto,
    nomeArquivo,
    dataEnvio: new Date().toISOString(),
    status: 'enviado'
  };
  
  await addToStore('logs_email', logEnvio);
  return true;
}


// ===== BACKUP DO INDEXEDDB =====
async function exportarIndexedDB() {
    try {
        const dados = {
            colaboradores: await getStoreData('colaboradores'),
            mensagens: await getStoreData('mensagens'),
            logs_email: await getStoreData('logs_email'),
            data_exportacao: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_indexeddb_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Erro ao exportar IndexedDB:', error);
        return false;
    }
}

async function importarIndexedDB(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const dados = JSON.parse(e.target.result);
                
                if (dados.colaboradores) {
                    for (let colab of dados.colaboradores) {
                        await salvarColaborador(colab);
                    }
                }
                
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}
