// Dados dos módulos de migração
const modulosMigracao = {
  agenda: { nome: "Agenda", valor: 0.5 },
  pedidos: { nome: "Pedidos dos Processos", valor: 1.0 },
  campos: { nome: "Campos Personalizados", valor: 0.8 },
  saneamento: { nome: "Saneamento", valor: 0.7 },
  financeiro: { nome: "Financeiro", valor: 1.2 },
  financeiroExterno: { nome: "Financeiro Externo", valor: 1.5 },
  andamentos: { nome: "Andamentos", valor: 0.9 },
  projetos: { nome: "Projetos Consultivos", valor: 1.1 },
  ged: { nome: "GED", valor: 1.3 },
  desdobramentos: { nome: "Desdobramentos", valor: 1.4 },
};

// Cálculo de migração
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

  // Calcular valor base
  let valorBase = 0;
  if (quantidadeProcessos <= 100) {
    valorBase = quantidadeProcessos * 2.0;
  } else if (quantidadeProcessos <= 500) {
    valorBase = quantidadeProcessos * 1.8;
  } else if (quantidadeProcessos <= 1000) {
    valorBase = quantidadeProcessos * 1.6;
  } else {
    valorBase = quantidadeProcessos * 1.4;
  }

  // Calcular valor dos módulos selecionados
  let valorModulos = 0;
  let modulosSelecionados = [];

  Object.keys(modulosMigracao).forEach((moduloKey) => {
    if ($(`#modulo-${moduloKey}`).is(":checked")) {
      const modulo = modulosMigracao[moduloKey];
      valorModulos += valorBase * modulo.valor;
      modulosSelecionados.push(modulo.nome);
    }
  });

  // Aplicar desdobramentos se selecionado e mais de 1000 processos
  if (
    $("#modulo-desdobramentos").is(":checked") &&
    quantidadeProcessos > 1000
  ) {
    valorModulos *= 1.2; // +20% para desdobramentos
  }

  const valorTotal = valorBase + valorModulos;

  // Atualizar DOM
  $("#resumo-quantidade").text(quantidadeProcessos.toLocaleString("pt-BR"));
  $("#resumo-valor-parcial").text(
    `R$ ${valorBase.toFixed(2).replace(".", ",")}`
  );
  $("#resumo-valor-total").text(
    `R$ ${valorTotal.toFixed(2).replace(".", ",")}`
  );

  // Atualizar módulos selecionados
  const $resumoModulos = $("#resumo-modulos");
  $resumoModulos.empty();

  if (modulosSelecionados.length > 0) {
    modulosSelecionados.forEach((modulo) => {
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
