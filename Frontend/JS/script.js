// Sample data
let products = [
    { id: 1, title: 'Wooden Chair', price: 59.99, stock: 50, image: '/Frontend/images/00.jpg' },
    { id: 2, title: 'Dining Table', price: 299.99, stock: 20, image: '/Frontend/images/01.avif' },
    { id: 3, title: 'Sofa', price: 499.99, stock: 15, image: '/Frontend/images/02.jpg' },
    { id: 4, title: 'Chair', price: 499.99, stock: 15, image: '/Frontend/images/chair2.jpg' },
    { id: 5, title: 'Classic Oak Dining Set', price: 499.99, stock: 15, image: '/Frontend/images/table.jpg' },
    { id: 6, title: 'Cabinet', price: 499.99, stock: 15, image: '/Frontend/images/door.jpg' },
    { id: 7, title: 'Table', price: 499.99, stock: 15, image: '/Frontend/images/table 1.jpg' },
    { id: 8, title: 'Chair', price: 499.99, stock: 15, image: '/Frontend/images/upoan.jpg' },
    { id: 9, title: 'Chair2', price: 499.99, stock: 15, image: '/Frontend/images/00.jpg' },
];

let currentOrder = [];
let sales = [
    { id: 1, productTitle: 'Door 1', quantity: 10 },
    { id: 2, productTitle: 'Door 2', quantity: 10 },
    { id: 3, productTitle: 'Door 3', quantity: 10 },
    { id: 4, productTitle: 'Door 4', quantity: 10 },
    { id: 5, productTitle: 'Door 5', quantity: 10 }
];

// Render POS Products
function renderPOSProducts() {
    const posProductList = document.getElementById('posProductList');
    posProductList.innerHTML = '';
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">Price: $${product.price.toFixed(2)}</p>
                    <p class="card-text">In Stock: ${product.stock}</p>
                    <button class="btn btn-primary add-to-order" data-id="${product.id}">Add to Order</button>
                </div>
            </div>
        `;
        posProductList.appendChild(col);
    });
}

// Update Current Order
function updateCurrentOrder() {
    const currentOrderElement = document.getElementById('currentOrder');
    const orderTotalElement = document.getElementById('orderTotal');
    currentOrderElement.innerHTML = '';
    let total = 0;

    currentOrder.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${item.title} x${item.quantity}
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        currentOrderElement.appendChild(li);
        total += item.price * item.quantity;
    });

    orderTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Add event listeners for adding products to the order
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-order')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        if (product && product.stock > 0) {
            const orderItem = currentOrder.find(item => item.id === productId);
            if (orderItem) {
                orderItem.quantity++;
            } else {
                currentOrder.push({ ...product, quantity: 1 });
            }
            product.stock--;
            updateCurrentOrder();
            renderPOSProducts();
        }
    }
});

// Checkout event listener
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (currentOrder.length > 0) {
        alert('Order placed successfully!');
        currentOrder.forEach(item => {
            const sale = {
                id: sales.length + 1,
                productTitle: item.title,
                quantity: item.quantity
            };
            sales.push(sale);
        });
        currentOrder = [];
        updateCurrentOrder();
        renderSales();
        updateDashboard();
    } else {
        alert('Please add items to your order before checking out.');
    }
});

// Render Products
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">Stock: ${product.stock}</p>
                    <button class="btn btn-sm btn-primary edit-product" data-id="${product.id}">Edit</button>
                </div>
            </div>
        `;
        productList.appendChild(col);
    });
}

// Render Sales (removed Edit button)
function renderSales() {
    const salesList = document.getElementById('salesList');
    salesList.innerHTML = '';
    let total = 0;
    
    // Check if the Sales section is active
    const isSalesSectionActive = document.getElementById('sales').classList.contains('active-section');
    
    sales.forEach(sale => {
        const row = document.createElement('tr');
        
        // No "Edit" button now; just display sale info
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.productTitle}</td>
            <td>${sale.quantity}</td>
            <td></td> <!-- No edit button here -->
        `;
        salesList.appendChild(row);
        total += sale.quantity;
    });
    
    document.getElementById('totalSold').textContent = total;
}

// Update Dashboard
function updateDashboard() {
    document.getElementById('adminCount').textContent = '1';
    document.getElementById('productCount').textContent = products.length;
    document.getElementById('salesCount').textContent = sales.length;

    const highestSale = sales.reduce((prev, current) => 
        (prev.quantity > current.quantity) ? prev : current
    );
    document.getElementById('highestSaleProduct').textContent = highestSale.productTitle;

    const latestSale = sales[sales.length - 1];
    document.getElementById('latestSale').textContent = latestSale.productTitle;
}

// Handle adding/editing products
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const title = document.getElementById('productTitle').value;
    const stock = document.getElementById('productStocks').value;
    const image = document.getElementById('productImage').value || '/placeholder.svg?height=200&width=200';
    products.push({ id: parseInt(id), title, stock: parseInt(stock), image });
    renderProducts();
    addProductForm.reset();
    updateDashboard();
});

// Event delegation for edit buttons (no action needed for sales)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-product')) {
        const id = e.target.getAttribute('data-id');
        console.log('Edit product', id);  // Placeholder for editing product
    }
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    console.log('Logout clicked');
});

// Sidebar toggle for mobile
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.querySelector('[data-bs-toggle="collapse"]');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && !sidebar.contains(e.target) && !e.target.matches('[data-bs-toggle="collapse"]')) {
        sidebar.classList.remove('show');
    }
});

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main > section');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const targetId = link.getAttribute('data-tab');
        sections.forEach(section => {
            section.classList.add('d-none');
            if (section.id === targetId) {
                section.classList.remove('d-none');
                if (section.id === 'sales') {
                    renderSales();
                }
            }
        });
        updateDashboard();

        // Close sidebar on mobile after clicking a link
        if (window.innerWidth < 768) {
            sidebar.classList.remove('show');
        }
    });
});

// Initial renders
renderPOSProducts();
renderProducts();
renderSales();
updateDashboard();
