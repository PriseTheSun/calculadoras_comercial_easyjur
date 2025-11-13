// Função para calcular o valor total da migração - CORRIGIDA
function calcularValorTotal(quantidade, boxes) {
  let valor_parcial = 0;

  // CORREÇÃO: Se quantidade for 0, retorna 0 imediatamente
  if (quantidade === 0) {
    return {
      valor_parcial: 0,
      valor_total: 0,
    };
  }

  // Definição do valor parcial (apenas para quantidade > 0)
  if (quantidade <= 200) {
    valor_parcial = 400;
  } else if (quantidade <= 500) {
    valor_parcial = 701.5;
  } else if (quantidade <= 800) {
    valor_parcial = 1100.5;
  } else if (quantidade <= 2000) {
    valor_parcial = 1581.1;
  } else if (quantidade <= 3000) {
    valor_parcial = 1981.1;
  } else {
    valor_parcial = quantidade * 0.33115857 + 1981.1;
  }

  // Inicializa o valor total com o valor parcial
  let valor_total = valor_parcial;

  // Cálculo de cada módulo (se marcado)
  if (boxes.agenda) valor_total += valor_parcial * 0.2;
  if (boxes.andamentos) valor_total += valor_parcial * 0.2;
  if (boxes.pedidos_dos_processos) valor_total += valor_parcial * 0.2;
  if (boxes.projetos_consultivos) valor_total += valor_parcial * 0.3;
  if (boxes.campos_personalizados) valor_total += valor_parcial * 0.3;
  if (boxes.ged) valor_total += valor_parcial * 0.5;

  if (boxes.financeiro) {
    let valor_financeiro = valor_parcial * 1.1;
    if (boxes.financeiro_externo) {
      valor_financeiro *= 2; // dobra o valor se financeiro externo estiver marcado
    }
    valor_total += valor_financeiro;
  }

  if (boxes.saneamento) valor_total += valor_parcial * 0.4;

  if (boxes.desdobramentos) {
    valor_total += quantidade > 1000 ? valor_parcial * 1.2 : valor_parcial;
  }

  return {
    valor_parcial: Number(valor_parcial.toFixed(2)),
    valor_total: Number(valor_total.toFixed(2)),
  };
}

// Função para calcular o ROI
function calcularROI(quantidade, tempo_por_pasta, valor_hora) {
  const tempo_total_minutos = tempo_por_pasta * quantidade;
  const tempo_total_horas = tempo_total_minutos / 60;
  const tempo_total_dias = Math.round(tempo_total_horas / 8); // Arredondar dias
  const economia_financeira = tempo_total_horas * valor_hora;

  return {
    tempo_total_horas: Number(tempo_total_horas.toFixed(2)),
    tempo_total_dias: tempo_total_dias,
    economia_financeira: Number(economia_financeira.toFixed(2)),
  };
}

