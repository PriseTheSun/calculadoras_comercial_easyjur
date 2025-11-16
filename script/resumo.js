// resumo.js - CORRIGIDO
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector('[data-tab="resumo"]')
    .addEventListener("click", function () {
      setTimeout(atualizarResumoGeral, 100);
    });

  document
    .getElementById("gerar-proposta")
    .addEventListener("click", function () {
      gerarPropostaPDF();
    });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab");
      if (tab !== "resumo") {
        abrirAba(tab);
      }
    });
  });
});

function atualizarResumoGeral() {
  const temDadosPlano = verificarDadosPlano();
  const temDadosMigracao = verificarDadosMigracao();
  const temDadosROI = verificarDadosROI();

  const alerta = document.getElementById("resumo-alert");
  if (!temDadosPlano && !temDadosMigracao && !temDadosROI) {
    alerta.classList.remove("hidden");
  } else {
    alerta.classList.add("hidden");
  }

  atualizarResumoPlano();
  atualizarResumoMigracao();
  atualizarResumoROI();

  if (temDadosPlano || temDadosMigracao || temDadosROI) {
    document.getElementById("resumo-consolidado").classList.remove("hidden");
    atualizarResumoConsolidado();
  } else {
    document.getElementById("resumo-consolidado").classList.add("hidden");
  }
}

function verificarDadosPlano() {
  return !document
    .getElementById("plan-configuration-container")
    .classList.contains("hidden");
}

function verificarDadosMigracao() {
  return !document
    .getElementById("resultado-migracao")
    .classList.contains("hidden");
}

function verificarDadosROI() {
  return (
    !document
      .getElementById("resultado-roi-calculadora")
      .classList.contains("hidden") ||
    !document.getElementById("resultado-roi").classList.contains("hidden")
  );
}

function atualizarResumoPlano() {
  const temDados = verificarDadosPlano();
  const vazio = document.getElementById("resumo-plano-vazio");
  const conteudo = document.getElementById("resumo-plano-conteudo");

  if (temDados) {
    vazio.classList.add("hidden");
    conteudo.classList.remove("hidden");

    const planCard = document.querySelector(".plan-card.selected");
    if (planCard) {
      const planName = planCard.querySelector("h3").textContent;
      const planPrice = planCard.querySelector(".text-3xl").textContent;
      document.getElementById("resumo-plano-nome").textContent = planName;
      document.getElementById("resumo-plano-base").textContent = planPrice;
    }

    const campos = [
      "usuarios-adicionais",
      "pushs-adicionais",
      "oabs-adicionais",
      "ged-adicional",
      "jurisai-tokens",
      "captura-processos",
    ];
    campos.forEach((campo) => {
      const valor = document.getElementById(`valor-${campo}`).textContent;
      document.querySelector(`#resumo-${campo} span:last-child`).textContent =
        valor;
    });

    const totalMensal =
      document.getElementById("valor-total-mensal").textContent;
    const implantacao = document.getElementById("valor-adicionais").textContent;
    document.getElementById("resumo-total-mensal").textContent = totalMensal;
    document.getElementById("resumo-implantacao").textContent = implantacao;
  } else {
    vazio.classList.remove("hidden");
    conteudo.classList.add("hidden");
  }
}

