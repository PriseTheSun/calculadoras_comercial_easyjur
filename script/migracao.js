// Função para calcular o valor total da migração
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
  const quantidade = parseInt($("#quantidade-processos").val()) || 0;

  // Obter estado dos módulos
  const boxes = {
    agenda: $("#modulo-agenda").is(":checked"),
    andamentos: $("#modulo-andamentos").is(":checked"),
    pedidos_dos_processos: $("#modulo-pedidos").is(":checked"),
    projetos_consultivos: $("#modulo-projetos").is(":checked"),
    campos_personalizados: $("#modulo-campos").is(":checked"),
    ged: $("#modulo-ged").is(":checked"),
    financeiro: $("#modulo-financeiro").is(":checked"),
    financeiro_externo: $("#modulo-financeiro-externo").is(":checked"),
    saneamento: $("#modulo-saneamento").is(":checked"),
    desdobramentos: $("#modulo-desdobramentos").is(":checked"),
  };

  // Calcular valores
  const resultado = calcularValorTotal(quantidade, boxes);

  // Atualizar interface
  $("#resumo-quantidade").text(quantidade);
  $("#resumo-valor-parcial").text(formatarMoeda(resultado.valor_parcial));
  $("#resumo-valor-total").text(formatarMoeda(resultado.valor_total));

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
  const modulosContainer = $("#resumo-modulos");
  modulosContainer.empty();

  if (modulosSelecionados.length === 0) {
    modulosContainer.append(
      '<span class="text-gray-500 text-sm">Nenhum módulo selecionado</span>'
    );
  } else {
    modulosSelecionados.forEach((modulo) => {
      modulosContainer.append(
        `<span class="badge badge-green">${modulo}</span>`
      );
    });
  }

  // Efeito de destaque na atualização
  $("#resumo-valor-total").addClass("highlight-update");
  setTimeout(() => {
    $("#resumo-valor-total").removeClass("highlight-update");
  }, 1000);
}

// Inicialização da aba de migração
function inicializarAbaMigracao() {
  // Atualização dinâmica ao alterar quantidade
  $("#quantidade-processos").on("input", atualizarResultados);

  // Atualização dinâmica ao alterar switches
  $(".switch input").on("change", atualizarResultados);

  // Botão Calcular Migração
  $("#calcular-migracao").on("click", function () {
    atualizarResultados();

    // Mostrar resultado
    $("#resultado-migracao").removeClass("hidden");

    // Scroll para o resultado
    $("html, body").animate(
      {
        scrollTop: $("#resultado-migracao").offset().top - 100,
      },
      1000
    );
  });

  // Botão Calcular ROI
  $("#calcular-roi").on("click", function () {
    // Obter valores dos inputs
    const quantidade = parseInt($("#quantidade-processos").val()) || 0;
    const tempoPorPasta = parseInt($("#tempo-por-pasta").val()) || 0;
    const valorHora = parseFloat($("#valor-hora").val()) || 0;

    // Calcular ROI
    const roi = calcularROI(quantidade, tempoPorPasta, valorHora);

    // Atualizar interface
    $("#roi-horas").text(`${roi.tempo_total_horas} horas`);
    $("#roi-dias").text(`${roi.tempo_total_dias} dias`);
    $("#roi-valor-hora").text(formatarMoeda(valorHora));
    $("#roi-economia").text(formatarMoeda(roi.economia_financeira));

    // Mostrar resultado
    $("#resultado-roi").removeClass("hidden");
  });
}

// Inicializar quando o documento estiver pronto
$(document).ready(function () {
  inicializarAbaMigracao();
});
