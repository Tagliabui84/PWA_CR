// Estrutura de dados
let carros = [];
let dadosViagens = [];
let dadosTrocas = [];

// Carregar dados salvos do localStorage
function carregarDadosSalvos() {
  const carrosSalvos = localStorage.getItem('fiscalizacao_carros');
  const viagensSalvas = localStorage.getItem('fiscalizacao_viagens');
  const trocasSalvas = localStorage.getItem('fiscalizacao_trocas');
  
  if (carrosSalvos) carros = JSON.parse(carrosSalvos);
  if (viagensSalvas) dadosViagens = JSON.parse(viagensSalvas);
  if (trocasSalvas) dadosTrocas = JSON.parse(trocasSalvas);
  
  atualizarListaCarros();
  atualizarTabelaViagens();
  atualizarTabelaTrocas();
}

function salvarDados() {
  localStorage.setItem('fiscalizacao_carros', JSON.stringify(carros));
  localStorage.setItem('fiscalizacao_viagens', JSON.stringify(dadosViagens));
  localStorage.setItem('fiscalizacao_trocas', JSON.stringify(dadosTrocas));
}

function voltarPagina() {
  window.history.back();
}

function sairSistema() {
  if (confirm("Deseja realmente sair do sistema?")) {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
}

// Sistema de abas
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });
}

// Alternar formulário
function initFormToggle() {
  const toggleBtn = document.getElementById('toggleFormBtn');
  const formBody = document.getElementById('formBody');
  
  if (toggleBtn && formBody) {
    toggleBtn.addEventListener('click', () => {
      formBody.classList.toggle('hidden');
      toggleBtn.classList.toggle('rotated');
    });
  }
}

// Alternar visibilidade das viagens
function toggleViagens(carroId) {
  const viagensDiv = document.getElementById(`viagens-${carroId}`);
  if (viagensDiv) {
    if (viagensDiv.style.display === 'none' || !viagensDiv.style.display) {
      viagensDiv.style.display = 'block';
    } else {
      viagensDiv.style.display = 'none';
    }
  }
}

