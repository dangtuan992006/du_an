// Đường dẫn tới file JSON (nếu cần load mặc định)
const JSON_PATH = '../data/products.json';

// Hiển thị sản phẩm
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
        <div class="product-card ${product.hidden ? 'hidden' : ''}" data-id="${product.id}">
            <img src="${product.image}" 
                alt="${product.name}" 
                class="product-image" 
                onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            <div class="product-name">${product.name}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p><i>${product.category}</i></p>
                <p><i class="fa-solid fa-align-left"></i> ${product.description}</p>
                <p class="price"><i class="fa-solid fa-money-bill-wave"></i> ${product.price} đồng/kg</p>
                <p class="stock">Còn: ${product.stock}</p>
            </div>
            
            <div class="actions-top">
                <button class="edit-btn" data-id="${product.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="hide-btn" data-id="${product.id}">
                    <i class="fa-solid ${product.hidden ? 'fa-eye' : 'fa-eye-slash'}"></i>
                </button>
                <button class="delete-btn" data-id="${product.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            </div>
    `).join('');

    attachEvents();
}

// Gắn sự kiện cho các nút
function attachEvents() {
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Xóa sản phẩm
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const newProducts = products.filter(p => p.id != id);
            localStorage.setItem('products', JSON.stringify(newProducts));
            displayProducts(newProducts);
        };
    });

    // Ẩn/Hiện sản phẩm
    document.querySelectorAll('.hide-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            products.forEach(p => { if (p.id == id) p.hidden = !p.hidden; });
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts(products);
        };
    });

    //  
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const product = products.find(p => p.id == id);
            if (!product) return;

            const card = btn.closest('.product-card');
            card.innerHTML = `
                <div class="product-info">
                    <input type="text" id="edit-name" value="${product.name}">
                    <input type="text" id="edit-image" value="${product.image}">
                    <input type="number" id="edit-price" value="${product.price}">
                    <input type="text" id="edit-description" value="${product.description}">
                    <input type="text" id="edit-category" value="${product.category}">
                    <input type="number" id="edit-stock" value="${product.stock}">
                    <div class="actions">
                        <button id="save-edit"><i class="fa-solid fa-check"></i></button>
                        <button id="cancel-edit"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
            `;

            card.querySelector('#save-edit').onclick = () => {
                product.name = card.querySelector('#edit-name').value;
                product.image = card.querySelector('#edit-image').value;
                product.price = parseInt(card.querySelector('#edit-price').value);
                product.description = card.querySelector('#edit-description').value;
                product.category = card.querySelector('#edit-category').value;
                product.stock = parseInt(card.querySelector('#edit-stock').value);
                localStorage.setItem('products', JSON.stringify(products));
                displayProducts(products);
            };

            card.querySelector('#cancel-edit').onclick = () => displayProducts(products);
        };
    });
}

// Thêm sản phẩm mới
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

    card.querySelector('#save-product').onclick = () => {
        const newProduct = {
            id: Date.now(),
            name: card.querySelector('#new-name').value,
            image: card.querySelector('#new-image').value,
            price: parseInt(card.querySelector('#new-price').value),
            description: card.querySelector('#new-description').value,
            category: card.querySelector('#new-category').value,
            stock: parseInt(card.querySelector('#new-stock').value),
            hidden: false
        };

        if (!newProduct.name || !newProduct.image || isNaN(newProduct.price)) {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
            return;
        }

        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts(products);
    };

    card.querySelector('#cancel-product').onclick = () => card.remove();
}

// Load dữ liệu từ JSON lần đầu hoặc từ localStorage
async function loadProducts() {
    let products = JSON.parse(localStorage.getItem('products'));
    if (products && products.length > 0) {
        displayProducts(products);
        return;
    }

    try {
        const response = await fetch(JSON_PATH);
        if (!response.ok) throw new Error(`Không thể tải file JSON (HTTP ${response.status})`);
        const data = await response.json();
        products = data.products.map(p => ({ ...p, hidden: false }));
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts(products);
    } catch (error) {
        console.error('Lỗi khi load products:', error);
        displayProducts([]);
    }
}

// Khi trang load
window.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    const addBtn = document.getElementById('add-product-btn');
    if (addBtn) addBtn.addEventListener('click', createAddProductCard);
});