// ===============================================
// IMPORTAÇÃO DE FUNÇÕES EXTERNAS
// ===============================================

import { updateUserHeader, loadAndShowProfileModal } from '../components/headerUser.js';
import { showMyListsModal } from '../components/lists-modal.js';


// ===============================================
// FUNÇÕES DE INICIALIZAÇÃO DA PÁGINA
// ===============================================

async function initializePage() {
  await loadHeaderAndFooter();
  initializeHeaderFunctions();
  initializeProductCatalog();
}

/**
 * Carrega o conteúdo HTML do header e do footer na página.
 */
async function loadHeaderAndFooter() {
  try {
    const [headerRes, footerRes] = await Promise.all([
      // Caminho corrigido com base na sua estrutura
      fetch("../components/headerLogado.html"),
      fetch("../components/footer.html")
    ]);

    if (!headerRes.ok || !footerRes.ok) {
      throw new Error('Falha ao carregar header ou footer. Verifique os caminhos.');
    }
    
    const headerHTML = await headerRes.text();
    const footerHTML = await footerRes.text();
    
    document.getElementById("header").innerHTML = headerHTML;
    document.getElementById("footer").innerHTML = footerHTML;

  } catch (error) {
    console.error("Erro ao carregar componentes:", error);
  }
}

/**
 * Inicializa as funções dinâmicas do header (nome do user, modais, etc.).
 */
function initializeHeaderFunctions() {
  if (document.getElementById('userNameDisplay')) {
    updateUserHeader();
  }
  const profileLink = document.getElementById('profile-link');
  if (profileLink) {
    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadAndShowProfileModal();
    });
  }
  const myListsLink = document.getElementById('my-lists-link');
  if (myListsLink) {
    myListsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showMyListsModal();
    });
  }
}


// ===============================================
// LÓGICA DO CATÁLOGO DE PRODUTOS
// ===============================================

