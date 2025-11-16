// migracao.js

// Dados dos módulos de migração - ATUALIZADO com os valores corretos
const modulosMigracao = {
  agenda: { nome: "Agenda", valor: 0.2 },
  pedidos: { nome: "Pedidos dos Processos", valor: 0.2 },
  campos: { nome: "Campos Personalizados", valor: 0.3 },
  saneamento: { nome: "Saneamento", valor: 0.4 },
  financeiro: { nome: "Financeiro", valor: 1.1 },
  financeiroExterno: { nome: "Financeiro Externo", valor: 2.0 }, // multiplicador
  andamentos: { nome: "Andamentos", valor: 0.2 },
  projetos: { nome: "Projetos Consultivos", valor: 0.3 },
  ged: { nome: "GED", valor: 0.5 },
  desdobramentos: { nome: "Desdobramentos", valor: 1.2 },
};

// Função para calcular valor total CORRIGIDA
function calcularValorTotal(quantidade, modulosSelecionados) {
  let valor_parcial = 0;

  // CORREÇÃO: Se quantidade for 0, retorna 0 imediatamente
  if (quantidade === 0) {
    return {
      valor_parcial: 0,
      valor_total: 0,
    };
  }

  // Definição do valor parcial (apenas para quantidade > 0) - USANDO SWITCH
  switch (true) {
    case quantidade <= 200:
      valor_parcial = 400;
      break;
    case quantidade <= 500:
      valor_parcial = 701.5;
      break;
    case quantidade <= 800:
      valor_parcial = 1100.5;
      break;
    case quantidade <= 2000:
      valor_parcial = 1581.1;
      break;
    case quantidade <= 3000:
      valor_parcial = 1981.1;
      break;
    default:
      valor_parcial = quantidade * 0.33115857 + 1981.1;
      break;
  }

  // Inicializa o valor total com o valor parcial
  let valor_total = valor_parcial;

  // Cálculo de cada módulo (se marcado) - CORRIGIDO
  if (modulosSelecionados.agenda) valor_total += valor_parcial * 0.2;
  if (modulosSelecionados.andamentos) valor_total += valor_parcial * 0.2;
  if (modulosSelecionados.pedidos) valor_total += valor_parcial * 0.2;
  if (modulosSelecionados.projetos) valor_total += valor_parcial * 0.3;
  if (modulosSelecionados.campos) valor_total += valor_parcial * 0.3;
  if (modulosSelecionados.ged) valor_total += valor_parcial * 0.5;

  // Lógica específica para financeiro - CORRIGIDA
  if (modulosSelecionados.financeiro) {
    let valor_financeiro = valor_parcial * 1.1;
    if (modulosSelecionados.financeiroExterno) {
      valor_financeiro *= 2; // dobra o valor se financeiro externo estiver marcado
    }
    valor_total += valor_financeiro;
  }

  if (modulosSelecionados.saneamento) valor_total += valor_parcial * 0.4;

  // Lógica específica para desdobramentos - CORRIGIDA
  if (modulosSelecionados.desdobramentos) {
    valor_total += quantidade > 1000 ? valor_parcial * 1.2 : valor_parcial;
  }

  return {
    valor_parcial: Number(valor_parcial.toFixed(2)),
    valor_total: Number(valor_total.toFixed(2)),
  };
}

// Cálculo de migração CORRIGIDO
$(document).ready(function () {
  // Calcular migração quando o botão for clicado
  $("#calcular-migracao").on("click", function () {
    calcularMigracao();
  });

  // Calcular ROI da migração
  $("#calcular-roi").on("click", function () {
    calcularROIMigracao();
  });

  // Habilitar/desabilitar desdobramentos baseado na quantidade de processos
  $("#quantidade-processos").on("input", function () {
    const quantidade = parseInt($(this).val()) || 0;
    const $desdobramentos = $("#modulo-desdobramentos");

    if (quantidade > 1000) {
      $desdobramentos.prop("disabled", false);
      $desdobramentos.closest(".module-card").removeClass("opacity-50");
    } else {
      $desdobramentos.prop("disabled", true);
      $desdobramentos.prop("checked", false);
      $desdobramentos.closest(".module-card").addClass("opacity-50");
    }

    // Recalcular automaticamente se já tiver calculado antes
    if (!$("#resultado-migracao").hasClass("hidden")) {
      calcularMigracao();
    }
  });

  // Recalcular automaticamente quando mudar qualquer módulo
  $('input[type="checkbox"][id^="modulo-"]').on("change", function () {
    if (!$("#resultado-migracao").hasClass("hidden")) {
      calcularMigracao();
    }
  });
});

