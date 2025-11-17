function formatarValorBR(valor) {
  valor = Number(valor) || 0;
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

const modulosMigracao = {
  agenda: { nome: "Agenda", valor: 0.2 },
  pedidos: { nome: "Pedidos dos Processos", valor: 0.2 },
  campos: { nome: "Campos Personalizados", valor: 0.3 },
  saneamento: { nome: "Saneamento", valor: 0.4 },
  financeiro: { nome: "Financeiro", valor: 1.1 },
  financeiroExterno: { nome: "Financeiro Externo", valor: 2.0 },
  andamentos: { nome: "Andamentos", valor: 0.2 },
  projetos: { nome: "Projetos Consultivos", valor: 0.3 },
  ged: { nome: "GED", valor: 0.5 },
  desdobramentos: { nome: "Desdobramentos", valor: 1.2 },
};

function calcularValorTotal(quantidade, modulosSelecionados) {
  let valor_parcial = 0;

  if (quantidade === 0) {
    return { valor_parcial: 0, valor_total: 0 };
  }

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

  let valor_total = valor_parcial;

  if (modulosSelecionados.agenda) valor_total += valor_parcial * 0.2;
  if (modulosSelecionados.andamentos) valor_total += valor_parcial * 0.2;
  if (modulosSelecionados.pedidos) valor_total += valor_parcial * 0.2;
  if (modulosSelecionados.projetos) valor_total += valor_parcial * 0.3;
  if (modulosSelecionados.campos) valor_total += valor_parcial * 0.3;
  if (modulosSelecionados.ged) valor_total += valor_parcial * 0.5;

  if (modulosSelecionados.financeiro) {
    let v = valor_parcial * 1.1;
    if (modulosSelecionados.financeiroExterno) v *= 2;
    valor_total += v;
  }

  if (modulosSelecionados.saneamento) valor_total += valor_parcial * 0.4;

  if (modulosSelecionados.desdobramentos) {
    valor_total += valor_parcial * 1.2;
  }

  return {
    valor_parcial: Number(valor_parcial.toFixed(2)),
    valor_total: Number(valor_total.toFixed(2)),
  };
}

$(document).ready(function () {
  $("#calcular-migracao").on("click", calcularMigracao);
  $("#calcular-roi").on("click", calcularROIMigracao);

  $("#quantidade-processos").on("input", function () {
    const quantidade = parseInt($(this).val()) || 0;

    const $desdobramentos = $("#modulo-desdobramentos");
    $desdobramentos
      .prop("disabled", false)
      .closest(".module-card")
      .removeClass("opacity-50");

    if (!$("#resultado-migracao").hasClass("hidden")) calcularMigracao();
  });

  $('input[type="checkbox"][id^="modulo-"]').on("change", function () {
    if (!$("#resultado-migracao").hasClass("hidden")) calcularMigracao();
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
    desdobramentos: $("#modulo-desdobramentos").is(":checked"),
  };

  const resultado = calcularValorTotal(
    quantidadeProcessos,
    modulosSelecionados
  );

  $("#resumo-quantidade").text(quantidadeProcessos.toLocaleString("pt-BR"));
  $("#resumo-valor-parcial").text(formatarValorBR(resultado.valor_parcial));
  $("#resumo-valor-total").text(formatarValorBR(resultado.valor_total));

  const $resumoModulos = $("#resumo-modulos");
  $resumoModulos.empty();

  const modulosNomes = [];

  if (modulosSelecionados.agenda) modulosNomes.push("Agenda");
  if (modulosSelecionados.andamentos) modulosNomes.push("Andamentos");
  if (modulosSelecionados.pedidos) modulosNomes.push("Pedidos dos Processos");
  if (modulosSelecionados.projetos) modulosNomes.push("Projetos Consultivos");
  if (modulosSelecionados.campos) modulosNomes.push("Campos Personalizados");
  if (modulosSelecionados.ged) modulosNomes.push("GED");

  if (modulosSelecionados.financeiro) {
    modulosNomes.push(
      modulosSelecionados.financeiroExterno
        ? "Financeiro + Externo"
        : "Financeiro"
    );
  }

  if (modulosSelecionados.saneamento) modulosNomes.push("Saneamento");
  if (modulosSelecionados.desdobramentos) modulosNomes.push("Desdobramentos");

  if (modulosNomes.length) {
    modulosNomes.forEach((m) =>
      $resumoModulos.append(
        `<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">${m}</span>`
      )
    );
  } else {
    $resumoModulos.html(
      '<span class="text-gray-500">Nenhum módulo selecionado</span>'
    );
  }

  $("#resultado-migracao").removeClass("hidden");

  $("#resumo-valor-total").addClass("highlight-update");
  setTimeout(() => {
    $("#resumo-valor-total").removeClass("highlight-update");
  }, 1000);
}

function calcularROIMigracao() {
  const quantidadeProcessos = parseInt($("#quantidade-processos").val()) || 0;
  const tempoPorPasta = parseInt($("#tempo-por-pasta").val());
  const valorHora = parseFloat($("#valor-hora").val());

  if (!tempoPorPasta || !valorHora) {
    $.alert({
      title: "Atenção",
      content: "Preencha todos os campos do ROI corretamente.",
      type: "orange",
    });
    return;
  }

  const totalMinutos = quantidadeProcessos * tempoPorPasta;
  const totalHoras = totalMinutos / 60;
  const totalDiasUteis = totalHoras / 8;
  const economia = totalHoras * valorHora;

  $("#roi-horas").text(`${Math.round(totalHoras)} horas`);
  $("#roi-dias").text(`${Math.round(totalDiasUteis)} dias úteis`);
  $("#roi-valor-hora").text(formatarValorBR(valorHora));
  $("#roi-economia").text(formatarValorBR(economia));

  $("#resultado-roi").removeClass("hidden");
}

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
