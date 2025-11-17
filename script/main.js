$(".tab-btn").on("click", function () {
  const tabId = $(this).data("tab");

  $(".tab-btn").removeClass("tab-active");
  $(this).addClass("tab-active");

  $(".tab-content").addClass("hidden");
  $(`#${tabId}`).removeClass("hidden");
});

$(document).ready(function () {
  $(".numeric").mask("000");
  $(".currency").mask("000,00", { reverse: true });

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

  $('input[type="text"].numeric').on("input", function () {
    var maxLength = 10;
    var value = $(this).val();

    value = value.replace(/\D/g, "");

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showFieldValidation(this, "Máximo de 10 dígitos permitidos");
    }

    $(this).val(value);
  });

  $("#usuarios-adicionais").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 500) {
      $(this).val("500");
      showFieldValidation(this, "O número máximo de usuários adicionais é 500");
    }
  });

  $("#pushs-adicionais").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 500) {
      $(this).val("500");
      showFieldValidation(this, "O número máximo de pushs adicionais é 500");
    }
  });

  $("#oabs-adicionais").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 500) {
      $(this).val("500");
      showFieldValidation(this, "O número máximo de OABs adicionais é 500");
    }
  });

  $("#ged-adicional").on("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  $("#ged-adicional").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 1000) {
      $(this).val("1000");
      showFieldValidation(
        this,
        "O número máximo de GB adicionais é 1000 equivalente a 1 TB"
      );
    }
  });

  $("#processos-quantidade").on("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  $("#processos-quantidade").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 50000) {
      $(this).val("50000");
      showFieldValidation(this, "O número máximo de processos é 50.000");
    }
  });

  $("#quantidade-processos").on("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  $("#quantidade-processos").on("blur", function () {
    var value = $(this).val();
    var numericValue = parseInt(value) || 0;

    if (numericValue > 50000) {
      $(this).val("50000");
      showFieldValidation(
        this,
        "O número máximo de processos para migração é 50.000"
      );
    }
  });
});
