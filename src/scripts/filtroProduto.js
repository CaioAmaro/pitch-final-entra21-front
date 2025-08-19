  // Carrossel
  const carouselImgs = document.querySelectorAll('.carousel-img');
  const indicators = document.querySelectorAll('.carousel-indicator');
  let carouselIndex = 1;
  let carouselTimer = null;
  let lastIndex = 1;

  function showCarousel(idx) {
    // Reorganiza as imagens para que a selecionada fique sempre no meio.
    let order = [0, 1, 2];
    if (idx === 0) order = [1, 0, 2];
    if (idx === 2) order = [0, 2, 1];

    // Remove todas as imagens do contêiner
    const container = document.getElementById('carousel');
    const imgs = Array.from(carouselImgs);
    imgs.forEach(img => container.removeChild(img));

    // Re-add images em uma nova ordem
    order.forEach(i => {
      container.appendChild(carouselImgs[i]);
    });

    // Remove previous animation classes
    carouselImgs.forEach(img => {
      img.classList.remove('slide-in-left', 'slide-in-right');
    });

    // Detect direction for animation
    let direction = idx > lastIndex ? 'right' : 'left';
    if (idx === 0 && lastIndex === 2) direction = 'right';
    if (idx === 2 && lastIndex === 0) direction = 'left';

    // Add animation to the new active image
    if (idx !== lastIndex) {
      carouselImgs[idx].classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');
    }

    // Set active class
    carouselImgs.forEach((img, i) => {
      img.classList.toggle('active', i === idx);
    });
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === idx);
    });
    lastIndex = carouselIndex;
    carouselIndex = idx;
  }

  function nextCarousel() {
    let idx = (carouselIndex + 1) % carouselImgs.length;
    showCarousel(idx);
  }

  indicators.forEach(btn => {
    btn.addEventListener('click', () => {
      showCarousel(Number(btn.dataset.index));
      resetCarouselTimer();
    });
  });

  carouselImgs.forEach(img => {
    img.addEventListener('click', () => {
      showCarousel(Number(img.dataset.index));
      resetCarouselTimer();
    });
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        showCarousel(Number(img.dataset.index));
        resetCarouselTimer();
      }
    });
  });
  
  // tempo carousel
  function resetCarouselTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(nextCarousel, 4000);
  }
  resetCarouselTimer();

  // Produtos mock
  const produtos = [];
  for (let i = 1; i <= 16; i++) {
    produtos.push({
      nome: 'Produto genérico',
      preco: 15,
      promocao: 13 + (i % 3),
      tipo: i % 2 === 0 ? 'Genérico' : 'Marca',
      tamanho: i % 3 === 0 ? 'Pequeno' : (i % 3 === 1 ? 'Médio' : 'Grande'),
      mercado: ['Cooper', 'Giassi', 'Angeloni'][i % 3]
    });
  }

  // Filtros ativos
  const filtrosAtivos = {};

  function renderFiltrosAtivos() {
    const container = document.getElementById('filtros-ativos');
    container.innerHTML = '';
    Object.entries(filtrosAtivos).forEach(([chave, valor]) => {
      if (!valor) return;
      if (Array.isArray(valor) && valor.length === 0) return;
      if (Array.isArray(valor)) {
        valor.forEach(v => {
          const el = document.createElement('span');
          el.className = 'filtro-ativo';
          el.innerHTML = `${chave}: ${v} <button title="Remover" onclick="removerFiltro('${chave}','${v}')">&times;</button>`;
          container.appendChild(el);
        });
      } else {
        const el = document.createElement('span');
        el.className = 'filtro-ativo';
        el.innerHTML = `${chave}: ${valor} <button title="Remover" onclick="removerFiltro('${chave}')">&times;</button>`;
        container.appendChild(el);
      }
    });
  }
  window.removerFiltro = function(chave, valor) {
    if (valor) {
      filtrosAtivos[chave] = filtrosAtivos[chave].filter(v => v !== valor);
    } else {
      filtrosAtivos[chave] = chave === 'Tamanho' ? [] : '';
    }
    aplicarFiltros();
  };

  // Filtros
  document.getElementById('tipo-produto').addEventListener('change', function() {
    filtrosAtivos['Tipo'] = this.value;
    aplicarFiltros();
  });
  document.getElementById('mercado').addEventListener('change', function() {
    filtrosAtivos['Mercado'] = this.value;
    aplicarFiltros();
  });
  document.querySelectorAll('input[name="tamanho"]').forEach(cb => {
    cb.addEventListener('change', function() {
      const selecionados = Array.from(document.querySelectorAll('input[name="tamanho"]:checked')).map(x => x.value);
      filtrosAtivos['Tamanho'] = selecionados;
      aplicarFiltros();
    });
  });

  function aplicarFiltros() {
    renderFiltrosAtivos();
    let filtrados = produtos.slice();
    if (filtrosAtivos['Tipo']) {
      filtrados = filtrados.filter(p => p.tipo === filtrosAtivos['Tipo']);
    }
    if (filtrosAtivos['Mercado']) {
      filtrados = filtrados.filter(p => p.mercado === filtrosAtivos['Mercado']);
    }
    if (filtrosAtivos['Tamanho'] && filtrosAtivos['Tamanho'].length > 0) {
      filtrados = filtrados.filter(p => filtrosAtivos['Tamanho'].includes(p.tamanho));
    }
    renderProdutos(filtrados);
  }

  function renderProdutos(lista) {
    const grid = document.getElementById('produtos-grid');
    grid.innerHTML = '';
    if (lista.length === 0) {
      grid.innerHTML = '<div style="grid-column: span 4; text-align: center; color: #888;">Nenhum produto encontrado.</div>';
      return;
    }
    lista.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'produto-card';
      card.innerHTML = `
        <div class="produto-img"></div>
        <div class="produto-nome">${prod.nome}</div>
        <div style="font-size: 0.9em; color: #444; margin-bottom: 4px;">${prod.mercado} - ${prod.tamanho}</div>
        <div class="produto-precos">
          <span class="preco">R$${prod.preco}</span>
          <span class="preco promocao">R$${prod.promocao}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Inicialização
  filtrosAtivos['Tipo'] = '';
  filtrosAtivos['Tamanho'] = [];
  filtrosAtivos['Mercado'] = '';
  aplicarFiltros();