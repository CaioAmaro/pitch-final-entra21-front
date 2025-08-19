const toggleButton = document.getElementById('toggleDetails');
const detailsTable = document.getElementById('detailsTable');

toggleButton.addEventListener('click', () => {
  if (detailsTable.style.display === 'none' || detailsTable.style.display === '') {
    detailsTable.style.display = 'block';
    toggleButton.textContent = 'Ocultar lista';
  } else {
    detailsTable.style.display = 'none';
    toggleButton.textContent = 'Detalhar lista';
  }
});