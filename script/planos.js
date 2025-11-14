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