function atualizarListaCarros() {
  const container = document.getElementById('carrosList');
  document.getElementById('escalaCount').textContent = carros.length;
  
  let totalViagens = 0;
  carros.forEach(carro => {
    totalViagens += carro.viagens.length;
  });
  document.getElementById('totalViagensCount').textContent = totalViagens;
  
  if (carros.length === 0) {
    container.innerHTML = '<div class="empty-state">🚌 Nenhum carro cadastrado. Adicione um carro acima.</div>';
    return;
  }
  
  container.innerHTML = carros.map((carro, carroIndex) => {
    const carroId = `carro_${carroIndex}_${carro.id || carroIndex}`;
    return `
    <div class="carro-card">
      <div class="carro-header">
        <div class="carro-info-grid">
          <div class="carro-info-item">
            <span class="carro-info-label">🚌 ORDEM</span>
            <span class="carro-info-value">${carro.ordem}</span>
          </div>
          <div class="carro-info-item">
            <span class="carro-info-label">📍 ITINERÁRIO</span>
            <span class="carro-info-value">${carro.itinerario}</span>
          </div>
          <div class="carro-info-item">
            <span class="carro-info-label">👨‍✈️ MOTORISTA</span>
            <span class="carro-info-value">${carro.motorista}</span>
          </div>
          <div class="carro-info-item">
            <span class="carro-info-label">🏭 SETOR</span>
            <span class="carro-info-value">${carro.setor}</span>
          </div>
          <div class="viagens-badge">
            📋 ${carro.viagens.length} viagem(ns)
          </div>
        </div>
        <div class="carro-actions">
          <button class="btn-icon btn-view" onclick="toggleViagens('${carroId}')">
            📋 Ver Viagens
          </button>
          <button class="btn-icon btn-edit" onclick="editarMotorista(${carroIndex})">
            ✏️ Editar
          </button>
          <button class="btn-icon btn-delete" onclick="removerCarro(${carroIndex})">
            🗑️ Excluir
          </button>
        </div>
      </div>
      <div id="viagens-${carroId}" class="viagens-container" style="display: none;">
        <div class="viagens-header">
          <div class="viagens-title">
            📋 VIAGENS DO CARRO ${carro.ordem}
          </div>
          <button class="btn btn-small btn-add-viagem" onclick="abrirModalAdicionarViagem(${carroIndex})">
            + Nova Viagem
          </button>
        </div>
        ${carro.viagens.length === 0 ? 
          '<div class="empty-state">Nenhuma viagem cadastrada para este carro.</div>' : 
          `<div class="viagens-table-wrapper">
            <table class="viagens-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Horário PI</th>
                  <th>Horário PV</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${carro.viagens.map((viagem, viagemIndex) => `
                  <tr>
                    <td>${viagemIndex + 1}</td>
                    <td>${viagem.horarioPI || '---'}</td>
                    <td>${viagem.horarioPV || '---'}</td>
                    <td>${viagem.obs || '-'}</td>
                    <td>
                      <button class="table-action-btn btn-edit-table" onclick="editarViagem(${carroIndex}, ${viagemIndex})">✏️</button>
                      <button class="table-action-btn btn-delete-table" onclick="removerViagem(${carroIndex}, ${viagemIndex})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>`
        }
      </div>
    </div>
  `}).join('');
  salvarDados();
}

function editarMotorista(carroIndex) {
  const carro = carros[carroIndex];
  const novoMotorista = prompt('Editar Nome do Motorista:', carro.motorista);
  if (novoMotorista !== null && novoMotorista.trim() !== '') {
    carro.motorista = novoMotorista.trim();
  }
  
  const novaMatricula = prompt('Editar Matrícula:', carro.matricula);
  if (novaMatricula !== null && novaMatricula.trim() !== '') {
    carro.matricula = novaMatricula.trim();
  }
  
  const novoSegmento = prompt('Editar Setor:', carro.setor);
  if (novoSegmento !== null && novoSegmento.trim() !== '') {
    carro.setor = novoSegmento.trim();
  }
  
  atualizarListaCarros();
  alert('Dados atualizados com sucesso!');
}

document.getElementById('novoCarroForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const ordem = document.getElementById('novoOrdemCarro').value.trim();
  const itinerario = document.getElementById('novoItinerario').value.trim();
  const motorista = document.getElementById('novoMotorista').value.trim();
  const matricula = document.getElementById('novaMatricula').value.trim();
  const setor = document.getElementById('novoSetor').value;
  
  if (!ordem || !itinerario || !motorista || !matricula || !setor) {
    alert('Preencha todos os campos!');
    return;
  }
  
  if (carros.some(c => c.ordem === ordem && c.itinerario === itinerario)) {
    alert('Este carro com este itinerário já está cadastrado!');
    return;
  }
  
  carros.push({
    id: Date.now(),
    ordem: ordem,
    itinerario: itinerario,
    motorista: motorista,
    matricula: matricula,
    setor: setor,
    dataRegistro: new Date().toISOString(),
    viagens: []
  });
  
  document.getElementById('novoOrdemCarro').value = '';
  document.getElementById('novoItinerario').value = '';
  document.getElementById('novoMotorista').value = '';
  document.getElementById('novaMatricula').value = '';
  document.getElementById('novoSetor').value = '';
  atualizarListaCarros();
  alert('Carro cadastrado com sucesso!');
});

function abrirModalAdicionarViagem(carroIndex) {
  const horarioPI = prompt('Horário PI (Ponto Inicial):\nEx: 06:00', '');
  if (horarioPI === null) return;
  
  const horarioPV = prompt('Horário PV (Ponto Final):\nEx: 06:45', '');
  if (horarioPV === null) return;
  
  const obs = prompt('Observações (opcional):', '');
  
  carros[carroIndex].viagens.push({
    horarioPI: horarioPI,
    horarioPV: horarioPV,
    obs: obs || ''
  });
  
  atualizarListaCarros();
  alert('Viagem adicionada com sucesso!');
}

function editarViagem(carroIndex, viagemIndex) {
  const viagem = carros[carroIndex].viagens[viagemIndex];
  const novoPI = prompt('Editar horário PI:', viagem.horarioPI);
  if (novoPI === null) return;
  const novoPV = prompt('Editar horário PV:', viagem.horarioPV);
  if (novoPV === null) return;
  const novaObs = prompt('Editar observações:', viagem.obs);
  
  carros[carroIndex].viagens[viagemIndex] = {
    horarioPI: novoPI,
    horarioPV: novoPV,
    obs: novaObs || ''
  };
  atualizarListaCarros();
  alert('Viagem editada com sucesso!');
}

function removerViagem(carroIndex, viagemIndex) {
  if (confirm('Remover esta viagem?')) {
    carros[carroIndex].viagens.splice(viagemIndex, 1);
    atualizarListaCarros();
  }
}

function removerCarro(carroIndex) {
  if (confirm(`Remover o carro ${carros[carroIndex].ordem} e todas as viagens?`)) {
    carros.splice(carroIndex, 1);
    atualizarListaCarros();
  }
}

function atualizarTabelaViagens() {
  const tbody = document.getElementById('viagensTableBody');
  document.getElementById('viagensCount').textContent = dadosViagens.length;
  
  if (dadosViagens.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhum registro encontrado</td></tr>';
    return;
  }
  
  tbody.innerHTML = dadosViagens.map((item, index) => `
    <tr>
      <td>${item.ordemCarro}</td>
      <td>${item.linha}</td>
      <td>${item.horarioProgramado}</td>
      <td>${item.horarioPerda}</td>
      <td>${item.motivo}</td>
      <td><button class="table-action-btn btn-delete-table" onclick="removerRegistro('viagens', ${index})">❌</button></td>
    </tr>
  `).join('');
  salvarDados();
}

function limparFormViagens() {
  document.getElementById('ordemCarroViagem').value = '';
  document.getElementById('linhaViagem').value = '';
  document.getElementById('horarioProgramado').value = '';
  document.getElementById('horarioPerda').value = '';
  document.getElementById('motivoPerda').value = '';
}

function atualizarTabelaTrocas() {
  const tbody = document.getElementById('trocasTableBody');
  document.getElementById('trocasCount').textContent = dadosTrocas.length;
  
  if (dadosTrocas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhum registro encontrado</td></tr>';
    return;
  }
  
  tbody.innerHTML = dadosTrocas.map((item, index) => `
    <tr>
      <td>${item.carroOriginal}</td>
      <td>${item.carroSubstituto}</td>
      <td>${item.linha}</td>
      <td>${item.horario}</td>
      <td>${item.motivo}</td>
      <td><button class="table-action-btn btn-delete-table" onclick="removerRegistro('trocas', ${index})">❌</button></td>
    </tr>
  `).join('');
  salvarDados();
}

function limparFormTrocas() {
  document.getElementById('carroOriginal').value = '';
  document.getElementById('carroSubstituto').value = '';
  document.getElementById('linhaTroca').value = '';
  document.getElementById('horarioTroca').value = '';
  document.getElementById('motivoTroca').value = '';
}

function removerRegistro(tipo, index) {
  if (confirm('Remover este registro?')) {
    if (tipo === 'viagens') {
      dadosViagens.splice(index, 1);
      atualizarTabelaViagens();
    } else if (tipo === 'trocas') {
      dadosTrocas.splice(index, 1);
      atualizarTabelaTrocas();
    }
    salvarDados();
  }
}

document.getElementById('viagensForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const registro = {
    ordemCarro: document.getElementById('ordemCarroViagem').value,
    linha: document.getElementById('linhaViagem').value,
    horarioProgramado: document.getElementById('horarioProgramado').value,
    horarioPerda: document.getElementById('horarioPerda').value,
    motivo: document.getElementById('motivoPerda').value,
    dataRegistro: new Date().toLocaleString('pt-BR')
  };
  dadosViagens.push(registro);
  atualizarTabelaViagens();
  limparFormViagens();
  alert('Viagem perdida registrada!');
});

document.getElementById('trocasForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const registro = {
    carroOriginal: document.getElementById('carroOriginal').value,
    carroSubstituto: document.getElementById('carroSubstituto').value,
    linha: document.getElementById('linhaTroca').value,
    horario: document.getElementById('horarioTroca').value,
    motivo: document.getElementById('motivoTroca').value,
    dataRegistro: new Date().toLocaleString('pt-BR')
  };
  dadosTrocas.push(registro);
  atualizarTabelaTrocas();
  limparFormTrocas();
  alert('Troca registrada!');
});

// Funções de PDF (mantidas do código original - mesmas funções)
function gerarPDFEscala() {
  if (carros.length === 0) {
    alert('⚠️ Não há dados para gerar o relatório!');
    return;
  }
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    doc.setFontSize(20);
    doc.setTextColor(0, 100, 80);
    doc.text('CIDADE REAL', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 120, 100);
    doc.text('RELATÓRIO DE ESCALA DE CARROS PI/PV', 105, 35, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data de emissão: ${new Date().toLocaleString('pt-BR')}`, 105, 45, { align: 'center' });
    
    let yOffset = 60;
    
    for (let i = 0; i < carros.length; i++) {
      const carro = carros[i];
      
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(`Carro: ${carro.ordem} | Itinerário: ${carro.itinerario}`, 14, yOffset);
      yOffset += 6;
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Motorista: ${carro.motorista} | Matrícula: ${carro.matricula} | Setor: ${carro.setor}`, 14, yOffset);
      yOffset += 10;
      
      if (carro.viagens && carro.viagens.length > 0) {
        const viagensData = carro.viagens.map((viagem, idx) => [
          idx + 1,
          viagem.horarioPI || '---',
          viagem.horarioPV || '---',
          viagem.obs || '---'
        ]);
        
        doc.autoTable({
          startY: yOffset,
          head: [['#', 'Horário PI', 'Horário PV', 'Observações']],
          body: viagensData,
          theme: 'striped',
          headStyles: { 
            fillColor: [0, 120, 100], 
            textColor: [255, 255, 255], 
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 35 },
            2: { cellWidth: 35 },
            3: { cellWidth: 'auto' }
          }
        });
        
        yOffset = doc.lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(9);
        doc.text('Sem viagens registradas para este carro.', 14, yOffset);
        yOffset += 10;
      }
    }
    
    const nomeArquivo = `relatorio_escala_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.pdf`;
    doc.save(nomeArquivo);
    alert('✅ PDF da Escala gerado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('❌ Erro ao gerar o PDF. Tente novamente.');
  }
}

function gerarPDFViagens() {
  if (dadosViagens.length === 0) {
    alert('⚠️ Não há registros de viagens perdidas!');
    return;
  }
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    doc.setFontSize(20);
    doc.setTextColor(0, 100, 80);
    doc.text('CIDADE REAL', 148, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 120, 100);
    doc.text('RELATÓRIO DE VIAGENS PERDIDAS', 148, 35, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data de emissão: ${new Date().toLocaleString('pt-BR')}`, 148, 45, { align: 'center' });
    
    const viagensData = dadosViagens.map(item => [
      item.ordemCarro,
      item.linha,
      item.horarioProgramado,
      item.horarioPerda,
      item.motivo.length > 50 ? item.motivo.substring(0, 47) + '...' : item.motivo,
      item.dataRegistro || new Date().toLocaleString('pt-BR')
    ]);
    
    doc.autoTable({
      startY: 60,
      head: [['Nº Ordem', 'Linha/Itinerário', 'Horário Programado', 'Horário Perda', 'Motivo', 'Registrado em']],
      body: viagensData,
      theme: 'striped',
      headStyles: { 
        fillColor: [0, 120, 100], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 30 }
      }
    });
    
    const nomeArquivo = `relatorio_viagens_perdidas_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.pdf`;
    doc.save(nomeArquivo);
    alert('✅ PDF das Viagens Perdidas gerado!');
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('❌ Erro ao gerar o PDF.');
  }
}

