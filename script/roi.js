// roi.js - Cálculo de ROI (Eficiência de Tempo) - Versão Corrigida e Final
$(document).ready(function () {
  const $quantidade = $("#roi-quantidade-processos");
  const $tempoMedio = $("#roi-tempo-medio");
  const $resultado = $("#resultado-roi-calculadora");
  const $horas = $("#roi-economia-horas");
  const $dias = $("#roi-economia-dias");

  function showFieldValidation(input, message) {
    const $input = $(input);
    const fieldId = $input.attr("id") || "field-" + Date.now();

    $(`#${fieldId}-error`).remove();
    $input.removeClass("border-red-500").addClass("border-red-500");

    const $error = $(`
      <div id="${fieldId}-error" class="mt-1 text-sm text-red-600 font-medium animate-pulse">
        ${message}
      </div>
    `);

    $input.after($error);

    setTimeout(() => {
      $error.fadeOut(300, function () {
        $(this).remove();
        $input.removeClass("border-red-500");
      });
    }, 4000);
  }

  // === SEMPRE garante número inteiro sem casas decimais ===
  function formatarNumero(valor) {
    return Number.parseInt(valor, 10).toLocaleString("pt-BR");
  }

  function calcularROI() {
    const quantidade = parseInt($quantidade.val().replace(/\D/g, ""), 10) || 0;
    const tempoPorProcesso =
      parseInt($tempoMedio.val().replace(/\D/g, ""), 10) || 0;

    if (quantidade <= 0 || tempoPorProcesso <= 0) {
      $resultado.addClass("hidden");
      return;
    }

    const totalMinutos = quantidade * tempoPorProcesso;

    // Sempre inteiros
    const totalHoras = Math.round(totalMinutos / 60);
    const totalDias = Math.round(totalHoras / 8);

    const labelHoras = totalHoras === 1 ? "hora" : "horas";
    const labelDias = totalDias === 1 ? "dia útil" : "dias úteis";

    $horas.text(`${formatarNumero(totalHoras)} ${labelHoras}`);
    $dias.text(`${formatarNumero(totalDias)} ${labelDias}`);

    $resultado.removeClass("hidden");

    if ($("#resumo").is(":visible")) {
      setTimeout(atualizarResumoGeral, 100);
    }
  }

  // === MÁSCARAS ===
  $quantidade.mask("000000");
  $tempoMedio.mask("00");

  $quantidade.on("input blur", function () {
    const val = parseInt($(this).val()) || 0;
    if (val > 99999) {
      $(this).val("99999");
      showFieldValidation(this, "Máximo de 99.999 processos");
    }
    calcularROI();
  });

  $tempoMedio.on("input blur", function () {
    const val = parseInt($(this).val()) || 0;
    if (val > 480) {
      $(this).val("480");
      showFieldValidation(this, "Máximo de 480 minutos (8h)");
    }
    calcularROI();
  });

  if ($quantidade.val() && $tempoMedio.val()) {
    calcularROI();
  }

  $(".tab-btn").on("click", function () {
    const tab = $(this).data("tab");
    if (tab === "resumo") {
      setTimeout(() => {
        if (!$resultado.hasClass("hidden")) {
          atualizarResumoGeral();
        }
      }, 100);
    }
  });
});
