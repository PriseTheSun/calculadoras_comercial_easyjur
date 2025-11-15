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
    $("#valor-plano-base").text(
      `R$ ${plan.basePrice.toFixed(2).replace(".", ",")}`
    );
    $("#valor-usuarios-adicionais").text(
      `R$ ${valorUsuariosAdicionais.toFixed(2).replace(".", ",")}`
    );
    $("#valor-pushs-adicionais").text(
      `R$ ${valorPushsAdicionais.toFixed(2).replace(".", ",")}`
    );
    $("#valor-oabs-adicionais").text(
      `R$ ${valorOabsAdicionais.toFixed(2).replace(".", ",")}`
    );
    $("#valor-ged-adicional").text(
      `R$ ${valorGedAdicional.toFixed(2).replace(".", ",")}`
    );
    $("#valor-jurisai-tokens").text(
      `R$ ${jurisaiTokens.toFixed(2).replace(".", ",")}`
    );
    $("#valor-captura-processos").text(
      `R$ ${valorCapturaProcessos.toFixed(2).replace(".", ",")}`
    );
    $("#valor-total-mensal").text(
      `R$ ${valorTotalMensal.toFixed(2).replace(".", ",")}`
    );
    $("#valor-adicionais").text(
      `R$ ${valorAdicionais.toFixed(2).replace(".", ",")}`
    );

    // Calcular e exibir recomendação de plano
    updateRecomendacaoPlano(valorTotalMensal);
  }

  // Função para recomendar plano (baseada na lógica fornecida)
  function recomendarPlano(valorTotal, percentual = 0.8) {
    const planos = [389, 599, 1699, 2799];

    // Ordena para garantir a ordem correta
    const ordenados = planos.slice().sort((a, b) => a - b);

    // 1. Encontra o plano mais próximo
    let maisProximo = ordenados[0];
    let menorDiferenca = Math.abs(valorTotal - maisProximo);

    ordenados.forEach((plano) => {
      const diff = Math.abs(valorTotal - plano);
      if (diff < menorDiferenca) {
        menorDiferenca = diff;
        maisProximo = plano;
      }
    });

    // Calcula proximidade (entre 0 e 1)
    const proximidade =
      Math.min(valorTotal, maisProximo) / Math.max(valorTotal, maisProximo);

    // 2. Se for ≥ 80%, retorna esse plano
    if (proximidade >= percentual) {
      return maisProximo;
    }

    // 3. Regra clássica: pega o plano acima do valor
    const acima = ordenados.find((p) => p >= valorTotal);

    return acima || ordenados[ordenados.length - 1];
  }

  // Função para atualizar a recomendação de plano na interface - CORRIGIDA
  function updateRecomendacaoPlano(valorTotalMensal) {
    const recomendacao = recomendarPlano(valorTotalMensal);
    const planoNames = {
      389: "Premium (R$ 389)",
      599: "Standard (R$ 599)",
      1699: "Growth (R$ 1.699)",
      2799: "Growth Plus (R$ 2.799)",
    };

    const currentPlanPrice = planData[selectedPlan].basePrice;

    // Mostrar recomendação apenas se for diferente do plano atual
    if (recomendacao !== currentPlanPrice) {
      $("#recomendacao-plano").removeClass("hidden");
      $("#plano-recomendado").text(planoNames[recomendacao]);

      // CÁLCULO CORRIGIDO: Comparar custo do plano recomendado vs custo atual
      const custoAtualPlano = valorTotalMensal;
      const custoPlanoRecomendado = recomendacao;
      const diferenca = custoPlanoRecomendado - custoAtualPlano;

      if (diferenca < 0) {
        // Recomendação é MAIS BARATA que o custo atual - ECONOMIA REAL
        const economia = Math.abs(diferenca);
        $("#detalhe-recomendacao").text(
          `Economia de R$ ${economia.toFixed(2).replace(".", ",")} por mês`
        );
        $("#recomendacao-plano").css(
          "background-color",
          "rgba(97, 206, 112, 0.2)"
        ); // Verde claro
      } else if (diferenca > 0) {
        // Recomendação é MAIS CARA que o custo atual - CUSTO ADICIONAL
        $("#detalhe-recomendacao").text(
          `Custo adicional: R$ ${diferenca
            .toFixed(2)
            .replace(".", ",")}/mês (melhor custo-benefício)`
        );
        $("#recomendacao-plano").css(
          "background-color",
          "rgba(255, 193, 7, 0.2)"
        ); // Amarelo claro
      } else {
        // Mesmo preço (raro)
        $("#detalhe-recomendacao").text(
          `Mesmo custo mensal - melhor adequação`
        );
        $("#recomendacao-plano").css(
          "background-color",
          "rgba(97, 206, 112, 0.2)"
        );
      }
    } else {
      $("#recomendacao-plano").addClass("hidden");
    }
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