function calcularMigracao() {
  const quantidadeProcessos = parseInt($("#quantidade-processos").val()) || 0;

  if (quantidadeProcessos === 0) {
    $.alert({
      title: "Atenção",
      content: "Informe a quantidade de processos para calcular a migração.",
      type: "orange",
    });
    return;
  }

  // Obter módulos selecionados - CORRIGIDO
  const modulosSelecionados = {
    agenda: $("#modulo-agenda").is(":checked"),
    pedidos: $("#modulo-pedidos").is(":checked"),
    campos: $("#modulo-campos").is(":checked"),
    saneamento: $("#modulo-saneamento").is(":checked"),
    financeiro: $("#modulo-financeiro").is(":checked"),
    financeiroExterno: $("#modulo-financeiro-externo").is(":checked"),
    andamentos: $("#modulo-andamentos").is(":checked"),
    projetos: $("#modulo-projetos").is(":checked"),
    ged: $("#modulo-ged").is(":checked"),
    desdobramentos:
      $("#modulo-desdobramentos").is(":checked") && quantidadeProcessos > 1000,
  };

  // Calcular usando a função corrigida - CORRIGIDO
  const resultado = calcularValorTotal(
    quantidadeProcessos,
    modulosSelecionados
  );

  // Atualizar DOM
  $("#resumo-quantidade").text(quantidadeProcessos.toLocaleString("pt-BR"));
  $("#resumo-valor-parcial").text(
    `R$ ${resultado.valor_parcial.toFixed(2).replace(".", ",")}`
  );
  $("#resumo-valor-total").text(
    `R$ ${resultado.valor_total.toFixed(2).replace(".", ",")}`
  );

  // Atualizar módulos selecionados - CORRIGIDO
  const $resumoModulos = $("#resumo-modulos");
  $resumoModulos.empty();

  const modulosNomes = [];
  if (modulosSelecionados.agenda) modulosNomes.push("Agenda");
  if (modulosSelecionados.andamentos) modulosNomes.push("Andamentos");
  if (modulosSelecionados.pedidos) modulosNomes.push("Pedidos dos Processos");
  if (modulosSelecionados.projetos) modulosNomes.push("Projetos Consultivos");
  if (modulosSelecionados.campos) modulosNomes.push("Campos Personalizados");
  if (modulosSelecionados.ged) modulosNomes.push("GED");

  // Lógica específica para financeiro - CORRIGIDA
  if (modulosSelecionados.financeiro) {
    if (modulosSelecionados.financeiroExterno) {
      modulosNomes.push("Financeiro + Externo");
    } else {
      modulosNomes.push("Financeiro");
    }
  }

  if (modulosSelecionados.saneamento) modulosNomes.push("Saneamento");
  if (modulosSelecionados.desdobramentos) modulosNomes.push("Desdobramentos");

  if (modulosNomes.length > 0) {
    modulosNomes.forEach((modulo) => {
      const badge = $(`
        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          ${modulo}
        </span>
      `);
      $resumoModulos.append(badge);
    });
  } else {
    $resumoModulos.html(
      '<span class="text-gray-500">Nenhum módulo selecionado</span>'
    );
  }

  // Mostrar resultado
  $("#resultado-migracao").removeClass("hidden");

  // Efeito visual de atualização
  $("#resumo-valor-total").addClass("highlight-update");
  setTimeout(() => {
    $("#resumo-valor-total").removeClass("highlight-update");
  }, 1000);
}

function calcularROIMigracao() {
  const quantidadeProcessos = parseInt($("#quantidade-processos").val()) || 0;
  const tempoPorPasta = parseInt($("#tempo-por-pasta").val()) || 15;
  const valorHora = parseFloat($("#valor-hora").val()) || 80;

  if (quantidadeProcessos === 0) {
    $.alert({
      title: "Atenção",
      content: "Informe a quantidade de processos para calcular o ROI.",
      type: "orange",
    });
    return;
  }

  // Cálculo do tempo economizado
  const totalMinutos = quantidadeProcessos * tempoPorPasta;
  const totalHoras = totalMinutos / 60;
  const totalDiasUteis = totalHoras / 8;

  // Cálculo da economia financeira
  const economia = totalHoras * valorHora;

  // Atualizar DOM
  $("#roi-horas").text(`${Math.round(totalHoras)} horas`);
  $("#roi-dias").text(`${Math.round(totalDiasUteis)} dias úteis`);
  $("#roi-valor-hora").text(`R$ ${valorHora.toFixed(2).replace(".", ",")}`);
  $("#roi-economia").text(`R$ ${economia.toFixed(2).replace(".", ",")}`);

  // Mostrar resultado
  $("#resultado-roi").removeClass("hidden");
}

// Adicionar CSS para o efeito visual
const style = document.createElement("style");
style.textContent = `
  .highlight-update {
    animation: highlight-pulse 1s ease-in-out;
  }
  
  @keyframes highlight-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
