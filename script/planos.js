$(document).ready(function () {
  // Variáveis para armazenar dados do plano selecionado
  let selectedPlan = null;
  const planData = {
    premium: {
      name: "Premium",
      basePrice: 389,
      implementation: 600,
      userPrice: 60,
    },
    standard: {
      name: "Standard",
      basePrice: 599,
      implementation: 1990,
      userPrice: 70,
    },
    growth: {
      name: "Growth",
      basePrice: 1699,
      implementation: 3990,
      userPrice: 80,
    },
    "growth-plus": {
      name: "Growth Plus",
      basePrice: 2799,
      implementation: 3990,
      userPrice: 100,
    },
  };

  // Seleção de plano
  $(".calculate-plan-btn").on("click", function () {
    const planCard = $(this).closest(".plan-card");
    const planType = planCard.data("plan");

    // Remover seleção anterior
    $(".plan-card").removeClass("selected");

    // Adicionar seleção ao plano atual
    planCard.addClass("selected");

    // Armazenar plano selecionado
    selectedPlan = planType;

    // Atualizar título da configuração
    $("#plan-config-title").text(
      `Configuração do Plano ${planData[planType].name}`
    );

    // Atualizar valor por usuário
    $("#valor-usuario").text(
      `Valor por usuário: R$ ${planData[planType].userPrice}`
    );

    // Mostrar configuração e resumo
    $("#plan-configuration-container").removeClass("hidden");

    // Atualizar resumo
    updatePlanSummary();
  });

  // Atualizar resumo quando os valores mudam
  $("input, select").on("input change", function () {
    if (selectedPlan) {
      updatePlanSummary();
    }
  });
  // Função para calcular recomendação de plano
  function calcularRecomendacaoPlano(valorTotalMensal) {
    const planosHierarquia = ["premium", "standard", "growth", "growth-plus"];

    // 1. Encontrar o primeiro plano onde o valor total cabe
    let planoRecomendado = null;

    for (const plano of planosHierarquia) {
      if (valorTotalMensal <= planData[plano].basePrice) {
        planoRecomendado = plano;
        break;
      }
    }

    // 2. Caso nenhum plano atenda → excedeu todos
    if (!planoRecomendado) {
      return {
        tipo: "recomendado",
        mensagem: `Seu uso ultrapassa o maior plano disponível. Recomendamos um plano customizado.`,
        cor: "azul",
      };
    }

    const precoPlano = planData[planoRecomendado].basePrice;
    const percentual = valorTotalMensal / precoPlano;

    let cor = "";
    let mensagem = "";

    // 3. Caso especial: último plano
    if (planoRecomendado === "growth-plus") {
      if (percentual < 1.0) {
        cor = "verde";
        mensagem = `O plano ${planData[planoRecomendado].name} é adequado para o seu uso.`;
      } else {
        cor = "azul";
        mensagem = `Você ultrapassou o maior plano. Considere um plano customizado.`;
      }
    } else {
      if (percentual < 0.8) {
        cor = "verde";
        mensagem = `O plano ${planData[planoRecomendado].name} é ideal para o seu uso atual.`;
      } else if (percentual < 0.95) {
        cor = "amarelo";
        mensagem = `O plano ${planData[planoRecomendado].name} atende, mas seu uso está próximo do limite.`;
      } else {
        cor = "azul";
        mensagem = `Recomendamos considerar o próximo plano: seu uso está quase no limite.`;
      }
    }

    return {
      tipo:
        cor === "verde"
          ? "ideal"
          : cor === "amarelo"
          ? "atencao"
          : "recomendado",
      mensagem,
      cor,
    };
  }

  // Função para atualizar o resumo do plano
  function updatePlanSummary() {
    if (!selectedPlan) return;

    const plan = planData[selectedPlan];

    // Obter valores dos inputs
    const usuariosAdicionais = parseInt($("#usuarios-adicionais").val()) || 0;
    const pushsAdicionais = parseInt($("#pushs-adicionais").val()) || 0;
    const oabsAdicionais = parseInt($("#oabs-adicionais").val()) || 0;
    const gedAdicional = parseInt($("#ged-adicional").val()) || 0;
    const capturaProcessosAtiva = $("#captura-processos").is(":checked");
    const processosQuantidade = parseInt($("#processos-quantidade").val()) || 0;
    const jurisaiTokens = parseInt($("#jurisai-tokens").val()) || 0;

    // Calcular valores
    const valorUsuariosAdicionais = usuariosAdicionais * plan.userPrice;
    const valorPushsAdicionais = pushsAdicionais * 30;
    const valorOabsAdicionais = oabsAdicionais * 60;
    const valorGedAdicional = gedAdicional * 8;

    // Calcular valor da captura de processos
    let valorCapturaProcessos = 0;
    if (capturaProcessosAtiva && processosQuantidade > 0) {
      valorCapturaProcessos =
        processosQuantidade <= 499
          ? processosQuantidade * 1.5
          : processosQuantidade * 1.0;
    }

    // Calcular valor total mensal
    const valorTotalMensal =
      plan.basePrice +
      valorUsuariosAdicionais +
      valorPushsAdicionais +
      valorOabsAdicionais +
      valorGedAdicional +
      jurisaiTokens +
      valorCapturaProcessos;

    // Pagamento único
    const valorAdicionais = plan.implementation;

    // Atualizar DOM
    $("#valor-plano-base").text(`R$ ${plan.basePrice.toFixed(2)}`);
    $("#valor-usuarios-adicionais").text(
      `R$ ${valorUsuariosAdicionais.toFixed(2)}`
    );
    $("#valor-pushs-adicionais").text(`R$ ${valorPushsAdicionais.toFixed(2)}`);
    $("#valor-oabs-adicionais").text(`R$ ${valorOabsAdicionais.toFixed(2)}`);
    $("#valor-ged-adicional").text(`R$ ${valorGedAdicional.toFixed(2)}`);
    $("#valor-jurisai-tokens").text(`R$ ${jurisaiTokens.toFixed(2)}`);
    $("#valor-captura-processos").text(
      `R$ ${valorCapturaProcessos.toFixed(2)}`
    );
    $("#valor-total-mensal").text(`R$ ${valorTotalMensal.toFixed(2)}`);
    $("#valor-adicionais").text(`R$ ${valorAdicionais.toFixed(2)}`);

    // Calcular e exibir recomendação
    const recomendacao = calcularRecomendacaoPlano(valorTotalMensal);
    const elementoRecomendacao = $("#recomendacao-plano");
    const textoRecomendacao = $("#recomendacao-texto");

    elementoRecomendacao
      .removeClass("hidden")
      .removeClass("recomendacao-verde")
      .removeClass("recomendacao-amarelo")
      .removeClass("recomendacao-azul")
      .addClass(`recomendacao-${recomendacao.cor}`);

    textoRecomendacao.text(recomendacao.mensagem);
  }

  // Habilitar/desabilitar campo de quantidade de processos
  $("#captura-processos").on("change", function () {
    if ($(this).is(":checked")) {
      $("#captura-processos-container").removeClass("hidden");
    } else {
      $("#captura-processos-container").addClass("hidden");
      $("#processos-quantidade").val(0);
    }
    updatePlanSummary();
  });
});
