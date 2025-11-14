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
