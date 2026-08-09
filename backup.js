// backup.js - Sistema de Backup Automático

// ===== CONFIGURAÇÕES =====
const BACKUP_KEY = 'cidade_real_backup';
const ULTIMO_BACKUP_KEY = 'cidade_real_ultimo_backup';

// ===== FUNÇÃO PARA SALVAR TODOS OS DADOS =====
function salvarBackup() {
    try {
        const dados = {
            fiscalizacao_carros: localStorage.getItem('fiscalizacao_carros'),
            fiscalizacao_viagens: localStorage.getItem('fiscalizacao_viagens'),
            fiscalizacao_trocas: localStorage.getItem('fiscalizacao_trocas'),
            ocorrencias_completas: localStorage.getItem('ocorrencias_completas'),
            data_backup: new Date().toISOString(),
            versao: '1.0'
        };
        
        localStorage.setItem(BACKUP_KEY, JSON.stringify(dados));
        localStorage.setItem(ULTIMO_BACKUP_KEY, new Date().toLocaleString('pt-BR'));
        
        console.log('✅ Backup automático realizado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao fazer backup:', error);
        return false;
    }
}

// ===== FUNÇÃO PARA RESTAURAR BACKUP =====
function restaurarBackup() {
    try {
        const backupStr = localStorage.getItem(BACKUP_KEY);
        if (!backupStr) {
            console.log('ℹ️ Nenhum backup encontrado');
            return false;
        }
        
        const dados = JSON.parse(backupStr);
        
        // Restaurar cada dado
        if (dados.fiscalizacao_carros) {
            localStorage.setItem('fiscalizacao_carros', dados.fiscalizacao_carros);
        }
        if (dados.fiscalizacao_viagens) {
            localStorage.setItem('fiscalizacao_viagens', dados.fiscalizacao_viagens);
        }
        if (dados.fiscalizacao_trocas) {
            localStorage.setItem('fiscalizacao_trocas', dados.fiscalizacao_trocas);
        }
        if (dados.ocorrencias_completas) {
            localStorage.setItem('ocorrencias_completas', dados.ocorrencias_completas);
        }
        
        console.log('✅ Backup restaurado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao restaurar backup:', error);
        return false;
    }
}

// ===== FUNÇÃO PARA EXPORTAR BACKUP (DOWNLOAD) =====
function exportarBackup() {
    try {
        const dados = {
            fiscalizacao_carros: JSON.parse(localStorage.getItem('fiscalizacao_carros') || '[]'),
            fiscalizacao_viagens: JSON.parse(localStorage.getItem('fiscalizacao_viagens') || '[]'),
            fiscalizacao_trocas: JSON.parse(localStorage.getItem('fiscalizacao_trocas') || '[]'),
            ocorrencias_completas: JSON.parse(localStorage.getItem('ocorrencias_completas') || '[]'),
            data_exportacao: new Date().toISOString(),
            versao: '1.0',
            total_registros: {
                carros: JSON.parse(localStorage.getItem('fiscalizacao_carros') || '[]').length,
                viagens: JSON.parse(localStorage.getItem('fiscalizacao_viagens') || '[]').length,
                trocas: JSON.parse(localStorage.getItem('fiscalizacao_trocas') || '[]').length,
                ocorrencias: JSON.parse(localStorage.getItem('ocorrencias_completas') || '[]').length
            }
        };
        
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_cidade_real_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Backup exportado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao exportar backup:', error);
        alert('❌ Erro ao exportar backup');
        return false;
    }
}

// ===== FUNÇÃO PARA IMPORTAR BACKUP =====
function importarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            
            // Confirmar importação
            const total = dados.total_registros || {};
            const mensagem = `📋 Dados encontrados no backup:
            
🚌 Carros: ${total.carros || 0}
🚫 Viagens Perdidas: ${total.viagens || 0}
🔄 Trocas: ${total.trocas || 0}
📝 Ocorrências: ${total.ocorrencias || 0}

⚠️ ATENÇÃO: Isso substituirá todos os dados atuais!
Continuar?`;
            
            if (!confirm(mensagem)) return;
            
            // Restaurar dados
            if (dados.fiscalizacao_carros) {
                localStorage.setItem('fiscalizacao_carros', JSON.stringify(dados.fiscalizacao_carros));
            }
            if (dados.fiscalizacao_viagens) {
                localStorage.setItem('fiscalizacao_viagens', JSON.stringify(dados.fiscalizacao_viagens));
            }
            if (dados.fiscalizacao_trocas) {
                localStorage.setItem('fiscalizacao_trocas', JSON.stringify(dados.fiscalizacao_trocas));
            }
            if (dados.ocorrencias_completas) {
                localStorage.setItem('ocorrencias_completas', JSON.stringify(dados.ocorrencias_completas));
            }
            
            // Salvar backup automático
            salvarBackup();
            
            alert('✅ Backup importado com sucesso!');
            
            // Recarregar a página para aplicar os dados
            if (confirm('Recarregar a página para ver os dados importados?')) {
                location.reload();
            }
        } catch (error) {
            console.error('❌ Erro ao importar backup:', error);
            alert('❌ Arquivo inválido!');
        }
    };
    reader.readAsText(file);
}

// ===== BACKUP AUTOMÁTICO =====
// Salvar backup a cada 5 minutos
setInterval(function() {
    salvarBackup();
}, 300000); // 5 minutos

// Salvar backup ao fechar a página
window.addEventListener('beforeunload', function() {
    salvarBackup();
});

// Salvar backup quando o usuário interagir com dados
document.addEventListener('click', function() {
    // Salvar backup após qualquer clique (com debounce)
    clearTimeout(window._backupTimeout);
    window._backupTimeout = setTimeout(function() {
        salvarBackup();
    }, 5000);
});

// ===== VERIFICAR BACKUP AO CARREGAR =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se existe backup e se os dados estão corrompidos
    const backup = localStorage.getItem(BACKUP_KEY);
    const ultimoBackup = localStorage.getItem(ULTIMO_BACKUP_KEY);
    
    if (backup) {
        console.log(`✅ Backup encontrado - Último: ${ultimoBackup || 'N/A'}`);
    } else {
        console.log('ℹ️ Nenhum backup encontrado - Criando primeiro backup...');
        salvarBackup();
    }
});

// ===== FUNÇÃO PARA VERIFICAR INTEGRIDADE DOS DADOS =====
function verificarIntegridadeDados() {
    const dados = {
        carros: localStorage.getItem('fiscalizacao_carros'),
        viagens: localStorage.getItem('fiscalizacao_viagens'),
        trocas: localStorage.getItem('fiscalizacao_trocas'),
        ocorrencias: localStorage.getItem('ocorrencias_completas')
    };
    
    let ok = true;
    for (let key in dados) {
        if (dados[key]) {
            try {
                JSON.parse(dados[key]);
                console.log(`✅ ${key}: OK`);
            } catch (e) {
                console.error(`❌ ${key}: CORROMPIDO`);
                ok = false;
            }
        }
    }
    return ok;
}

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.salvarBackup = salvarBackup;
window.restaurarBackup = restaurarBackup;
window.exportarBackup = exportarBackup;
window.importarBackup = importarBackup;
window.verificarIntegridadeDados = verificarIntegridadeDados;
