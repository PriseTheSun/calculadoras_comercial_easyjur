// Dados dos planos
const planos = {
  premium: {
    nome: "Premium",
    valorBase: 389,
    usuariosInclusos: 5,
    pushsInclusos: 300,
    oabsInclusas: 1,
    gedIncluso: 30,
    valorUsuario: 60,
  },
  standard: {
    nome: "Standard",
    valorBase: 599,
    usuariosInclusos: 10,
    pushsInclusos: 800,
    oabsInclusas: 2,
    gedIncluso: 40,
    valorUsuario: 70,
  },
  growth: {
    nome: "Growth",
    valorBase: 1699,
    usuariosInclusos: 15,
    pushsInclusos: 2000,
    oabsInclusas: 3,
    gedIncluso: 80,
    valorUsuario: 80,
  },
  "growth-plus": {
    nome: "Growth Plus",
    valorBase: 2799,
    usuariosInclusos: 30,
    pushsInclusos: 4000,
    oabsInclusas: 5,
    gedIncluso: 200,
    valorUsuario: 100,
  },
};

// Variáveis globais
let planoSelecionado = null;

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  // Navegação entre páginas
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Atualizar navegação
      navLinks.forEach((l) => l.classList.remove("easyjur-text-dark"));
      navLinks.forEach((l) => l.classList.add("easyjur-text-gray"));
      this.classList.remove("easyjur-text-gray");
      this.classList.add("easyjur-text-dark");

      // Mostrar página selecionada
      const pageId = this.getAttribute("data-page");
      document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
      });
      document.getElementById(pageId).classList.add("active");

      // Fechar menu mobile se estiver aberto
      document.getElementById("mobile-menu").classList.add("hidden");
    });
  });

  // Menu mobile
  document
    .getElementById("mobile-menu-button")
    .addEventListener("click", function () {
      document.getElementById("mobile-menu").classList.toggle("hidden");
    });

  // Botões de calcular plano
  document.querySelectorAll(".calcular-plano").forEach((button) => {
    button.addEventListener("click", function () {
      const plano = this.getAttribute("data-plano");
      selecionarPlano(plano);

      // Ir para a página de planos se não estiver nela
      document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
      });
      document.getElementById("planos").classList.add("active");

      // Atualizar navegação
      navLinks.forEach((l) => l.classList.remove("easyjur-text-dark"));
      navLinks.forEach((l) => l.classList.add("easyjur-text-gray"));
      document
        .querySelector('[data-page="planos"]')
        .classList.remove("easyjur-text-gray");
      document
        .querySelector('[data-page="planos"]')
        .classList.add("easyjur-text-dark");
    });
  });

  // Eventos para atualizar o resumo
  document
    .getElementById("usuarios-adicionais")
    .addEventListener("input", atualizarResumo);
  document
    .getElementById("pushs-adicionais")
    .addEventListener("input", atualizarResumo);
  document
    .getElementById("oabs-adicionais")
    .addEventListener("input", atualizarResumo);
  document
    .getElementById("ged-adicional")
    .addEventListener("input", atualizarResumo);
  document
    .getElementById("captura-processos")
    .addEventListener("change", function () {
      document
        .getElementById("quantidade-processos-container")
        .classList.toggle("hidden", !this.checked);
      atualizarResumo();
    });
  document
    .getElementById("quantidade-processos")
    .addEventListener("input", atualizarResumo);
  document
    .getElementById("jurisai-tokens")
    .addEventListener("change", atualizarResumo);
});

// Função para selecionar um plano
function selecionarPlano(plano) {
  planoSelecionado = planos[plano];

  // Atualizar título
  document.getElementById(
    "titulo-configuracao"
  ).textContent = `Configuração do Plano ${planoSelecionado.nome}`;

  // Atualizar valor por usuário
  document.getElementById(
    "valor-usuario"
  ).textContent = `Valor por usuário: R$ ${planoSelecionado.valorUsuario}`;

  // Mostrar container de configuração
  document.getElementById("configuracao-plano").classList.remove("hidden");

  // Rolar para a configuração do plano
  document
    .getElementById("configuracao-plano")
    .scrollIntoView({ behavior: "smooth" });

  // Atualizar resumo
  atualizarResumo();
}

