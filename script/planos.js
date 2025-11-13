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
