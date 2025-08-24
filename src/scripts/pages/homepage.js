import '../components/headerLinkActive.js';
import { initAuth } from './loginAndRegister.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Carregar header (que contém os modais)
  const headerRes = await fetch("./components/header.html");
  const headerHTML = await headerRes.text();
  document.getElementById("header").innerHTML = headerHTML;

  // Carregar footer
  const footerRes = await fetch("./components/footer.html");
  const footerHTML = await footerRes.text();
  document.getElementById("footer").innerHTML = footerHTML;

  // Inicializa login/registro
  initAuth();
});