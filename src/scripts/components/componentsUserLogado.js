document.addEventListener("DOMContentLoaded", async () => {
  // Carregar header (que contém os modais)
  const headerRes = await fetch("/src/components/headerLogado.html");
  const headerHTML = await headerRes.text();
  document.getElementById("header").innerHTML = headerHTML;

  // Carregar footer
  const footerRes = await fetch("/src/components/footer.html");
  const footerHTML = await footerRes.text();
  document.getElementById("footer").innerHTML = footerHTML;

});