function initializeProductCatalog() {
  const API_BASE_URL = 'http://localhost:8080';
  const productGrid = document.getElementById('product-grid');
  const filtersContainer = document.getElementById('filters-container');
  const selectedFiltersContainer = document.getElementById('selected-filters-container');
  const sortByPriceButton = document.getElementById('sort-by-price');

  let productsWithPrices = [];
  let isSortedByPrice = false;

  function getToken() {
    return localStorage.getItem('jwtToken');
  }

  async function fetchData(endpoint, token) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Falha ao buscar dados de ${endpoint}:`, error);
      return null;
    }
  }

  function createProductCard(product) {
    const prices = product.prices || [];
    const formatPrice = (price) => price ? `R$${price.toFixed(2).replace('.', ',')}` : '-';

    const bestPrice = formatPrice(prices[0]);
    const otherPrice1 = formatPrice(prices[1]);
    const otherPrice2 = formatPrice(prices[2]);

    const imageElement = product.urlImg
      ? `<img src="${product.urlImg}" class="card-img-top" alt="${product.nome}">`
      : `<div class="placeholder-box card-img-top"></div>`;

    let savingsBadgeHTML = '';
    if (prices && prices.length >= 2) {
      const lowestPrice = prices[0];
      const highestPrice = Math.max(...prices);
      if (highestPrice > lowestPrice) {
        const savings = ((highestPrice - lowestPrice) / highestPrice) * 100;
        savingsBadgeHTML = `<div class="card-savings-badge">${savings.toFixed(0)}% OFF</div>`;
      }
    }

    return `
      <div class="col">
        <a href="detalhes-produto.html?id=${product.id}" class="text-decoration-none text-dark">
          <div class="card h-100 border-0 rounded-0">
            ${savingsBadgeHTML} ${imageElement}
            <div class="card-body p-3 d-flex flex-column">
              <h6 class="card-title">${product.nome}</h6>
              <div class="mt-auto">
                <small class="text-muted">Melhor preço</small>
                <div class="d-flex gap-2 mt-2">
                  <span class="btn btn-sm btn-success rounded-1">${bestPrice}</span>
                  <span class="btn btn-sm btn-custom-danger rounded-1">${otherPrice1}</span>
                  <span class="btn btn-sm btn-custom-danger rounded-1">${otherPrice2}</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  function generateAndRenderFilters(data) {
    filtersContainer.innerHTML = '';
    const filters = {
      marca: new Set(),
      tamanho: new Set(),
    };

    data.forEach(item => {
      if (item.marca) filters.marca.add(item.marca);
      if (item.valorMedida && item.unidadeMedida) filters.tamanho.add(`${item.valorMedida} ${item.unidadeMedida}`);
    });

    renderFilterGroup('Marca', 'marca', filters.marca);
    renderFilterGroup('Tamanho', 'tamanho', filters.tamanho);
    addFilterListeners();
  }

  function renderFilterGroup(title, name, options) {
    let html = `<div class="mb-3"><p class="fw-bold mb-1">${title}</p>`;
    options.forEach(option => {
      html += `
        <div class="form-check">
          <input class="form-check-input filter-checkbox" type="checkbox" value="${option}" data-filter-name="${name}" id="filter-${name}-${option.replace(/\s/g, '-')}-${Math.random().toString(36).substring(2, 8)}">
          <label class="form-check-label" for="filter-${name}-${option.replace(/\s/g, '-')}-${Math.random().toString(36).substring(2, 8)}">
            ${option}
          </label>
        </div>
      `;
    });
    html += `</div>`;
    filtersContainer.innerHTML += html;
  }

  function addFilterListeners() {
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateFilteredProducts);
    });
  }

  function getActiveFilters() {
    const activeFilters = { marca: [], tamanho: [] };
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    checkboxes.forEach(checkbox => {
      const filterName = checkbox.getAttribute('data-filter-name');
      const filterValue = checkbox.value;
      if (activeFilters[filterName]) {
        activeFilters[filterName].push(filterValue);
      }
    });
    return activeFilters;
  }

  function renderSelectedFilters(filters) {
    selectedFiltersContainer.innerHTML = '';
    const allActive = [...filters.marca, ...filters.tamanho];
    allActive.forEach(filter => {
      selectedFiltersContainer.innerHTML += `<span class="btn btn-sm btn-light border-secondary-subtle">${filter}</span>`;
    });
  }

  function updateFilteredProducts() {
    const activeFilters = getActiveFilters();
    renderSelectedFilters(activeFilters);

    let filteredProducts = productsWithPrices.filter(product => {
      if (activeFilters.marca.length > 0 && !activeFilters.marca.includes(product.marca)) return false;
      if (activeFilters.tamanho.length > 0 && !activeFilters.tamanho.includes(`${product.valorMedida} ${product.unidadeMedida}`)) return false;
      return true;
    });

    if (isSortedByPrice) {
      filteredProducts.sort((a, b) => {
        const priceA = a.prices[0] || Infinity;
        const priceB = b.prices[0] || Infinity;
        return priceA - priceB;
      });
    }
    renderProducts(filteredProducts);
  }

  function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    if (productsToRender.length === 0) {
      productGrid.innerHTML = `<div class="col-12"><div class="alert alert-info text-center">Nenhum produto encontrado para os filtros selecionados.</div></div>`;
      return;
    }
    productsToRender.forEach(product => {
      const cardHTML = createProductCard(product);
      productGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

  sortByPriceButton.addEventListener('click', () => {
    isSortedByPrice = !isSortedByPrice;
    sortByPriceButton.textContent = isSortedByPrice ? 'Remover Ordenação' : 'Ordenar por Menor Preço';
    sortByPriceButton.classList.toggle('btn-primary');
    sortByPriceButton.classList.toggle('btn-outline-primary');
    updateFilteredProducts();
  });

  async function populatePage() {
    const token = getToken();
    if (!token) {
      productGrid.innerHTML = `<div class="col-12"><div class="alert alert-danger">Erro: Token de autenticação não encontrado. Faça o login primeiro.</div></div>`;
      return;
    }

    productGrid.innerHTML = `<div class="col-12 text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></div>`;

    const referencesData = await fetchData('/produtos/referencias/listar?page=0&size=50', token);

    if (!referencesData || !referencesData.content || referencesData.content.length === 0) {
      productGrid.innerHTML = `<div class="col-12"><div class="alert alert-warning">Nenhum produto de referência encontrado.</div></div>`;
      return;
    }

    const products = referencesData.content;

    const scrapingPromises = products.map(async (reference) => {
      const scrapingData = await fetchData(`/produtos/scraping/${reference.id}?page=0&size=10`, token);
      let prices = [];
      if (scrapingData && scrapingData.content.length > 0) {
        prices = scrapingData.content.map(item =>
          (item.precoEspecial && item.precoEspecial > 0 && item.precoEspecial < item.preco) ? item.precoEspecial : item.preco
        ).filter(price => price !== null && !isNaN(price));
        prices.sort((a, b) => a - b);
      }
      return { ...reference, prices: prices };
    });

    productsWithPrices = await Promise.all(scrapingPromises);

    generateAndRenderFilters(productsWithPrices);
    renderProducts(productsWithPrices);
  }
  
  // Inicia o carregamento dos produtos
  populatePage();
}

// ===============================================
// INICIADOR DO EVENTO DOM
// ===============================================

document.addEventListener('DOMContentLoaded', initializePage);