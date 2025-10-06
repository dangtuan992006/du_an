// Đường dẫn tới file JSON
const JSON_PATH = '../data/products.json';

// Hàm hiển thị sản phẩm
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    
    if (!products || products.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <p>Chưa có sản phẩm nào</p>
            </div>
        `;
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            <div class="product-name">${product.name}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p><i> ${product.category} </i></p>
                <p><i class="fa-solid fa-align-left"></i> ${product.description}</p>
                <p class="price"><i class="fa-solid fa-money-bill-wave"></i> ${product.price} đồng/kg</p>
            </div>
            <button class="delete-btn" data-id="${product.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Gắn sự kiện cho nút xóa
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products = products.filter(p => p.id != id);
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts(products);
        });
    });
}

// Hàm load sản phẩm
async function loadProducts() {
    let products = JSON.parse(localStorage.getItem('products'));

    if (!products || products.length === 0) {
        // Nếu localStorage trống thì load từ JSON
        try {
            const response = await fetch(JSON_PATH);
            if (!response.ok) throw new Error(`Không thể tải JSON (HTTP ${response.status})`);
            const data = await response.json();
            products = data.products || [];
            localStorage.setItem('products', JSON.stringify(products));
        } catch (error) {
            console.error('Lỗi khi load JSON:', error);
            products = [];
        }
    }

    displayProducts(products);
}

// Hàm tạo card thêm sản phẩm
function createAddProductCard() {
    const productList = document.getElementById('product-list');

    const card = document.createElement('div');
    card.classList.add('product-card', 'new-product-card');
    card.innerHTML = `
        <div class="product-info">
            <input type="text" id="new-name" placeholder="Tên sản phẩm" required>
            <input type="text" id="new-image" placeholder="Link hình ảnh" required>
            <input type="number" id="new-price" placeholder="Giá (vd: 100000)" required>
            <input type="text" id="new-description" placeholder="Mô tả" required>
            <input type="text" id="new-category" placeholder="Loại (vd: Trái cây)" required>
            <input type="number" id="new-stock" placeholder="Số lượng" required min="1">
            <div class="actions">
                <button id="save-product"><i class="fa-solid fa-check"></i> Lưu</button>
                <button id="cancel-product"><i class="fa-solid fa-xmark"></i> Hủy</button>
            </div>
        </div>
    `;

    productList.prepend(card);

    // Nút Lưu
    card.querySelector('#save-product').addEventListener('click', () => {
        const newProduct = {
            id: Date.now(),
            name: card.querySelector('#new-name').value,
            image: card.querySelector('#new-image').value,
            price: parseInt(card.querySelector('#new-price').value),
            description: card.querySelector('#new-description').value,
            category: card.querySelector('#new-category').value,
            stock: parseInt(card.querySelector('#new-stock').value)
        };

        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));

        displayProducts(products);
    });

    // Nút Hủy
    card.querySelector('#cancel-product').addEventListener('click', () => {
        card.remove();
    });
}

// Khi trang load
window.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    const addBtn = document.getElementById('add-product-btn');
    if (addBtn) addBtn.addEventListener('click', createAddProductCard);
});
