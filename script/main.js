// Navegação entre abas
$(".tab-btn").on("click", function () {
  const tabId = $(this).data("tab");

  // Atualizar estado das abas
  $(".tab-btn").removeClass("tab-active");
  $(this).addClass("tab-active");

  // Mostrar conteúdo da aba selecionada
  $(".tab-content").addClass("hidden");
  $(`#${tabId}`).removeClass("hidden");
});

// Validação de campos numéricos
$(document).ready(function () {
  // Função para mostrar erro no campo
  function showFieldValidation(field, message) {
    // Remove estilos e mensagens anteriores
    $(field).removeClass("border-red-500 bg-red-50");
    $(field).next(".field-error-message").remove();

    // Adiciona classe de erro
    $(field).addClass("border-red-500 bg-red-50");

    // Adiciona mensagem de erro
    const errorMessage = $(`
      <div class="field-error-message text-red-500 text-sm mt-1 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        ${message}
      </div>
    `);

    $(field).after(errorMessage);

    // Remove o erro após 3 segundos
    setTimeout(() => {
      $(field).removeClass("border-red-500 bg-red-50");
      errorMessage.fadeOut(300, function () {
        $(this).remove();
      });
    }, 3000);
  }

  // Validação em tempo real para limitar caracteres
  $('input[type="number"]').on("input", function () {
    var maxLength = 10;
    var value = $(this).val();

    // Remove caracteres não numéricos
    value = value.replace(/\D/g, "");

    // Limita o número de caracteres
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showFieldValidation(this, "Máximo de 10 dígitos permitidos");
    }

    $(this).val(value);
  });

  // Validação do campo de usuários adicionais
  $("#usuarios-adicionais").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 500) {
      $(this).val("500");
      showFieldValidation(this, "O número máximo de usuários adicionais é 500");
    }
  });

  // Validação do campo de pushs adicionais
  $("#pushs-adicionais").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 500) {
      $(this).val("500");
      showFieldValidation(this, "O número máximo de pushs adicionais é 500");
    }
  });

  // Validação do campo de OABs adicionais
  $("#oabs-adicionais").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 500) {
      $(this).val("500");
      showFieldValidation(this, "O número máximo de OABs adicionais é 500");
    }
  });

  // Validação do campo de GED adicional
  $("#ged-adicional").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 500) {
      $(this).val("500");
      showFieldValidation(this, "O número máximo de GB adicionais é 500");
    }
  });

  // Validação do campo de quantidade de processos
  $("#processos-quantidade").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 9999) {
      $(this).val("9999");
      showFieldValidation(this, "O número máximo de processos é 9999");
    }
  });

  // Validação do campo de quantidade de processos na migração
  $("#quantidade-processos").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 99999) {
      $(this).val("99999");
      showFieldValidation(
        this,
        "O número máximo de processos para migração é 99999"
      );
    }
  });
});
