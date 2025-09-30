const API_URL = 'https://fakestoreapi.com/products';
const productsGrid = document.getElementById('productsGrid');
const mobileList = document.getElementById('mobileList');
const sortBy = document.getElementById('sortBy');
const filterBtn = document.getElementById('filterBtn');
document.getElementById('year').textContent = new Date().getFullYear();

async function fetchProducts() {
  const res = await fetch(API_URL);
  return res.ok ? res.json() : [];
}

function clearDOM() {
  productsGrid.innerHTML = '';
  mobileList.innerHTML = '';
}

function createDesktopCard(product) {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-4';
  const isAdded = Math.random() > 0.5;

  col.innerHTML = `
    <div class="product-card position-relative">
      
      <!-- Add to Cart Button (Top Left, above image) -->
      <div class="position-absolute top-0 start-0 m-2">
        <button class="btn btn-sm ${isAdded ? 'btn-success' : 'btn-outline-primary'}">
          ${isAdded ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>

      <!-- Product Image -->
      <div class="product-image-wrapper mt-4">
        <img src="${product.image}" alt="${product.title}">
      </div>

      <!-- Title & Category + Price -->
      <div class="mt-2 d-flex justify-content-between align-items-start">
        <div>
          <h6 class="mb-1">${truncate(product.title, 40)}</h6>
          <small class="text-muted">${product.category}</small>
        </div>
        <span class="price-badge">$${product.price.toFixed(2)}</span>
      </div>

    </div>`;
  return col;
}


function createMobileCard(product) {
  const div = document.createElement('div');
  const isAdded = Math.random() > 0.5;

  div.className = 'mobile-card';
  div.innerHTML = `
    <!-- Add to Cart (top-left above image) -->
    <div class="d-flex justify-content-start mb-2">
      <button class="btn btn-sm ${isAdded ? 'btn-success' : 'btn-outline-primary'}">
        ${isAdded ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>

    <!-- Product Image -->
    <div class="product-image-wrapper text-center">
      <img src="${product.image}" alt="${product.title}">
    </div>

    <!-- Title + Price row -->
    <div class="d-flex justify-content-between align-items-center mt-2">
      <div>
        <small class="text-muted">${truncate(product.title, 40)}</small><br>
        <small class="text-muted">${product.category}</small>
      </div>
      <span class="price-badge">$${product.price.toFixed(2)}</span>
    </div>
  `;
  return div;
}


function truncate(text, max) {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function sortProducts(products, sortType) {
  switch (sortType) {
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price);
    default:
      return products;
  }
}

async function renderAll(filter = 'all') {
  clearDOM();
  const list = await fetchProducts();
  let products = filter === 'all' ? list : list.filter(p => p.category === filter);
  const sortType = sortBy.value;
  products = sortProducts(products, sortType);
  products.forEach(p => {
    productsGrid.appendChild(createDesktopCard(p));
    mobileList.appendChild(createMobileCard(p));
  });
}

// Event listeners
document.querySelectorAll('.nav-pills .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-pills .nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    renderAll(link.dataset.filter);
  });
});

sortBy.addEventListener('change', () => renderAll(document.querySelector('.nav-pills .nav-link.active').dataset.filter));
refreshBtn.addEventListener('click', () => renderAll(document.querySelector('.nav-pills .nav-link.active').dataset.filter));
filterBtn.addEventListener('click', () => alert('Filter functionality can be implemented here')); 

renderAll();
document.getElementById('year').textContent = new Date().getFullYear();