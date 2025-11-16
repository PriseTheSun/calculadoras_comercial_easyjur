$(document).ready(function () {
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

  function formatarValorBR(valor) {
    valor = Number(valor) || 0;
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }

  $(".calculate-plan-btn").on("click", function () {
    const planCard = $(this).closest(".plan-card");
    const planType = planCard.data("plan");

    $(".plan-card").removeClass("selected");

    planCard.addClass("selected");

    selectedPlan = planType;

    $("#plan-config-title").text(
      `Configuração do Plano ${planData[planType].name}`
    );

    $("#valor-usuario").text(
      `Valor por usuário: R$ ${planData[planType].userPrice}`
    );

    $("#valor-adicionais").text(
      formatarValorBR(planData[planType].implementation)
    );

    $("#plan-configuration-container").removeClass("hidden");

    updatePlanSummary();
  });

  $("input, select").on("input change", function () {
    if (selectedPlan) {
      updatePlanSummary();
    }
  });

  function updatePlanSummary() {
    if (!selectedPlan) return;

    const plan = planData[selectedPlan];

    const usuariosAdicionais = parseInt($("#usuarios-adicionais").val()) || 0;
    const pushsAdicionais = parseInt($("#pushs-adicionais").val()) || 0;
    const oabsAdicionais = parseInt($("#oabs-adicionais").val()) || 0;
    const gedAdicional = parseInt($("#ged-adicional").val()) || 0;
    const capturaProcessosAtiva = $("#captura-processos").is(":checked");
    const processosQuantidade = parseInt($("#processos-quantidade").val()) || 0;
    const jurisaiTokens = parseInt($("#jurisai-tokens").val()) || 0;

    const valorUsuariosAdicionais = usuariosAdicionais * plan.userPrice;
    const valorPushsAdicionais = pushsAdicionais * 30;
    const valorOabsAdicionais = oabsAdicionais * 60;
    const valorGedAdicional = gedAdicional * 8;

    let valorCapturaProcessos = 0;
    if (capturaProcessosAtiva && processosQuantidade > 0) {
      valorCapturaProcessos =
        processosQuantidade <= 499
          ? processosQuantidade * 1.5
          : processosQuantidade * 1.0;
    }

    const valorTotalMensal =
      plan.basePrice +
      valorUsuariosAdicionais +
      valorPushsAdicionais +
      valorOabsAdicionais +
      valorGedAdicional +
      jurisaiTokens +
      valorCapturaProcessos;

    $("#valor-plano-base").text(formatarValorBR(plan.basePrice));
    $("#valor-usuarios-adicionais").text(
      formatarValorBR(valorUsuariosAdicionais)
    );
    $("#valor-pushs-adicionais").text(formatarValorBR(valorPushsAdicionais));
    $("#valor-oabs-adicionais").text(formatarValorBR(valorOabsAdicionais));
    $("#valor-ged-adicional").text(formatarValorBR(valorGedAdicional));
    $("#valor-jurisai-tokens").text(formatarValorBR(jurisaiTokens));
    $("#valor-captura-processos").text(formatarValorBR(valorCapturaProcessos));
    $("#valor-total-mensal").text(formatarValorBR(valorTotalMensal));

    updateRecomendacaoPlano(valorTotalMensal);
  }

  function recomendarPlano(valorTotal, percentual = 0.8) {
    const planos = [389, 599, 1699, 2799];

    const ordenados = planos.slice().sort((a, b) => a - b);

    let maisProximo = ordenados[0];
    let menorDiferenca = Math.abs(valorTotal - maisProximo);

    ordenados.forEach((plano) => {
      const diff = Math.abs(valorTotal - plano);
      if (diff < menorDiferenca) {
        menorDiferenca = diff;
        maisProximo = plano;
      }
    });

    const proximidade =
      Math.min(valorTotal, maisProximo) / Math.max(valorTotal, maisProximo);

    if (proximidade >= percentual) return maisProximo;

    const acima = ordenados.find((p) => p >= valorTotal);
    return acima || ordenados[ordenados.length - 1];
  }

  function updateRecomendacaoPlano(valorTotalMensal) {
    const recomendacao = recomendarPlano(valorTotalMensal);
    const planoNames = {
      389: "Premium (R$ 389)",
      599: "Standard (R$ 599)",
      1699: "Growth (R$ 1.699)",
      2799: "Growth Plus (R$ 2.799)",
    };

    const currentPlanPrice = planData[selectedPlan].basePrice;

    if (recomendacao !== currentPlanPrice) {
      $("#recomendacao-plano").removeClass("hidden");
      $("#plano-recomendado").text(planoNames[recomendacao]);

      const custoAtualPlano = valorTotalMensal;
      const custoPlanoRecomendado = recomendacao;
      const diferenca = custoPlanoRecomendado - custoAtualPlano;

      switch (true) {
        case diferenca < 0:
          const economia = Math.abs(diferenca);
          $("#detalhe-recomendacao").text(
            `Economia de ${formatarValorBR(economia)} por mês`
          );
          $("#recomendacao-plano").css(
            "background-color",
            "rgba(97, 206, 112, 0.2)"
          );
          break;

        case diferenca > 0:
          $("#detalhe-recomendacao").text(
            `Custo adicional: R$ ${diferenca
              .toFixed(2)
              .replace(".", ",")}/mês (melhor custo-benefício)`
          );
          $("#recomendacao-plano").css(
            "background-color",
            "rgba(255, 193, 7, 0.2)"
          );
          break;

        default:
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