function gerarPDFTrocas() {
  if (dadosTrocas.length === 0) {
    alert('⚠️ Não há registros de trocas!');
    return;
  }
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    doc.setFontSize(20);
    doc.setTextColor(0, 100, 80);
    doc.text('CIDADE REAL', 148, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 120, 100);
    doc.text('RELATÓRIO DE TROCAS DE CARROS', 148, 35, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data de emissão: ${new Date().toLocaleString('pt-BR')}`, 148, 45, { align: 'center' });
    
    const trocasData = dadosTrocas.map(item => [
      item.carroOriginal,
      item.carroSubstituto,
      item.linha,
      item.horario,
      item.motivo.length > 50 ? item.motivo.substring(0, 47) + '...' : item.motivo,
      item.dataRegistro || new Date().toLocaleString('pt-BR')
    ]);
    
    doc.autoTable({
      startY: 60,
      head: [['Carro Original', 'Carro Substituto', 'Linha/Itinerário', 'Horário', 'Motivo', 'Registrado em']],
      body: trocasData,
      theme: 'striped',
      headStyles: { 
        fillColor: [0, 120, 100], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 30 }
      }
    });
    
    const nomeArquivo = `relatorio_trocas_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.pdf`;
    doc.save(nomeArquivo);
    alert('✅ PDF das Trocas gerado!');
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('❌ Erro ao gerar o PDF.');
  }
}

function gerarPDFCompleto() {
  const totalViagens = carros.reduce((sum, c) => sum + (c.viagens ? c.viagens.length : 0), 0);
  
  if (carros.length === 0 && dadosViagens.length === 0 && dadosTrocas.length === 0) {
    alert('⚠️ Não há dados para gerar o relatório completo!');
    return;
  }
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    doc.setFontSize(22);
    doc.setTextColor(0, 100, 80);
    doc.text('CIDADE REAL', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 120, 100);
    doc.text('RELATÓRIO COMPLETO DE FISCALIZAÇÃO', 105, 35, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data de emissão: ${new Date().toLocaleString('pt-BR')}`, 105, 45, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Resumo Geral:`, 14, 60);
    doc.setFontSize(9);
    doc.text(`• Total de carros cadastrados: ${carros.length}`, 20, 68);
    doc.text(`• Total de viagens registradas: ${totalViagens}`, 20, 74);
    doc.text(`• Total de viagens perdidas: ${dadosViagens.length}`, 20, 80);
    doc.text(`• Total de trocas de carros: ${dadosTrocas.length}`, 20, 86);
    
    let yOffset = 95;
    
    if (carros.length > 0) {
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 120, 100);
      doc.setFont(undefined, 'bold');
      doc.text('1. ESCALA DE CARROS PI/PV', 14, yOffset);
      yOffset += 10;
      
      for (const carro of carros) {
        if (yOffset > 260) {
          doc.addPage();
          yOffset = 20;
        }
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text(`Carro: ${carro.ordem} | Itinerário: ${carro.itinerario}`, 14, yOffset);
        yOffset += 6;
        
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(`Motorista: ${carro.motorista} | Matrícula: ${carro.matricula} | Setor: ${carro.setor}`, 14, yOffset);
        yOffset += 8;
        
        if (carro.viagens && carro.viagens.length > 0) {
          const viagensData = carro.viagens.map((viagem, idx) => [
            idx + 1,
            viagem.horarioPI || '---',
            viagem.horarioPV || '---',
            viagem.obs || '---'
          ]);
          
          doc.autoTable({
            startY: yOffset,
            head: [['#', 'Horário PI', 'Horário PV', 'Observações']],
            body: viagensData,
            theme: 'striped',
            headStyles: { fillColor: [0, 120, 100], textColor: [255, 255, 255], fontSize: 8 },
            bodyStyles: { fontSize: 7 },
            margin: { left: 14, right: 14 }
          });
          
          yOffset = doc.lastAutoTable.finalY + 8;
        } else {
          doc.text('Sem viagens registradas.', 14, yOffset);
          yOffset += 8;
        }
        yOffset += 5;
      }
      yOffset += 5;
    }
    
    if (dadosViagens.length > 0) {
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 120, 100);
      doc.setFont(undefined, 'bold');
      doc.text('2. VIAGENS PERDIDAS', 14, yOffset);
      yOffset += 10;
      
      const viagensData = dadosViagens.map(item => [
        item.ordemCarro,
        item.linha,
        item.horarioProgramado,
        item.horarioPerda,
        item.motivo.length > 40 ? item.motivo.substring(0, 37) + '...' : item.motivo
      ]);
      
      doc.autoTable({
        startY: yOffset,
        head: [['Nº Ordem', 'Linha/Itinerário', 'H. Programado', 'H. Perda', 'Motivo']],
        body: viagensData,
        theme: 'striped',
        headStyles: { fillColor: [0, 120, 100], textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        margin: { left: 14, right: 14 }
      });
      
      yOffset = doc.lastAutoTable.finalY + 10;
    }
    
    if (dadosTrocas.length > 0) {
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 120, 100);
      doc.setFont(undefined, 'bold');
      doc.text('3. TROCAS DE CARROS', 14, yOffset);
      yOffset += 10;
      
      const trocasData = dadosTrocas.map(item => [
        item.carroOriginal,
        item.carroSubstituto,
        item.linha,
        item.horario,
        item.motivo.length > 40 ? item.motivo.substring(0, 37) + '...' : item.motivo
      ]);
      
      doc.autoTable({
        startY: yOffset,
        head: [['Carro Original', 'Carro Substituto', 'Linha/Itinerário', 'Horário', 'Motivo']],
        body: trocasData,
        theme: 'striped',
        headStyles: { fillColor: [0, 120, 100], textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        margin: { left: 14, right: 14 }
      });
    }
    
    const nomeArquivo = `relatorio_completo_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.pdf`;
    doc.save(nomeArquivo);
    alert('✅ Relatório completo gerado!');
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('❌ Erro ao gerar o PDF completo.');
  }
}

document.getElementById('gerarPDFEscala').addEventListener('click', gerarPDFEscala);
document.getElementById('gerarPDFViagens').addEventListener('click', gerarPDFViagens);
document.getElementById('gerarPDFTrocas').addEventListener('click', gerarPDFTrocas);
document.getElementById('gerarPDFCompleto').addEventListener('click', gerarPDFCompleto);

function apagarTodosDados() {
  if (confirm('⚠️ ATENÇÃO: Isso apagará TODOS os registros! Confirmar?')) {
    carros = [];
    dadosViagens = [];
    dadosTrocas = [];
    atualizarListaCarros();
    atualizarTabelaViagens();
    atualizarTabelaTrocas();
    salvarDados();
    alert('✅ Todos os dados foram apagados!');
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFormToggle();
  carregarDadosSalvos();
});