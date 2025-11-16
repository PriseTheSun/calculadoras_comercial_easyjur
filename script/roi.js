// roi.js

// Cálculo de ROI - Eficiência de Tempo
$(document).ready(function () {
  // Elementos da calculadora ROI
  const $quantidadeProcessos = $("#roi-quantidade-processos");
  const $tempoMedio = $("#roi-tempo-medio");
  const $economiaHoras = $("#roi-economia-horas");
  const $economiaDias = $("#roi-economia-dias");
  const $resultadoRoi = $("#resultado-roi-calculadora");

  // Função para mostrar erro no campo
  function showFieldValidation(field, message) {
    $(field).removeClass("border-red-500 bg-red-50");
    $(field).next(".field-error-message").remove();
    $(field).addClass("border-red-500 bg-red-50");

    const errorMessage = $(`
      <div class="field-error-message text-red-500 text-sm mt-1 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        ${message}
      </div>
    `);

    $(field).after(errorMessage);

    setTimeout(() => {
      $(field).removeClass("border-red-500 bg-red-50");
      errorMessage.fadeOut(300, function () {
        $(this).remove();
      });
    }, 3000);
  }

  // Função para calcular ROI
  function calcularROI() {
    const quantidadeProcessos = parseInt($quantidadeProcessos.val()) || 0;
    const tempoMedio = parseInt($tempoMedio.val()) || 0;

    // Se ambos os campos estiverem vazios, esconde o resultado
    if (quantidadeProcessos === 0 && tempoMedio === 0) {
      $resultadoRoi.addClass("hidden");
      return;
    }

    // Validações básicas
    if (quantidadeProcessos < 0 || tempoMedio < 0) {
      showFieldValidation(
        $quantidadeProcessos[0],
        "Informe valores válidos para cálculo"
      );
      $resultadoRoi.addClass("hidden");
      return;
    }

    // Cálculo da economia de tempo em minutos
    const totalMinutos = quantidadeProcessos * tempoMedio;

    // Economia em horas (minutos ÷ 60) - ARREDONDADO
    const economiaHoras = Math.round(totalMinutos / 60);

    // Economia em dias úteis (minutos ÷ 480) - 480 = 8 horas × 60 minutos - ARREDONDADO
    const economiaDias = Math.round(totalMinutos / 480);

    // Atualizar os campos de resultado com valores arredondados
    $economiaHoras.text(economiaHoras + " horas");
    $economiaDias.text(economiaDias + " dias úteis");

    // Mostrar resultado
    $resultadoRoi.removeClass("hidden");
  }

  // Event listeners para cálculo automático
  $quantidadeProcessos.on("input", calcularROI);
  $tempoMedio.on("input", calcularROI);

  // Validação dos campos ROI
  $quantidadeProcessos.on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 99999) {
      $(this).val("99999");
      showFieldValidation(this, "O número máximo de processos é 99999");
    }

    calcularROI(); // Recalcula após validação
  });

  $tempoMedio.on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 480) {
      $(this).val("480");
      showFieldValidation(
        this,
        "O tempo máximo por processo é 480 minutos (8 horas)"
      );
    }

    calcularROI(); // Recalcula após validação
  });

  // Calcular automaticamente se houver valores nos campos
  setTimeout(function () {
    if ($quantidadeProcessos.val() !== "" || $tempoMedio.val() !== "") {
      calcularROI();
    }
  }, 100);
});