function atualizarResumoMigracao() {
  const temDados = verificarDadosMigracao();
  const vazio = document.getElementById("resumo-migracao-vazio");
  const conteudo = document.getElementById("resumo-migracao-conteudo");

  if (temDados) {
    vazio.classList.add("hidden");
    conteudo.classList.remove("hidden");

    const quantidade = document.getElementById("resumo-quantidade").textContent;
    const total = document.getElementById("resumo-valor-total").textContent;
    document.getElementById("resumo-migracao-quantidade").textContent =
      quantidade;
    document.getElementById("resumo-migracao-total").textContent = total;

    const modulosContainer = document.getElementById("resumo-migracao-modulos");
    modulosContainer.innerHTML = "";
    const modulos = document.querySelectorAll("#resumo-modulos span");
    if (modulos.length > 0) {
      modulos.forEach((m) => {
        const div = document.createElement("div");
        div.className = "flex items-center";
        div.innerHTML = `<svg class="w-4 h-4 easyjur-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg><span class="text-sm">${m.textContent}</span>`;
        modulosContainer.appendChild(div);
      });
    } else {
      modulosContainer.innerHTML =
        '<span class="text-gray-500 text-sm">Nenhum módulo selecionado</span>';
    }

    const roiVisivel = !document
      .getElementById("resultado-roi")
      .classList.contains("hidden");
    if (roiVisivel) {
      document.getElementById("resumo-migracao-roi").classList.remove("hidden");
      const tempo = document.getElementById("roi-horas").textContent;
      const economia = document.getElementById("roi-economia").textContent;
      document.getElementById("resumo-migracao-tempo").textContent = tempo;
      document.getElementById("resumo-migracao-economia").textContent =
        economia;
    } else {
      document.getElementById("resumo-migracao-roi").classList.add("hidden");
    }
  } else {
    vazio.classList.remove("hidden");
    conteudo.classList.add("hidden");
  }
}

function atualizarResumoROI() {
  const temDados = verificarDadosROI();
  const vazio = document.getElementById("resumo-roi-vazio");
  const conteudo = document.getElementById("resumo-roi-conteudo");

  if (temDados) {
    vazio.classList.add("hidden");
    conteudo.classList.remove("hidden");

    const quantidade = document.getElementById(
      "roi-quantidade-processos"
    ).value;
    const horas = document.getElementById("roi-economia-horas").textContent;
    const dias = document.getElementById("roi-economia-dias").textContent;
    document.getElementById("resumo-roi-quantidade").textContent = quantidade;
    document.getElementById("resumo-roi-horas").textContent = horas;
    document.getElementById("resumo-roi-dias").textContent = dias;

    const valorHoraInput =
      document.getElementById("valor-hora") ||
      document.getElementById("roi-valor-hora");
    const valorHora = valorHoraInput
      ? parseFloat(valorHoraInput.value) || 0
      : 0;
    document.getElementById(
      "resumo-roi-valor-hora"
    ).textContent = `R$ ${valorHora.toFixed(2).replace(".", ",")}`;
  } else {
    vazio.classList.remove("hidden");
    conteudo.classList.add("hidden");
  }
}

