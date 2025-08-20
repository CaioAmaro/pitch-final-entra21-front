// src/scripts/login.js
export function initAuth() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const registerBtn = document.getElementById("registerBtn");
  const acceptTerms = document.getElementById("acceptTerms");

  // ========================
  // LOGIN
  // ========================
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const senha = document.getElementById("loginSenha").value;
      const lembrar = document.getElementById("rememberMe").checked;

      if (lembrar) {
        localStorage.setItem("loginEmail", email);
        localStorage.setItem("loginSenha", senha);
      }

      alert("Login realizado!");
      $("#loginModal").modal("hide");
    });

    // Pré-preencher login
    const savedEmail = localStorage.getItem("loginEmail");
    const savedSenha = localStorage.getItem("loginSenha");
    if (savedEmail) document.getElementById("loginEmail").value = savedEmail;
    if (savedSenha) document.getElementById("loginSenha").value = savedSenha;
  }

  // ========================
  // REGISTRO
  // ========================
  if (registerForm && registerBtn && acceptTerms) {
    // Começa desabilitado
    registerBtn.disabled = true;

    // Ativa/desativa botão conforme checkbox
    acceptTerms.addEventListener("change", function () {
      registerBtn.disabled = !this.checked;
    });

    // Limpar campos ao abrir modal
    $("#registerModal").on("shown.bs.modal", function () {
      registerForm.reset();
      registerBtn.disabled = true;
      [...registerForm.elements].forEach((el) =>
        el.classList.remove("is-invalid")
      );
    });

    // Validação do formulário
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!registerForm.checkValidity()) {
        e.stopPropagation();
        [...registerForm.elements].forEach((el) => {
          if (!el.checkValidity()) el.classList.add("is-invalid");
          else el.classList.remove("is-invalid");
        });
        return;
      }

      if (!acceptTerms.checked) {
        alert("Você precisa aceitar os termos para continuar.");
        return;
      }

      alert("Registro realizado com sucesso!");
      $("#registerModal").modal("hide");
    });

    // Mensagem ao clicar no botão inativo
    registerBtn.addEventListener("click", function () {
      if (this.disabled) {
        alert("Você precisa aceitar os termos para ativar o registro.");
      }
    });

    // Limpar campos ao fechar modal
    $("#registerModal").on("hidden.bs.modal", function () {
      registerForm.reset();
      registerBtn.disabled = true;
      [...registerForm.elements].forEach((el) =>
        el.classList.remove("is-invalid")
      );
    });
  }
}