// Função para formatar valor em reais
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Função para atualizar os resultados
function atualizarResultados() {
  // Obter valores dos inputs
  const quantidade =
    parseInt(document.getElementById("quantidade-processos").value) || 0;

  // Obter estado dos módulos
  const boxes = {
    agenda: document.getElementById("modulo-agenda").checked,
    andamentos: document.getElementById("modulo-andamentos").checked,
    pedidos_dos_processos: document.getElementById("modulo-pedidos").checked,
    projetos_consultivos: document.getElementById("modulo-projetos").checked,
    campos_personalizados: document.getElementById("modulo-campos").checked,
    ged: document.getElementById("modulo-ged").checked,
    financeiro: document.getElementById("modulo-financeiro").checked,
    financeiro_externo: document.getElementById("modulo-financeiro-externo")
      .checked,
    saneamento: document.getElementById("modulo-saneamento").checked,
    desdobramentos: document.getElementById("modulo-desdobramentos").checked,
  };

  // Calcular valores
  const resultado = calcularValorTotal(quantidade, boxes);

  // Atualizar interface
  document.getElementById("resumo-quantidade").textContent = quantidade;
  document.getElementById("resumo-valor-parcial").textContent = formatarMoeda(
    resultado.valor_parcial
  );
  document.getElementById("resumo-valor-total").textContent = formatarMoeda(
    resultado.valor_total
  );

  // Listar módulos selecionados
  const modulosSelecionados = [];
  if (boxes.agenda) modulosSelecionados.push("Agenda");
  if (boxes.andamentos) modulosSelecionados.push("Andamentos");
  if (boxes.pedidos_dos_processos)
    modulosSelecionados.push("Pedidos dos Processos");
  if (boxes.projetos_consultivos)
    modulosSelecionados.push("Projetos Consultivos");
  if (boxes.campos_personalizados)
    modulosSelecionados.push("Campos Personalizados");
  if (boxes.ged) modulosSelecionados.push("GED");
  if (boxes.financeiro) {
    if (boxes.financeiro_externo) {
      modulosSelecionados.push("Financeiro + Externo");
    } else {
      modulosSelecionados.push("Financeiro");
    }
  }
  if (boxes.saneamento) modulosSelecionados.push("Saneamento");
  if (boxes.desdobramentos) modulosSelecionados.push("Desdobramentos");

  // Atualizar badges dos módulos selecionados
  const modulosContainer = document.getElementById("resumo-modulos");
  modulosContainer.innerHTML = "";

  if (modulosSelecionados.length === 0) {
    const emptyMsg = document.createElement("span");
    emptyMsg.className = "text-gray-500 text-sm";
    emptyMsg.textContent = "Nenhum módulo selecionado";
    modulosContainer.appendChild(emptyMsg);
  } else {
    modulosSelecionados.forEach((modulo) => {
      const badge = document.createElement("span");
      badge.className =
        "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm";
      badge.textContent = modulo;
      modulosContainer.appendChild(badge);
    });
  }

  // Efeito de destaque na atualização
  document
    .getElementById("resumo-valor-total")
    .classList.add("highlight-update");
  setTimeout(() => {
    document
      .getElementById("resumo-valor-total")
      .classList.remove("highlight-update");
  }, 1000);

  // Mostrar resultado se ainda não estiver visível
  const resultadoMigracao = document.getElementById("resultado-migracao");
  if (!resultadoMigracao.classList.contains("hidden")) {
    resultadoMigracao.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

// Eventos quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // Navegação entre páginas
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetPage = this.getAttribute("data-page");

      // Atualizar estado dos links de navegação
      navLinks.forEach((navLink) => {
        navLink.classList.remove("easyjur-text-dark");
        navLink.classList.add("easyjur-text-gray");
      });
      this.classList.remove("easyjur-text-gray");
      this.classList.add("easyjur-text-dark");

      // Mostrar página selecionada
      pages.forEach((page) => {
        page.classList.remove("active");
      });
      document.getElementById(targetPage).classList.add("active");
    });
  });

  // Menu mobile
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Atualização dinâmica ao alterar quantidade
  document
    .getElementById("quantidade-processos")
    .addEventListener("input", atualizarResultados);

  // Atualização dinâmica ao alterar switches
  const switches = document.querySelectorAll(".switch input");
  switches.forEach((switchElement) => {
    switchElement.addEventListener("change", atualizarResultados);
  });

  // Botão Calcular Migração
  const calcularMigracaoBtn = document.getElementById("calcular-migracao");
  const resultadoMigracao = document.getElementById("resultado-migracao");

  calcularMigracaoBtn.addEventListener("click", function () {
    atualizarResultados();

    // Mostrar resultado
    resultadoMigracao.classList.remove("hidden");

    // Scroll para o resultado
    resultadoMigracao.scrollIntoView({ behavior: "smooth" });
  });

  // Botão Calcular ROI
  const calcularROIBtn = document.getElementById("calcular-roi");
  const resultadoROI = document.getElementById("resultado-roi");

  calcularROIBtn.addEventListener("click", function () {
    // Obter valores dos inputs
    const quantidade =
      parseInt(document.getElementById("quantidade-processos").value) || 0;
    const tempoPorPasta =
      parseInt(document.getElementById("tempo-por-pasta").value) || 0;
    const valorHora =
      parseFloat(document.getElementById("valor-hora").value) || 0;

    // Calcular ROI
    const roi = calcularROI(quantidade, tempoPorPasta, valorHora);

    // Atualizar interface
    document.getElementById(
      "roi-horas"
    ).textContent = `${roi.tempo_total_horas} horas`;
    document.getElementById(
      "roi-dias"
    ).textContent = `${roi.tempo_total_dias} dias`;
    document.getElementById("roi-valor-hora").textContent =
      formatarMoeda(valorHora);
    document.getElementById("roi-economia").textContent = formatarMoeda(
      roi.economia_financeira
    );

    // Mostrar resultado
    resultadoROI.classList.remove("hidden");
  });

  // Botão de imprimir - CORRIGIDO
  const botaoImprimir = document.getElementById("botao-imprimir");
  if (botaoImprimir) {
    botaoImprimir.addEventListener("click", function () {
      // Atualizar dados na proposta de impressão
      const now = new Date();
      document.getElementById("print-data").textContent =
        now.toLocaleDateString("pt-BR");
      document.getElementById("print-ano").textContent = now.getFullYear();
      document.getElementById("print-quantidade").textContent =
        document.getElementById("resumo-quantidade").textContent;
      document.getElementById("print-valor-parcial").textContent =
        document.getElementById("resumo-valor-parcial").textContent;
      document.getElementById("print-valor-total").textContent =
        document.getElementById("resumo-valor-total").textContent;

      // Atualizar módulos na impressão
      const modulosContainer = document.getElementById("print-modulos");
      modulosContainer.innerHTML = "";
      const modulos = document.querySelectorAll("#resumo-modulos span");

      if (
        modulos.length === 0 ||
        modulos[0].classList.contains("text-gray-500")
      ) {
        const emptyMsg = document.createElement("span");
        emptyMsg.className = "print-module-badge";
        emptyMsg.textContent = "Nenhum módulo selecionado";
        modulosContainer.appendChild(emptyMsg);
      } else {
        modulos.forEach((modulo) => {
          const badge = document.createElement("span");
          badge.className = "print-module-badge";
          badge.textContent = modulo.textContent;
          modulosContainer.appendChild(badge);
        });
      }

      // Atualizar ROI na impressão, se disponível
      if (
        !document.getElementById("resultado-roi").classList.contains("hidden")
      ) {
        document.getElementById("print-tempo-economizado").textContent = `${
          document.getElementById("roi-horas").textContent
        } (${document.getElementById("roi-dias").textContent} dias úteis)`;
        document.getElementById("print-economia-financeira").textContent =
          document.getElementById("roi-economia").textContent;
        document.getElementById("print-valor-hora").textContent =
          document.getElementById("roi-valor-hora").textContent;
      } else {
        document.getElementById("print-tempo-economizado").textContent =
          "Não calculado";
        document.getElementById("print-economia-financeira").textContent =
          "Não calculado";
      }

      // Mostrar a proposta de impressão e imprimir
      const proposta = document.getElementById("proposta-impressao");
      proposta.classList.remove("hidden");

      setTimeout(() => {
        window.print();
        // Esconder novamente após a impressão
        setTimeout(() => {
          proposta.classList.add("hidden");
        }, 100);
      }, 100);
    });
  }
});
