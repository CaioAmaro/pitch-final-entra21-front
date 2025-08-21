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
    const loginError = document.createElement("div");
    loginError.style.color = "red";
    loginError.style.marginTop = "5px";
    loginForm.appendChild(loginError);

    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      loginError.textContent = "";

      const email = document.getElementById("loginEmail").value.trim();
      const senha = document.getElementById("loginSenha").value.trim();
      const lembrar = document.getElementById("rememberMe").checked;

      // Validação de campos obrigatórios
      if (!email || !senha) {
        loginError.textContent = "Por favor, preencha todos os campos.";
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
          loginError.textContent = data.message || "Erro ao fazer login.";
          return;
        }

        if (data.token) {
          localStorage.setItem("jwtToken", data.token);

          if (lembrar) {
            localStorage.setItem("loginEmail", email);
            localStorage.setItem("loginSenha", senha);
          }

          alert("Login realizado com sucesso!");
          $("#loginModal").modal("hide");

          // Redirecionamento opcional
          window.location.href = "pages/filtroProduto.html";
        } else {
          loginError.textContent = "Token não recebido!";
        }
      } catch (err) {
        console.error("Erro ao fazer login:", err);
        loginError.textContent = "Erro ao se conectar ao servidor.";
      }
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
    const registerError = document.createElement("div");
    registerError.style.color = "red";
    registerError.style.marginTop = "5px";
    registerForm.appendChild(registerError);

    registerBtn.disabled = true;

    acceptTerms.addEventListener("change", function () {
      registerBtn.disabled = !this.checked;
    });

    $("#registerModal").on("shown.bs.modal", function () {
      registerForm.reset();
      registerBtn.disabled = true;
      registerError.textContent = "";
      [...registerForm.elements].forEach((el) => el.classList.remove("is-invalid"));
    });

    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      registerError.textContent = "";

      if (!registerForm.checkValidity()) {
        e.stopPropagation();
        [...registerForm.elements].forEach((el) => {
          if (!el.checkValidity()) el.classList.add("is-invalid");
          else el.classList.remove("is-invalid");
        });
        return;
      }

      if (!acceptTerms.checked) {
        registerError.textContent = "Você precisa aceitar os termos para continuar.";
        return;
      }

      const nome = document.getElementById("registerNome").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const senha = document.getElementById("registerSenha").value.trim();

      if (!nome || !email || !senha) {
        registerError.textContent = "Preencha todos os campos para registrar.";
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/cadastro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
          registerError.textContent = data.message || "Erro ao registrar.";
          return;
        }

        alert("Registro realizado com sucesso!");
        $("#registerModal").modal("hide");
      } catch (err) {
        console.error("Erro ao registrar:", err);
        registerError.textContent = "Erro ao se conectar ao servidor.";
      }
    });

    registerBtn.addEventListener("click", function () {
      if (this.disabled) registerError.textContent = "Você precisa aceitar os termos para ativar o registro.";
    });

    $("#registerModal").on("hidden.bs.modal", function () {
      registerForm.reset();
      registerBtn.disabled = true;
      registerError.textContent = "";
      [...registerForm.elements].forEach((el) => el.classList.remove("is-invalid"));
    });
  }
}