function atualizarResumoConsolidado() {
  let totalPlanoMensal = 0;
  let totalImplantacao = 0;
  let totalMigracao = 0;

  if (verificarDadosPlano()) {
    const totalMensalText =
      document.getElementById("valor-total-mensal").textContent;
    totalPlanoMensal =
      parseFloat(totalMensalText.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

    const implantacaoText =
      document.getElementById("valor-adicionais").textContent;
    totalImplantacao =
      parseFloat(implantacaoText.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  }

  if (verificarDadosMigracao()) {
    const migracaoText =
      document.getElementById("resumo-valor-total").textContent;
    totalMigracao =
      parseFloat(migracaoText.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  }

  const totalInicial = totalImplantacao + totalMigracao;

  document.getElementById(
    "consolidado-plano-mensal"
  ).textContent = `R$ ${totalPlanoMensal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
  document.getElementById(
    "consolidado-implantacao"
  ).textContent = `R$ ${totalImplantacao.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
  document.getElementById(
    "consolidado-migracao"
  ).textContent = `R$ ${totalMigracao.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
  document.getElementById(
    "consolidado-total-inicial"
  ).textContent = `R$ ${totalInicial.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;

  let tempoEconomizado = "0 horas";
  let economiaFinanceira = 0;

  if (!document.getElementById("resultado-roi").classList.contains("hidden")) {
    tempoEconomizado = document.getElementById("roi-horas").textContent;
    const economiaText = document.getElementById("roi-economia").textContent;
    economiaFinanceira =
      parseFloat(economiaText.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  } else if (
    !document
      .getElementById("resultado-roi-calculadora")
      .classList.contains("hidden")
  ) {
    const horasText = document.getElementById("roi-economia-horas").textContent;
    const horas = parseFloat(horasText) || 0;
    const valorHora =
      parseFloat(document.getElementById("valor-hora")?.value) || 80;
    economiaFinanceira = horas * valorHora;
    tempoEconomizado = `${Math.round(horas)} horas`;
  }

  const roiPercentual =
    totalInicial > 0 ? (economiaFinanceira / totalInicial) * 100 : 0;

  document.getElementById("consolidado-tempo-economizado").textContent =
    tempoEconomizado;
  document.getElementById(
    "consolidado-economia-financeira"
  ).textContent = `R$ ${economiaFinanceira.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
  document.getElementById(
    "consolidado-roi"
  ).textContent = `${roiPercentual.toFixed(0)}%`;
}

function gerarPropostaPDF() {
  // Garante que o resumo esteja atualizado antes de gerar o PDF
  atualizarResumoGeral();

  // === COLETA DE DADOS ===
  const dados = {
    plano: verificarDadosPlano() ? coletarDadosPlano() : null,
    migracao: verificarDadosMigracao() ? coletarDadosMigracao() : null,
    roi: verificarDadosROI() ? coletarDadosROI() : null,
    consolidado: coletarDadosConsolidado(),
  };

  function coletarDadosPlano() {
    return {
      nome: document.getElementById("resumo-plano-nome").textContent,
      base: document.getElementById("resumo-plano-base").textContent,
      totalMensal: document.getElementById("resumo-total-mensal").textContent,
      implantacao: document.getElementById("resumo-implantacao").textContent,
      adicionais: {
        usuarios: getValor("resumo-usuarios-adicionais"),
        pushs: getValor("resumo-pushs-adicionais"),
        oabs: getValor("resumo-oabs-adicionais"),
        ged: getValor("resumo-ged-adicional"),
        jurisai: getValor("resumo-jurisai-tokens"),
        captura: getValor("resumo-captura-processos"),
      },
    };
  }

  function coletarDadosMigracao() {
    const modulos = Array.from(
      document.querySelectorAll(
        "#resumo-migracao-modulos .flex.items-center span:last-child"
      )
    ).map((el) => el.textContent.trim());

    return {
      quantidade: document.getElementById("resumo-migracao-quantidade")
        .textContent,
      total: document.getElementById("resumo-migracao-total").textContent,
      modulos: modulos.length > 0 ? modulos : ["Nenhum módulo selecionado"],
      tempo:
        document.getElementById("resumo-migracao-tempo")?.textContent ||
        "Não calculado",
      economia:
        document.getElementById("resumo-migracao-economia")?.textContent ||
        "Não calculado",
    };
  }

  function coletarDadosROI() {
    return {
      quantidade: document.getElementById("resumo-roi-quantidade").textContent,
      horas: document.getElementById("resumo-roi-horas").textContent,
      dias: document.getElementById("resumo-roi-dias").textContent,
      valorHora: document.getElementById("resumo-roi-valor-hora").textContent,
    };
  }

  function coletarDadosConsolidado() {
    return {
      planoMensal: document.getElementById("consolidado-plano-mensal")
        .textContent,
      implantacao: document.getElementById("consolidado-implantacao")
        .textContent,
      migracao: document.getElementById("consolidado-migracao").textContent,
      totalInicial: document.getElementById("consolidado-total-inicial")
        .textContent,
      tempoEconomizado: document.getElementById("consolidado-tempo-economizado")
        .textContent,
      economiaFinanceira: document.getElementById(
        "consolidado-economia-financeira"
      ).textContent,
      roi: document.getElementById("consolidado-roi").textContent,
    };
  }

  function getValor(id) {
    return document.querySelector(`#${id} span:last-child`).textContent;
  }

  // === HTML DO PDF ===
  const htmlPDF = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Comercial - EasyJur</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page { margin: 15mm; size: A4; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1f2937;
      background: #fff;
      padding: 0;
    }
    .container { max-width: 210mm; margin: 0 auto; }

    /* Cabeçalho */
    .header {
      text-align: center;
      padding-bottom: 12pt;
      border-bottom: 3pt solid #10b981;
      margin-bottom: 16pt;
    }
    .logo {
      height: 25pt;
      margin-bottom: 8pt;
      margin-top: 20pt;
    }
    .title {
      font-size: 18pt;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4pt;
    }
    .subtitle {
      font-size: 11pt;
      color: #6b7280;
      margin-bottom: 6pt;
    }
    .meta {
      display: flex;
      justify-content: center;
      gap: 16pt;
      font-size: 9pt;
      color: #4b5563;
      background: #f3f4f6;
      padding: 6pt 12pt;
      border-radius: 6pt;
      display: inline-flex;
    }

    /* Seções */
    .section {
      margin-bottom: 20pt;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 13pt;
      font-weight: 600;
      color: #111827;
      padding: 8pt 12pt;
      background: #ecfdf5;
      border-left: 4pt solid #10b981;
      margin-bottom: 10pt;
      border-radius: 0 4pt 4pt 0;
    }

    /* Cards */
    .card {
      border: 1pt solid #e5e7eb;
      border-radius: 8pt;
      overflow: hidden;
      margin-bottom: 12pt;
      box-shadow: 0 1pt 3pt rgba(0,0,0,0.05);
    }
    .card-header {
      background: #f9fafb;
      padding: 10pt 14pt;
      font-weight: 600;
      color: #374151;
      border-bottom: 1pt solid #e5e7eb;
      font-size: 12pt;
    }
    .card-body { padding: 12pt 14pt; }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 4pt 0;
      font-size: 10.5pt;
    }
    .label { color: #6b7280; font-weight: 500; }
    .value { font-weight: 600; color: #111827; text-align: right;  }

    /* Tabela de Adicionais */
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8pt;
      font-size: 10pt;
    }
    .table th, .table td {
      padding: 6pt 8pt;
      text-align: left;
      border-bottom: 1pt solid #f3f4f6;
    }
    .table td:nth-child(2),
    .table th:nth-child(2) {
        text-align: end;
    }

    .table th { background: #f9fafb; font-weight: 600; color: #374151; }
    .table tbody tr:hover { background: #f8fefc; }

    /* Badges */
    .badge {
      display: inline-block;
      background: #d1fae5;
      color: #065f46;
      padding: 2pt 8pt;
      border-radius: 999px;
      font-size: 9pt;
      font-weight: 600;
      margin: 2pt 4pt 2pt 0;
    }

    /* Destaques */
    .highlight {
      background: #ecfdf5;
      padding: 12pt;
      border-radius: 8pt;
      border: 1pt solid #a7f3d0;
      text-align: center;
      margin: 16pt 0;
    }
    .highlight-value {
      font-size: 20pt;
      font-weight: 700;
      color: #065f46;
      margin: 4pt 0;
    }
    .highlight-label { font-size: 10pt; color: #059669; }

    /* Investimento */
    .investment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12pt;
      margin: 16pt 0;
    }
    .investment-card {
      background: #f0fdf4;
      padding: 14pt;
      border-radius: 8pt;
      text-align: center;
      border: 1pt solid #bbf7d0;
    }
    .investment-label { font-size: 10pt; color: #166534; margin-bottom: 6pt; }
    .investment-value { font-size: 16pt; font-weight: 700; color: #166534; }

    /* Benefícios */
    .benefit-list {
      list-style: none;
      padding: 0;
    }
    .benefit-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8pt;
      font-size: 10.5pt;
    }
    .benefit-icon {
      color: #10b981;
      margin-right: 8pt;
      font-weight: bold;
      font-size: 14pt;
    }

    /* Rodapé */
    .footer {
      margin-top: 32pt;
      padding-top: 16pt;
      border-top: 1pt solid #e5e7eb;
      text-align: center;
      font-size: 9pt;
      color: #6b7280;
    }
    .contact {
      display: flex;
      justify-content: center;
      gap: 16pt;
      flex-wrap: wrap;
      margin: 8pt 0;
    }
    .contact-item { font-size: 9pt; }

    /* Responsivo para impressão */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .section { page-break-inside: avoid; }
      .card, .highlight, .investment-card { box-shadow: none; }
      .investment-grid { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- Cabeçalho -->
    <div class="header">
      <img src="assets/images/logo-calculadoras.png" alt="EasyJur" class="logo" onerror="this.style.display='none'">
      <div class="title">PROPOSTA COMERCIAL</div>
      <div class="subtitle">Sistema Jurídico Inteligente com IA</div>
      <div class="meta">
        <span><strong>Data:</strong> ${new Date().toLocaleDateString(
          "pt-BR"
        )}</span>
        <span><strong>Validade:</strong> 30 dias</span>
        <span><strong>EasyJur © 2025</strong></span>
      </div>
    </div>

    <!-- Introdução -->
    <div class="section">
      <p><strong>Prezado(a) Cliente,</strong></p>
      <p>Apresentamos uma proposta personalizada para implementação do <strong>EasyJur</strong> em sua operação jurídica. Esta solução foi dimensionada com base nas suas necessidades operacionais, garantindo <strong>eficiência, economia e escalabilidade</strong>.</p>
    </div>

    <!-- Plano de Assinatura -->
    ${
      dados.plano
        ? `
    <div class="section">
      <div class="section-title">Plano de Assinatura Selecionado</div>
      <div class="card">
        <div class="card-header">Plano ${dados.plano.nome}</div>
        <div class="card-body">
          <div class="row"><span class="label">Valor Base Mensal</span><span class="value">${dados.plano.base}</span></div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Recurso Adicional</th>
                <th style="text-align: right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Usuários Adicionais</td><td class="value">${dados.plano.adicionais.usuarios}</td></tr>
              <tr><td>Notificações Push</td><td class="value">${dados.plano.adicionais.pushs}</td></tr>
              <tr><td>Captura de OABs</td><td class="value">${dados.plano.adicionais.oabs}</td></tr>
              <tr><td>Armazenamento Extra (GB)</td><td class="value">${dados.plano.adicionais.ged}</td></tr>
              <tr><td>JurisAI Tokens</td><td class="value">${dados.plano.adicionais.jurisai}</td></tr>
              <tr><td>Captura Automática</td><td class="value">${dados.plano.adicionais.captura}</td></tr>
            </tbody>
          </table>
          
          <div class="row" style="margin-top: 10pt; padding-top: 10pt; border-top: 2pt solid #10b981; font-weight: 700; font-size: 12pt;">
            <span>Total Mensal</span>
            <span class="value">${dados.plano.totalMensal}</span>
          </div>
          <div class="row" style="margin-top: 6pt; color: #dc2626; font-weight: 600;">
            <span>Implantação (única)</span>
            <span class="value">${dados.plano.implantacao}</span>
          </div>
        </div>
      </div>
    </div>
    `
        : ""
    }

    <!-- Migração -->
    ${
      dados.migracao
        ? `
    <div class="section">
      <div class="section-title">Migração de Dados</div>
      <div class="card">
        <div class="card-body">
          <div class="row"><span class="label">Quantidade de Processos</span><span class="value">${
            dados.migracao.quantidade
          }</span></div>
          <div class="row" style="align-items: flex-start;">
            <span class="label">Módulos Inclusos</span>
            <div style="text-align: right;">
              ${dados.migracao.modulos
                .map((m) => `<span class="badge">${m}</span>`)
                .join("")}
            </div>
          </div>
          <div class="row" style="margin-top: 12pt; padding-top: 12pt; border-top: 2pt solid #10b981; font-weight: 700; font-size: 12pt;">
            <span>Valor Total da Migração</span>
            <span class="value">${dados.migracao.total}</span>
          </div>
          ${
            dados.migracao.tempo !== "Não calculado"
              ? `
          <div style="margin-top: 12pt; padding: 10pt; background: #f0fdf4; border-radius: 6pt; font-size: 10pt;">
            <div><strong>Economia de Tempo:</strong> ${dados.migracao.tempo}</div>
            <div><strong>Economia Financeira:</strong> ${dados.migracao.economia}</div>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
    `
        : ""
    }

    <!-- ROI -->
    ${
      dados.roi
        ? `
    <div class="section">
      <div class="section-title">Análise de Retorno (ROI)</div>
      <div class="card">
        <div class="card-body">
          <div class="row"><span class="label">Processos Analisados</span><span class="value">${dados.roi.quantidade}</span></div>
          <div class="row"><span class="label">Tempo Economizado</span><span class="value">${dados.roi.horas} (${dados.roi.dias})</span></div>
          <div class="row"><span class="label">Valor da Hora</span><span class="value">${dados.roi.valorHora}</span></div>
        </div>
      </div>
    </div>
    `
        : ""
    }

    <!-- Resumo do Investimento -->
    <div class="section">
      <div class="section-title">Resumo do Investimento</div>
      <div class="investment-grid">
        <div class="investment-card">
          <div class="investment-label">INVESTIMENTO INICIAL</div>
          <div class="investment-value">${dados.consolidado.totalInicial}</div>
          <div style="font-size: 9pt; color: #166534;">Implantação + Migração</div>
        </div>
        <div class="investment-card">
          <div class="investment-label">CUSTO MENSAL</div>
          <div class="investment-value">${dados.consolidado.planoMensal}</div>
          <div style="font-size: 9pt; color: #166534;">Plano + Recursos</div>
        </div>
      </div>
    </div>

    <!-- Benefícios -->
    <div class="section">
      <div class="section-title">Benefícios Esperados</div>
      <div style="background: #f8fefc; padding: 14pt; border-radius: 8pt; border: 1pt dashed #86efac;">
        <ul class="benefit-list">
          <li class="benefit-item"><span class="benefit-icon">✓</span> <strong>Economia de Tempo:</strong> ${
            dados.consolidado.tempoEconomizado
          } por mês</li>
          <li class="benefit-item"><span class="benefit-icon">✓</span> <strong>Redução de Custos:</strong> ${
            dados.consolidado.economiaFinanceira
          } em economia</li>
          <li class="benefit-item"><span class="benefit-icon">✓</span> <strong>Produtividade:</strong> Automação de tarefas repetitivas</li>
          <li class="benefit-item"><span class="benefit-icon">✓</span> <strong>Segurança:</strong> Backup automático e criptografia</li>
        </ul>
      </div>
    </div>

    <!-- ROI Destaque -->
    <div class="highlight">
      <div class="highlight-label">RETORNO SOBRE O INVESTIMENTO (ROI)</div>
      <div class="highlight-value">${dados.consolidado.roi}</div>
      <div style="font-size: 10pt; color: #059669;">em economia e produtividade</div>
    </div>

    <!-- Condições -->
    <div class="section">
      <div class="section-title">Condições Especiais</div>
      <div style="background: #fefce8; padding: 12pt; border-radius: 8pt; border-left: 4pt solid #facc15;">
        <ul class="benefit-list">
          <li class="benefit-item"><span class="benefit-icon">★</span> <strong>Suporte Premium:</strong> 30 dias inclusos</li>
          <li class="benefit-item"><span class="benefit-icon">★</span> <strong>Treinamento:</strong> Capacitação completa da equipe</li>
          <li class="benefit-item"><span class="benefit-icon">★</span> <strong>Garantia:</strong> 15 dias de satisfação garantida</li>
        </ul>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="footer">
      <p><strong>EasyJur — Inteligência Jurídica que Transforma</strong></p>
      <div class="contact">
        <div class="contact-item">www.easyjur.com</div>
        <div class="contact-item">comercial@easyjur.com.br</div>
        <div class="contact-item">(34) 3312-8082</div>
      </div>
      <p style="margin-top: 8pt; font-size: 8pt; color: #9ca3af;">
        Proposta gerada em ${new Date().toLocaleString(
          "pt-BR"
        )} • Validade: 30 dias
      </p>
    </div>

  </div>
</body>
</html>
  `;

  // === ABRE JANELA E IMPRIME ===
  const printWindow = window.open("", "_blank");
  printWindow.document.write(htmlPDF);
  printWindow.document.close();

  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // printWindow.close(); // Opcional: fechar após impressão
    }, 600);
  };
}

function abrirAba(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("tab-active");
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("tab-active");
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });
  document.getElementById(tabName).classList.remove("hidden");
}
