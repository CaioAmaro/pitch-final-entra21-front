import './homepage.js';
import './loadHeader.js';
import './loadFooter.js';
import { initAuth } from './login.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Carregar header (que contém os modais)
  const headerRes = await fetch("/src/components/header.html");
  const headerHTML = await headerRes.text();
  document.getElementById("header").innerHTML = headerHTML;

  // Inicializa login/registro
  initAuth();
});