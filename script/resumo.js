// Inicialização da aba de Resumo
document.addEventListener("DOMContentLoaded", function () {
  // Atualizar resumo quando a aba for aberta
  document
    .querySelector('[data-tab="resumo"]')
    .addEventListener("click", function () {
      atualizarResumoGeral();
    });

  // Botão para gerar proposta comercial
  document
    .getElementById("gerar-proposta")
    .addEventListener("click", function () {
      gerarPropostaPDF();
    });

  // Botões para navegar para outras abas
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab");
      if (tab !== "resumo") {
        abrirAba(tab);
      }
    });
  });
});

// Função para atualizar o resumo geral
function atualizarResumoGeral() {
  // Verificar se há dados nas outras abas
  const temDadosPlano = verificarDadosPlano();
  const temDadosMigracao = verificarDadosMigracao();
  const temDadosROI = verificarDadosROI();

  // Mostrar alerta se não houver dados suficientes
  const alerta = document.getElementById("resumo-alert");
  if (!temDadosPlano && !temDadosMigracao && !temDadosROI) {
    alerta.classList.remove("hidden");
  } else {
    alerta.classList.add("hidden");
  }

  // Atualizar cada seção do resumo
  atualizarResumoPlano();
  atualizarResumoMigracao();
  atualizarResumoROI();

  // Atualizar resumo consolidado se houver dados suficientes
  if (temDadosPlano || temDadosMigracao || temDadosROI) {
    document.getElementById("resumo-consolidado").classList.remove("hidden");
    atualizarResumoConsolidado();
  } else {
    document.getElementById("resumo-consolidado").classList.add("hidden");
  }
}

// Verificar se há dados na aba de Planos
function verificarDadosPlano() {
  const planConfig = document.getElementById("plan-configuration-container");
  return !planConfig.classList.contains("hidden");
}

// Verificar se há dados na aba de Migração
function verificarDadosMigracao() {
  const resultadoMigracao = document.getElementById("resultado-migracao");
  return !resultadoMigracao.classList.contains("hidden");
}

// Verificar se há dados na aba de ROI
function verificarDadosROI() {
  const resultadoROI = document.getElementById("resultado-roi-calculadora");
  return !resultadoROI.classList.contains("hidden");
}

// Atualizar resumo do plano
function atualizarResumoPlano() {
  const temDados = verificarDadosPlano();
  const vazio = document.getElementById("resumo-plano-vazio");
  const conteudo = document.getElementById("resumo-plano-conteudo");

  if (temDados) {
    vazio.classList.add("hidden");
    conteudo.classList.remove("hidden");

    // Obter dados do plano selecionado
    const planCard = document.querySelector(".plan-card.selected");
    if (planCard) {
      const planName = planCard.querySelector("h3").textContent;
      const planPrice = planCard.querySelector(".text-3xl").textContent;

      document.getElementById("resumo-plano-nome").textContent = planName;
      document.getElementById("resumo-plano-base").textContent = planPrice;
    }

    // Obter valores dos adicionais
    const usuariosAdicionais = document.getElementById(
      "valor-usuarios-adicionais"
    ).textContent;
    const pushsAdicionais = document.getElementById(
      "valor-pushs-adicionais"
    ).textContent;
    const oabsAdicionais = document.getElementById(
      "valor-oabs-adicionais"
    ).textContent;
    const gedAdicional = document.getElementById(
      "valor-ged-adicional"
    ).textContent;
    const jurisaiTokens = document.getElementById(
      "valor-jurisai-tokens"
    ).textContent;
    const capturaProcessos = document.getElementById(
      "valor-captura-processos"
    ).textContent;
    const totalMensal =
      document.getElementById("valor-total-mensal").textContent;
    const implantacao = document.getElementById("valor-adicionais").textContent;

    // Atualizar valores no resumo
    document
      .getElementById("resumo-usuarios-adicionais")
      .querySelector("span:last-child").textContent = usuariosAdicionais;
    document
      .getElementById("resumo-pushs-adicionais")
      .querySelector("span:last-child").textContent = pushsAdicionais;
    document
      .getElementById("resumo-oabs-adicionais")
      .querySelector("span:last-child").textContent = oabsAdicionais;
    document
      .getElementById("resumo-ged-adicional")
      .querySelector("span:last-child").textContent = gedAdicional;
    document
      .getElementById("resumo-jurisai-tokens")
      .querySelector("span:last-child").textContent = jurisaiTokens;
    document
      .getElementById("resumo-captura-processos")
      .querySelector("span:last-child").textContent = capturaProcessos;
    document.getElementById("resumo-total-mensal").textContent = totalMensal;
    document.getElementById("resumo-implantacao").textContent = implantacao;
  } else {
    vazio.classList.remove("hidden");
    conteudo.classList.add("hidden");
  }
}

