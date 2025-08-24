// VARIÁVEIS GLOBAIS E ESTADO DO MODAL
const API_BASE_URL = 'http://localhost:8080';
let listsModal, createListModal, confirmModal, notificationModal;
let modalContentContainer, listsModalLabel, backToListsBtn, compareBtn;
let currentListViewState = 'lists';
let currentListId = null;
let currentListName = '';
let confirmAction = null;

/**
 * Função principal que é exportada. Inicializa e mostra o modal de listas.
 */
export function showMyListsModal() {
  // Inicializa as variáveis do DOM na primeira vez que o modal é aberto
  if (!listsModal) {
    initializeDOMElements();
    initializeEventListeners();
  }
  
  // Renderiza a visão inicial das listas
  renderListsView();
  listsModal.show();
}

/**
 * Pega as referências dos elementos HTML para serem usadas no script.
 */
function initializeDOMElements() {
  listsModal = new bootstrap.Modal(document.getElementById('listsModal'));
  createListModal = new bootstrap.Modal(document.getElementById('createListModal'));
  confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
  notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));

  modalContentContainer = document.getElementById('modal-content-container');
  listsModalLabel = document.getElementById('listsModalLabel');
  backToListsBtn = document.getElementById('back-to-lists-btn');
  compareBtn = document.getElementById('compare-btn');
}

/**
 * Configura os ouvintes de eventos para os botões do modal.
 */
function initializeEventListeners() {
  backToListsBtn.addEventListener('click', () => renderListsView());
  compareBtn.addEventListener('click', () => {
    if (currentListViewState === 'products' && currentListId) {
      window.location.href = `comparacao.html?listId=${currentListId}`;
    }
  });

  document.getElementById('save-new-list-btn').addEventListener('click', async () => {
    const listName = document.getElementById('new-list-name-input').value;
    if (listName) {
      const result = await fetchData('/listas', 'POST', { nome: listName });
      if (result) {
        showNotification('Nova lista criada com sucesso!');
        createListModal.hide();
        renderListsView();
      } else {
        showNotification('Erro ao criar a lista.', 'danger');
      }
    }
  });
  
  document.getElementById('confirm-action-btn').addEventListener('click', () => {
    if (confirmAction) confirmAction();
    confirmModal.hide();
  });
}

// FUNÇÕES DE LÓGICA E RENDERIZAÇÃO (Adaptadas do seu script)

async function fetchData(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) throw new Error(await response.text());
    const contentType = response.headers.get('content-type');
    return (contentType && contentType.includes('application/json')) ? await response.json() : response;
  } catch (error) {
    console.error(`Falha ao buscar dados de ${endpoint}:`, error);
    return null;
  }
}

async function renderListsView() {
  currentListViewState = 'lists';
  listsModalLabel.textContent = 'Minhas Listas';
  backToListsBtn.classList.add('d-none');
  compareBtn.classList.add('d-none');
  modalContentContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div></div>`;

  const lists = await fetchData('/listas');
  let listsHtml = `
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      <div class="col" id="create-new-list-card" style="cursor: pointer;">
        <div class="card h-100 list-card-placeholder p-4 text-center">
          <h5><i class="bi bi-plus-circle"></i> Criar nova lista</h5>
        </div>
      </div>`;

  if (lists && lists.length > 0) {
    lists.forEach(list => {
      listsHtml += `
        <div class="col">
          <div class="card h-100 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">${list.nome}</h5>
              <button class="btn btn-sm btn-outline-danger delete-list-btn" data-list-id="${list.id}" data-list-name="${list.nome}"><i class="bi bi-trash"></i></button>
            </div>
            <p class="card-text text-muted"><small>Criada em ${new Date(list.dataCriacao).toLocaleDateString('pt-BR')}</small></p>
            <button class="btn btn-sm btn-outline-secondary view-list-btn mt-auto" data-list-id="${list.id}" data-list-name="${list.nome}">Ver produtos</button>
          </div>
        </div>`;
    });
  }
  listsHtml += `</div>`;
  modalContentContainer.innerHTML = listsHtml;
  addListHandlers();
}

async function renderProductsInListView(listId, listName) {
  currentListViewState = 'products';
  currentListId = listId;
  currentListName = listName;
  listsModalLabel.textContent = listName;
  backToListsBtn.classList.remove('d-none');
  compareBtn.classList.remove('d-none');
  modalContentContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div></div>`;

  const listProducts = await fetchData(`/listas/${listId}`);
  if (!listProducts || listProducts.length === 0) {
    modalContentContainer.innerHTML = `<div class="p-5 text-center">Esta lista está vazia.</div>`;
    return;
  }

  const productRefs = await Promise.all(listProducts.map(item => fetchData(`/produtos/referencias/${item.produtoId}`)));
  let productsHtml = `<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">`;
  productRefs.forEach((product, index) => {
    if (!product) return; // Pula se um produto não for encontrado
    const listProduct = listProducts[index];
    productsHtml += `
      <div class="col">
        <div class="card h-100 list-item-card position-relative">
          <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 delete-product-btn" data-product-id="${product.id}"><i class="bi bi-trash"></i></button>
          <img src="${product.urlImg || 'https://placehold.co/150x150'}" class="card-img-top p-2" alt="${product.nome}" style="height: 150px; object-fit: contain;">
          <div class="card-body">
            <h6 class="card-title">${product.nome}</h6>
          </div>
        </div>
      </div>`;
  });
  productsHtml += `</div>`;
  modalContentContainer.innerHTML = productsHtml;
  addProductsInListHandlers();
}

function addListHandlers() {
  document.getElementById('create-new-list-card').addEventListener('click', () => {
    document.getElementById('new-list-name-input').value = '';
    createListModal.show();
  });

  document.querySelectorAll('.view-list-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const listId = e.currentTarget.dataset.listId;
      const listName = e.currentTarget.dataset.listName;
      renderProductsInListView(listId, listName);
    });
  });

  document.querySelectorAll('.delete-list-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const listId = e.currentTarget.dataset.listId;
      const listName = e.currentTarget.dataset.listName;
      document.getElementById('confirm-message').textContent = `Tem certeza que deseja apagar a lista "${listName}"?`;
      confirmAction = async () => {
        const result = await fetchData(`/listas/${listId}`, 'DELETE');
        if (result) {
          showNotification('Lista apagada com sucesso!');
          renderListsView();
        } else {
          showNotification('Erro ao apagar a lista.', 'danger');
        }
      };
      confirmModal.show();
    });
  });
}

function addProductsInListHandlers() {
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            document.getElementById('confirm-message').textContent = `Tem certeza que deseja remover este produto da lista "${currentListName}"?`;
            confirmAction = async () => {
                const result = await fetchData(`/listas/${currentListId}/produtos/${productId}`, 'DELETE');
                if (result) {
                    showNotification('Produto removido com sucesso!');
                    renderProductsInListView(currentListId, currentListName);
                } else {
                    showNotification('Erro ao remover o produto.', 'danger');
                }
            };
            confirmModal.show();
        });
    });
}

function showNotification(message, type = 'success') {
    const modalTitle = document.getElementById('notificationModalLabel');
    const modalMessage = document.getElementById('notification-message');
    const modalHeader = document.querySelector('#notificationModal .modal-header');

    modalMessage.textContent = message;
    modalHeader.className = 'modal-header text-white'; // Limpa classes antigas

    if (type === 'danger') {
        modalTitle.textContent = 'Erro';
        modalHeader.classList.add('bg-danger');
    } else {
        modalTitle.textContent = 'Sucesso';
        modalHeader.classList.add('bg-success');
    }
    notificationModal.show();
}