// Função para atualizar o resumo
function atualizarResumo() {
  if (!planoSelecionado) return;

  // Obter valores dos inputs
  const usuariosAdicionais =
    parseInt(document.getElementById("usuarios-adicionais").value) || 0;
  const pushsAdicionais =
    parseInt(document.getElementById("pushs-adicionais").value) || 0;
  const oabsAdicionais =
    parseInt(document.getElementById("oabs-adicionais").value) || 0;
  const gedAdicional =
    parseInt(document.getElementById("ged-adicional").value) || 0;
  const capturaProcessosAtiva =
    document.getElementById("captura-processos").checked;
  const quantidadeProcessos =
    parseInt(document.getElementById("quantidade-processos").value) || 0;
  const jurisaiTokens =
    parseInt(document.getElementById("jurisai-tokens").value) || 0;

  // Calcular valores
  const valorUsuariosAdicionais =
    usuariosAdicionais * planoSelecionado.valorUsuario;
  const valorPushsAdicionais = pushsAdicionais * 30;
  const valorOabsAdicionais = oabsAdicionais * 60;
  const valorGedAdicional = gedAdicional * 8;

  // Calcular valor da captura de processos
  let valorCapturaProcessos = 0;
  if (capturaProcessosAtiva && quantidadeProcessos > 0) {
    const valorPorProcesso = quantidadeProcessos >= 500 ? 1.0 : 1.5;
    valorCapturaProcessos = quantidadeProcessos * valorPorProcesso;
  }

  // Calcular total mensal
  const valorTotalMensal =
    planoSelecionado.valorBase +
    valorUsuariosAdicionais +
    valorPushsAdicionais +
    valorOabsAdicionais +
    valorGedAdicional +
    valorCapturaProcessos +
    jurisaiTokens;

  // Atualizar resumo
  document.getElementById(
    "valor-plano-base"
  ).textContent = `R$ ${planoSelecionado.valorBase.toLocaleString("pt-BR")}`;
  document.getElementById(
    "valor-usuarios-adicionais"
  ).textContent = `R$ ${valorUsuariosAdicionais.toLocaleString("pt-BR")}`;
  document.getElementById(
    "valor-pushs-adicionais"
  ).textContent = `R$ ${valorPushsAdicionais.toLocaleString("pt-BR")}`;
  document.getElementById(
    "valor-oabs-adicionais"
  ).textContent = `R$ ${valorOabsAdicionais.toLocaleString("pt-BR")}`;
  document.getElementById(
    "valor-ged-adicional"
  ).textContent = `R$ ${valorGedAdicional.toLocaleString("pt-BR")}`;
  document.getElementById(
    "valor-captura-processos"
  ).textContent = `R$ ${valorCapturaProcessos.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
  document.getElementById(
    "valor-jurisai-tokens"
  ).textContent = `R$ ${jurisaiTokens.toLocaleString("pt-BR")}`;
  document.getElementById(
    "valor-total-mensal"
  ).textContent = `R$ ${valorTotalMensal.toLocaleString("pt-BR")}`;
}

// Função para criar e imprimir proposta personalizada
function imprimirPropostaPersonalizada() {
  if (!planoSelecionado) {
    alert("Por favor, selecione um plano primeiro.");
    return;
  }

  // Obter valores atuais
  const usuariosAdicionais =
    parseInt(document.getElementById("usuarios-adicionais").value) || 0;
  const pushsAdicionais =
    parseInt(document.getElementById("pushs-adicionais").value) || 0;
  const oabsAdicionais =
    parseInt(document.getElementById("oabs-adicionais").value) || 0;
  const gedAdicional =
    parseInt(document.getElementById("ged-adicional").value) || 0;
  const capturaProcessosAtiva =
    document.getElementById("captura-processos").checked;
  const quantidadeProcessos =
    parseInt(document.getElementById("quantidade-processos").value) || 0;
  const jurisaiTokens =
    parseInt(document.getElementById("jurisai-tokens").value) || 0;

  // Calcular totais
  const valorUsuariosAdicionais =
    usuariosAdicionais * planoSelecionado.valorUsuario;
  const valorPushsAdicionais = pushsAdicionais * 30;
  const valorOabsAdicionais = oabsAdicionais * 60;
  const valorGedAdicional = gedAdicional * 8;

  let valorCapturaProcessos = 0;
  if (capturaProcessosAtiva && quantidadeProcessos > 0) {
    const valorPorProcesso = quantidadeProcessos >= 500 ? 1.0 : 1.5;
    valorCapturaProcessos = quantidadeProcessos * valorPorProcesso;
  }

  const valorTotalMensal =
    planoSelecionado.valorBase +
    valorUsuariosAdicionais +
    valorPushsAdicionais +
    valorOabsAdicionais +
    valorGedAdicional +
    valorCapturaProcessos +
    jurisaiTokens;

  // Criar conteúdo da impressão
  const conteudoImpressao = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proposta Comercial - EasyJur</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #333;
                background: white;
                padding: 30px;
            }
            
            .print-container {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            
            .title {
                font-size: 28px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .subtitle {
                font-size: 18px;
                color: #6b7280;
                margin-bottom: 30px;
            }
            
            .copy-text {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
                border-left: 4px solid #10b981;
            }
            
            .section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-size: 20px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .plano-info {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .plano-name {
                font-size: 24px;
                font-weight: 700;
                color: #059669;
                margin-bottom: 15px;
            }
            
            .resumo-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .resumo-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #f3f4f6;
            }
            
            .resumo-total {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                border-top: 2px solid #e5e7eb;
                font-weight: 700;
                font-size: 18px;
                color: #059669;
            }
            
            .detalhes-adicionais {
                background: #f8fafc;
                padding: 15px;
                border-radius: 6px;
                margin-top: 20px;
            }
            
            .agradecimento {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e5e7eb;
                color: #6b7280;
            }
            
            .contact-info {
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
                color: #6b7280;
            }
            
            .valor {
                font-weight: 600;
                color: #1f2937;
            }
            
            @media print {
                body {
                    padding: 0;
                }
                
                .print-container {
                    max-width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="print-container">
            <div class="header">
                <div class="logo">
                    
                </div>
                <h1 class="title">
                <img src="/imagens/logo-calculadoras.png" alt="EasyJur" style="max-width: 180px;">
                Proposta Comercial
                
                </h1>
                <p class="subtitle">Solução completa para gestão jurídica inteligente</p>
            </div>
            
            <div class="copy-text">
                <p><strong>Prezado(a) Cliente,</strong></p>
                <p>É com grande satisfação que apresentamos esta proposta personalizada para sua empresa. Desenvolvemos uma solução sob medida que atenderá às suas necessidades específicas de gestão jurídica, combinando tecnologia de ponta com a expertise do mercado jurídico.</p>
            </div>
            
            <div class="section">
                <h2 class="section-title">Detalhes do Plano Selecionado</h2>
                <div class="plano-info">
                    <div class="plano-name">Plano ${planoSelecionado.nome}</div>
                    
                    <div class="resumo-grid">
                        <div>
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #374151;">Recursos Inclusos:</h3>
                            <div class="resumo-item">
                                <span>Usuários inclusos:</span>
                                <span class="valor">${
                                  planoSelecionado.usuariosInclusos
                                }</span>
                            </div>
                            <div class="resumo-item">
                                <span>Pushs mensais:</span>
                                <span class="valor">${planoSelecionado.pushsInclusos.toLocaleString(
                                  "pt-BR"
                                )}</span>
                            </div>
                            <div class="resumo-item">
                                <span>OABs inclusas:</span>
                                <span class="valor">${
                                  planoSelecionado.oabsInclusas
                                }</span>
                            </div>
                            <div class="resumo-item">
                                <span>Armazenamento GED:</span>
                                <span class="valor">${
                                  planoSelecionado.gedIncluso
                                } GB</span>
                            </div>
                        </div>
                        
                        <div>
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #374151;">Personalizações:</h3>
                            <div class="resumo-item">
                                <span>Usuários adicionais:</span>
                                <span class="valor">${usuariosAdicionais}</span>
                            </div>
                            <div class="resumo-item">
                                <span>Pushs adicionais:</span>
                                <span class="valor">${
                                  pushsAdicionais * 100
                                }</span>
                            </div>
                            <div class="resumo-item">
                                <span>OABs adicionais:</span>
                                <span class="valor">${oabsAdicionais}</span>
                            </div>
                            <div class="resumo-item">
                                <span>GED adicional:</span>
                                <span class="valor">${gedAdicional} GB</span>
                            </div>
                            ${
                              capturaProcessosAtiva
                                ? `
                            <div class="resumo-item">
                                <span>Captura de processos:</span>
                                <span class="valor">${quantidadeProcessos}</span>
                            </div>
                            `
                                : ""
                            }
                            ${
                              jurisaiTokens > 0
                                ? `
                            <div class="resumo-item">
                                <span>JurisAI Tokens:</span>
                                <span class="valor">Incluído</span>
                            </div>
                            `
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">Resumo Financeiro</h2>
                <div class="plano-info">
                    <div class="resumo-item">
                        <span>Valor do plano base:</span>
                        <span class="valor">R$ ${planoSelecionado.valorBase.toLocaleString(
                          "pt-BR"
                        )}</span>
                    </div>
                    ${
                      usuariosAdicionais > 0
                        ? `
                    <div class="resumo-item">
                        <span>Usuários adicionais (${usuariosAdicionais} × R$ ${
                            planoSelecionado.valorUsuario
                          }):</span>
                        <span class="valor">R$ ${valorUsuariosAdicionais.toLocaleString(
                          "pt-BR"
                        )}</span>
                    </div>
                    `
                        : ""
                    }
                    ${
                      pushsAdicionais > 0
                        ? `
                    <div class="resumo-item">
                        <span>Pushs adicionais (${pushsAdicionais} × R$ 30):</span>
                        <span class="valor">R$ ${valorPushsAdicionais.toLocaleString(
                          "pt-BR"
                        )}</span>
                    </div>
                    `
                        : ""
                    }
                    ${
                      oabsAdicionais > 0
                        ? `
                    <div class="resumo-item">
                        <span>OABs adicionais (${oabsAdicionais} × R$ 60):</span>
                        <span class="valor">R$ ${valorOabsAdicionais.toLocaleString(
                          "pt-BR"
                        )}</span>
                    </div>
                    `
                        : ""
                    }
                    ${
                      gedAdicional > 0
                        ? `
                    <div class="resumo-item">
                        <span>GED adicional (${gedAdicional} GB × R$ 8):</span>
                        <span class="valor">R$ ${valorGedAdicional.toLocaleString(
                          "pt-BR"
                        )}</span>
                    </div>
                    `
                        : ""
                    }
                    ${
                      capturaProcessosAtiva && quantidadeProcessos > 0
                        ? `
                    <div class="resumo-item">
                        <span>Captura de processos (${quantidadeProcessos} processos):</span>
                        <span class="valor">R$ ${valorCapturaProcessos.toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2 }
                        )}</span>
                    </div>
                    `
                        : ""
                    }
                    ${
                      jurisaiTokens > 0
                        ? `
                    <div class="resumo-item">
                        <span>JurisAI Tokens Extra:</span>
                        <span class="valor">R$ ${jurisaiTokens.toLocaleString(
                          "pt-BR"
                        )}</span>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="resumo-total">
                        <span>Valor Total Mensal:</span>
                        <span>R$ ${valorTotalMensal.toLocaleString(
                          "pt-BR"
                        )}</span>
                    </div>
                </div>
                
                <div class="detalhes-adicionais">
                    <p><strong>Observações:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Valores em Reais (R$)</li>
                        <li>Cobrança mensal recorrente</li>
                        <li>Suporte técnico especializado incluído</li>
                        <li>Atualizações constantes da plataforma</li>
                    </ul>
                </div>
            </div>
            
            <div class="agradecimento">
                <p><strong>Agradecemos pela oportunidade!</strong></p>
                <p>Estamos à disposição para esclarecer qualquer dúvida e auxiliar no processo de implementação.</p>
            </div>
            
            <div class="contact-info">
                <p>EasyJur - Transformando a gestão jurídica brasileira</p>
                <p>📞 (34) 3312-8082 | ✉️ comercial@easyjur.com | 🌐 easyjur.com</p>
            </div>
        </div>
    </body>
    </html>
  `;

  // Abrir janela de impressão
  const janelaImpressao = window.open("", "_blank");
  janelaImpressao.document.write(conteudoImpressao);
  janelaImpressao.document.close();

  // Aguardar o carregamento da imagem antes de imprimir
  janelaImpressao.onload = function () {
    setTimeout(() => {
      janelaImpressao.print();
      // janelaImpressao.close(); // Opcional: fechar após imprimir
    }, 500);
  };
}

// Adicionar funcionalidade de impressão personalizada
document
  .getElementById("botao-imprimir")
  .addEventListener("click", function () {
    imprimirPropostaPersonalizada();
  });