// Atualizar resumo da migração
function atualizarResumoMigracao() {
  const temDados = verificarDadosMigracao();
  const vazio = document.getElementById("resumo-migracao-vazio");
  const conteudo = document.getElementById("resumo-migracao-conteudo");

  if (temDados) {
    vazio.classList.add("hidden");
    conteudo.classList.remove("hidden");

    // Obter dados da migração
    const quantidade = document.getElementById("resumo-quantidade").textContent;
    const total = document.getElementById("resumo-valor-total").textContent;

    document.getElementById("resumo-migracao-quantidade").textContent =
      quantidade;
    document.getElementById("resumo-migracao-total").textContent = total;

    // Obter módulos selecionados
    const modulosContainer = document.getElementById("resumo-modulos");
    const resumoModulos = document.getElementById("resumo-migracao-modulos");
    resumoModulos.innerHTML = "";

    // Buscar todos os módulos selecionados
    const modulosSelecionados = [];
    document
      .querySelectorAll('.module-card input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        const moduleName = checkbox
          .closest(".module-card")
          .querySelector("h4").textContent;
        modulosSelecionados.push(moduleName);
      });

    if (modulosSelecionados.length > 0) {
      modulosSelecionados.forEach((modulo) => {
        const div = document.createElement("div");
        div.className = "flex items-center";
        div.innerHTML = `
          <svg class="w-4 h-4 easyjur-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm">${modulo}</span>
        `;
        resumoModulos.appendChild(div);
      });
    } else {
      resumoModulos.innerHTML =
        '<span class="text-gray-500 text-sm">Nenhum módulo selecionado</span>';
    }

    // Verificar se há ROI calculado
    const resultadoROI = document.getElementById("resultado-roi");
    if (!resultadoROI.classList.contains("hidden")) {
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

// Atualizar resumo do ROI
function atualizarResumoROI() {
  const temDados = verificarDadosROI();
  const vazio = document.getElementById("resumo-roi-vazio");
  const conteudo = document.getElementById("resumo-roi-conteudo");

  if (temDados) {
    vazio.classList.add("hidden");
    conteudo.classList.remove("hidden");

    // Obter dados do ROI
    const quantidade = document.getElementById(
      "roi-quantidade-processos"
    ).value;
    const horas = document.getElementById("roi-economia-horas").textContent;
    const dias = document.getElementById("roi-economia-dias").textContent;

    document.getElementById("resumo-roi-quantidade").textContent = quantidade;
    document.getElementById("resumo-roi-horas").textContent = horas;
    document.getElementById("resumo-roi-dias").textContent = dias;

    // Obter valor da hora (se disponível da aba de migração)
    const valorHoraInput = document.getElementById("valor-hora");
    if (valorHoraInput && valorHoraInput.value) {
      document.getElementById(
        "resumo-roi-valor-hora"
      ).textContent = `R$ ${parseFloat(valorHoraInput.value)
        .toFixed(2)
        .replace(".", ",")}`;
    } else {
      document.getElementById("resumo-roi-valor-hora").textContent = "R$ 0,00";
    }
  } else {
    vazio.classList.remove("hidden");
    conteudo.classList.add("hidden");
  }
}

// Atualizar resumo consolidado
function atualizarResumoConsolidado() {
  // Calcular totais
  let totalPlanoMensal = 0;
  let totalImplantacao = 0;
  let totalMigracao = 0;

  // Obter valores do plano
  if (verificarDadosPlano()) {
    const totalMensalText =
      document.getElementById("valor-total-mensal").textContent;
    totalPlanoMensal =
      parseFloat(
        totalMensalText.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
      ) || 0;

    const implantacaoText =
      document.getElementById("valor-adicionais").textContent;
    totalImplantacao =
      parseFloat(
        implantacaoText.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
      ) || 0;
  }

  // Obter valores da migração
  if (verificarDadosMigracao()) {
    const migracaoText =
      document.getElementById("resumo-valor-total").textContent;
    totalMigracao =
      parseFloat(
        migracaoText.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
      ) || 0;
  }

  // Calcular total inicial
  const totalInicial = totalImplantacao + totalMigracao;

  // Atualizar valores no resumo consolidado
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

  // Calcular benefícios e ROI
  let tempoEconomizado = "0 horas";
  let economiaFinanceira = 0;

  // Obter dados de economia da migração
  if (
    verificarDadosMigracao() &&
    !document.getElementById("resultado-roi").classList.contains("hidden")
  ) {
    tempoEconomizado = document.getElementById("roi-horas").textContent;

    const economiaText = document.getElementById("roi-economia").textContent;
    economiaFinanceira =
      parseFloat(
        economiaText.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
      ) || 0;
  }

  // Obter dados de economia do ROI
  if (verificarDadosROI()) {
    // Se já temos dados da migração, usar os mais relevantes
    if (!verificarDadosMigracao()) {
      tempoEconomizado =
        document.getElementById("roi-economia-horas").textContent;

      // Calcular economia financeira baseada no ROI
      const valorHora =
        parseFloat(document.getElementById("valor-hora")?.value) || 80;
      const horasText =
        document.getElementById("roi-economia-horas").textContent;
      const horas = parseFloat(horasText.split(" ")[0]) || 0;
      economiaFinanceira = horas * valorHora;
    }
  }

  // Calcular ROI percentual
  let roiPercentual = 0;
  if (totalInicial > 0 && economiaFinanceira > 0) {
    roiPercentual = (economiaFinanceira / totalInicial) * 100;
  }

  // Atualizar benefícios e ROI
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

// Função para gerar proposta comercial em PDF
function gerarPropostaPDF() {
  // Coletar todos os dados
  const dadosProposta = {
    plano: verificarDadosPlano()
      ? {
          nome: document.getElementById("resumo-plano-nome").textContent,
          valorBase: document.getElementById("resumo-plano-base").textContent,
          totalMensal: document.getElementById("resumo-total-mensal")
            .textContent,
          implantacao:
            document.getElementById("resumo-implantacao").textContent,
          usuariosAdicionais: document
            .getElementById("resumo-usuarios-adicionais")
            .querySelector("span:last-child").textContent,
          pushsAdicionais: document
            .getElementById("resumo-pushs-adicionais")
            .querySelector("span:last-child").textContent,
          oabsAdicionais: document
            .getElementById("resumo-oabs-adicionais")
            .querySelector("span:last-child").textContent,
          gedAdicional: document
            .getElementById("resumo-ged-adicional")
            .querySelector("span:last-child").textContent,
          jurisaiTokens: document
            .getElementById("resumo-jurisai-tokens")
            .querySelector("span:last-child").textContent,
          capturaProcessos: document
            .getElementById("resumo-captura-processos")
            .querySelector("span:last-child").textContent,
        }
      : null,

    migracao: verificarDadosMigracao()
      ? {
          quantidade: document.getElementById("resumo-migracao-quantidade")
            .textContent,
          modulos: Array.from(
            document
              .getElementById("resumo-migracao-modulos")
              .querySelectorAll("span")
          ).map((el) => el.textContent),
          total: document.getElementById("resumo-migracao-total").textContent,
          tempoEconomizado:
            document.getElementById("resumo-migracao-tempo")?.textContent ||
            "Não calculado",
          economia:
            document.getElementById("resumo-migracao-economia")?.textContent ||
            "Não calculado",
        }
      : null,

    roi: verificarDadosROI()
      ? {
          quantidade: document.getElementById("resumo-roi-quantidade")
            .textContent,
          horas: document.getElementById("resumo-roi-horas").textContent,
          dias: document.getElementById("resumo-roi-dias").textContent,
          valorHora: document.getElementById("resumo-roi-valor-hora")
            .textContent,
        }
      : null,

    consolidado: {
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
    },
  };

  // Criar conteúdo HTML para o PDF
  const conteudoPDF = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Proposta Comercial - EasyJur</title>
      <style>
        /* Reset para impressão */
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 15mm; 
          color: #333; 
          line-height: 1.4;
          font-size: 12px;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .header { 
          text-align: center; 
          margin-bottom: 8mm; 
          padding-bottom: 4mm; 
          border-bottom: 1px solid #ddd;
        }
        
        .logo { 
          max-width: 120px; 
          height: auto;
          margin-bottom: 3mm;
        }
        
        h1 { 
          color: #2d3748; 
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 2mm;
        }
        
        .subtitle {
          color: #4a5568;
          font-size: 13px;
          margin-bottom: 3mm;
        }
        
        .proposal-info {
          background: #f8f9fa;
          padding: 3mm;
          border-radius: 3px;
          display: inline-block;
          font-size: 11px;
        }
        
        h2 { 
          color: #2d3748; 
          font-size: 14px;
          font-weight: bold;
          margin: 6mm 0 3mm 0;
          padding-bottom: 2mm;
          border-bottom: 1px solid #e2e8f0;
          background: #f8f9fa;
          padding: 3mm;
        }
        
        .section { 
          margin-bottom: 6mm; 
          page-break-inside: avoid;
        }
        
        .summary-card {
          border: 1px solid #ddd;
          padding: 4mm;
          margin-bottom: 3mm;
          border-radius: 3px;
        }
        
        .summary-item { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 2mm;
          padding: 1mm 0;
        }
        
        .summary-label {
          color: #4a5568;
          font-weight: normal;
        }
        
        .summary-value {
          color: #2d3748;
          font-weight: bold;
          text-align: right;
        }
        
        .summary-total { 
          display: flex; 
          justify-content: space-between; 
          font-weight: bold; 
          margin-top: 3mm; 
          padding-top: 3mm; 
          border-top: 2px solid #e2e8f0; 
          background: #f0fff4;
          padding: 3mm;
          border-radius: 3px;
          font-size: 13px;
        }
        
        .badge { 
          background: #2d3748; 
          color: white; 
          padding: 1mm 2mm; 
          border-radius: 2px; 
          font-size: 10px; 
          margin-right: 2mm; 
          margin-bottom: 2mm; 
          display: inline-block;
        }
        
        .modules-container {
          display: block;
          margin-top: 2mm;
        }
        
        .investment-summary {
          background: #f8f9fa;
          padding: 4mm;
          border: 1px solid #ddd;
          margin: 4mm 0;
          border-radius: 3px;
        }
        
        .investment-grid {
          display: flex;
          justify-content: space-around;
          margin-top: 3mm;
        }
        
        .investment-item {
          text-align: center;
          padding: 2mm;
        }
        
        .investment-value {
          font-size: 16px;
          font-weight: bold;
          color: #22543d;
          margin: 2mm 0;
        }
        
        .investment-label {
          color: #4a5568;
          font-size: 11px;
        }
        
        .roi-highlight {
          background: #2d3748;
          color: white;
          padding: 4mm;
          border-radius: 3px;
          text-align: center;
          margin: 4mm 0;
        }
        
        .roi-value {
          font-size: 20px;
          font-weight: bold;
          margin: 2mm 0;
        }
        
        .benefits-section {
          background: #f8f9fa;
          padding: 4mm;
          border: 1px solid #ddd;
          margin: 4mm 0;
          border-radius: 3px;
        }
        
        .benefit-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 2mm;
        }
        
        .benefit-icon {
          color: #22543d;
          margin-right: 2mm;
          font-weight: bold;
          min-width: 3mm;
        }
        
        .footer { 
          margin-top: 8mm; 
          text-align: center; 
          font-size: 10px; 
          color: #718096;
          padding-top: 3mm;
          border-top: 1px solid #e2e8f0;
        }
        
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 5mm;
          margin: 3mm 0;
          flex-wrap: wrap;
        }
        
        .contact-item {
          text-align: center;
          font-size: 10px;
        }
        
        /* Melhorias específicas para impressão */
        @media print {
          body { 
            margin: 0; 
            padding: 10mm;
            font-size: 11px;
          }
          
          .header {
            margin-bottom: 6mm;
          }
          
          .section {
            margin-bottom: 4mm;
          }
          
          .summary-card {
            padding: 3mm;
            margin-bottom: 2mm;
          }
          
          .investment-grid {
            flex-direction: column;
            gap: 2mm;
          }
          
          .investment-item {
            padding: 1mm;
          }
          
          /* Evitar quebras de página em elementos importantes */
          h2, .summary-total, .roi-highlight {
            page-break-inside: avoid;
            page-break-after: avoid;
          }
          
          /* Controlar quebras de página */
          .section {
            page-break-inside: avoid;
          }
        }
        
        /* Layout de duas colunas para otimizar espaço */
        .two-columns {
          display: flex;
          gap: 4mm;
          margin-bottom: 4mm;
        }
        
        .column {
          flex: 1;
        }
        
        @media print {
          .two-columns {
            display: block;
          }
          
          .column {
            margin-bottom: 3mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="assets/images/logo-calculadoras.png" alt="EasyJur" class="logo" onerror="this.style.display='none'">
        <h1>PROPOSTA COMERCIAL</h1>
        <div class="subtitle">Sistema Jurídico Inteligente</div>
        <div class="proposal-info">
          <strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")} | 
          <strong>Validade:</strong> 30 dias | 
          <strong>Página:</strong> 1/1
        </div>
      </div>

      <div class="section">
        <h2>VISÃO GERAL</h2>
        <p><strong>Prezado(a) Cliente,</strong></p>
        <p>Apresentamos proposta personalizada para implementação do Sistema EasyJur em sua operação. Esta solução foi dimensionada para otimizar seus processos jurídicos e gerar economia significativa de tempo e recursos.</p>
      </div>

      <div class="two-columns">
        <div class="column">
          ${
            dadosProposta.plano
              ? `
          <div class="section">
            <h2>PLANO DE ASSINATURA</h2>
            <div class="summary-card">
              <div class="summary-item">
                <span class="summary-label">Plano</span>
                <span class="summary-value">${dadosProposta.plano.nome}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Valor Base</span>
                <span class="summary-value">${dadosProposta.plano.valorBase}</span>
              </div>
              
              <div style="margin: 2mm 0; padding: 2mm 0; border-top: 1px solid #eee;">
                <strong>Recursos Adicionais:</strong>
              </div>
              
              <div class="summary-item">
                <span class="summary-label">Usuários</span>
                <span class="summary-value">${dadosProposta.plano.usuariosAdicionais}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Notificações</span>
                <span class="summary-value">${dadosProposta.plano.pushsAdicionais}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">OABs</span>
                <span class="summary-value">${dadosProposta.plano.oabsAdicionais}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Armazenamento</span>
                <span class="summary-value">${dadosProposta.plano.gedAdicional}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">JurisAI</span>
                <span class="summary-value">${dadosProposta.plano.jurisaiTokens}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Captura</span>
                <span class="summary-value">${dadosProposta.plano.capturaProcessos}</span>
              </div>
              
              <div class="summary-total">
                <span>Total Mensal</span>
                <span>${dadosProposta.plano.totalMensal}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Implatação</span>
                <span class="summary-value">${dadosProposta.plano.implantacao}</span>
              </div>
            </div>
          </div>
          `
              : ""
          }
        </div>

        <div class="column">
          ${
            dadosProposta.migracao
              ? `
          <div class="section">
            <h2>MIGRAÇÃO DE DADOS</h2>
            <div class="summary-card">
              <div class="summary-item">
                <span class="summary-label">Processos</span>
                <span class="summary-value">${
                  dadosProposta.migracao.quantidade
                }</span>
              </div>
              
              <div class="summary-item" style="align-items: flex-start;">
                <span class="summary-label">Módulos</span>
                <div class="modules-container">
                  ${dadosProposta.migracao.modulos
                    .map((modulo) => `<span class="badge">${modulo}</span>`)
                    .join("")}
                </div>
              </div>
              
              <div class="summary-total">
                <span>Valor Total</span>
                <span>${dadosProposta.migracao.total}</span>
              </div>
            </div>
          </div>
          `
              : ""
          }

          ${
            dadosProposta.roi
              ? `
          <div class="section">
            <h2>ANÁLISE DE ROI</h2>
            <div class="summary-card">
              <div class="summary-item">
                <span class="summary-label">Processos</span>
                <span class="summary-value">${dadosProposta.roi.quantidade}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Economia Tempo</span>
                <span class="summary-value">${dadosProposta.roi.horas}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Dias Úteis</span>
                <span class="summary-value">${dadosProposta.roi.dias}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Valor Hora</span>
                <span class="summary-value">${dadosProposta.roi.valorHora}</span>
              </div>
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>

      <div class="investment-summary">
        <h2 style="text-align: center; border: none; background: none; margin: 0; padding: 0;">RESUMO DO INVESTIMENTO</h2>
        <div class="investment-grid">
          <div class="investment-item">
            <div class="investment-label">INVESTIMENTO INICIAL</div>
            <div class="investment-value">${
              dadosProposta.consolidado.totalInicial
            }</div>
            <div>Implantação + Migração</div>
          </div>
          <div class="investment-item">
            <div class="investment-label">CUSTO MENSAL</div>
            <div class="investment-value">${
              dadosProposta.consolidado.planoMensal
            }</div>
            <div>Plano + Recursos</div>
          </div>
        </div>
      </div>

      <div class="benefits-section">
        <h2>BENEFÍCIOS ESPERADOS</h2>
        <div class="benefit-item">
          <span class="benefit-icon">•</span>
          <span><strong>Economia de Tempo:</strong> ${
            dadosProposta.consolidado.tempoEconomizado
          } mensais</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">•</span>
          <span><strong>Redução de Custos:</strong> ${
            dadosProposta.consolidado.economiaFinanceira
          } em economia</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">•</span>
          <span><strong>Produtividade:</strong> Processos otimizados e automatizados</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">•</span>
          <span><strong>Segurança:</strong> Backup automático e criptografia</span>
        </div>
      </div>

      <div class="roi-highlight">
        <div style="font-size: 12px; margin-bottom: 2mm;">RETORNO SOBRE INVESTIMENTO ESTIMADO</div>
        <div class="roi-value">${dadosProposta.consolidado.roi}</div>
        <div style="font-size: 11px; opacity: 0.9;">em economia e produtividade</div>
      </div>

      <div class="section">
        <h2>CONDIÇÕES ESPECIAIS</h2>
        <div style="padding: 3mm;">
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span><strong>Suporte Dedicado:</strong> 30 dias de suporte premium incluído</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span><strong>Treinamento:</strong> Sessões de capacitação para sua equipe</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span><strong>Garantia:</strong> 15 dias de garantia de satisfação</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p><strong>EasyJur - Transformando a Gestão Jurídica</strong></p>
        <div class="contact-info">
          <div class="contact-item">www.easyjur.com</div>
          <div class="contact-item">comercial@easyjur.com.br</div>
          <div class="contact-item">(11) 99999-9999</div>
        </div>
        <p style="margin-top: 3mm; font-size: 9px; color: #a0aec0;">
          Proposta gerada em ${new Date().toLocaleString(
            "pt-BR"
          )} • Validade: 30 dias
        </p>
      </div>
    </body>
    </html>
  `;

  // Abrir nova janela para impressão/PDF
  const janelaPDF = window.open("", "_blank");
  janelaPDF.document.write(conteudoPDF);
  janelaPDF.document.close();

  // Aguardar o carregamento e então imprimir
  setTimeout(() => {
    janelaPDF.focus();
    janelaPDF.print();
  }, 500);
}

// Função auxiliar para abrir outras abas
function abrirAba(tabName) {
  // Remover classe active de todas as abas
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("tab-active");
  });

  // Adicionar classe active à aba clicada
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("tab-active");

  // Esconder todos os conteúdos
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });

  // Mostrar o conteúdo da aba selecionada
  document.getElementById(tabName).classList.remove("hidden");
}
