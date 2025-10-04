// Đường dẫn tới file JSON
const JSON_PATH = '../data/products.json';

// Hàm hiển thị sản phẩm
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    
    // Kiểm tra nếu không có sản phẩm
    if (!products || products.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <p>Chưa có sản phẩm nào</p>
            </div>
        `;
        return;
    }

    // Tạo HTML cho từng sản phẩm
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" 
                    alt="${product.name}" 
                    class="product-image" 
                    onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            <div class="product-name">${product.name}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p><i> ${product.category} </i></p>
                <p><i class="fa-solid fa-align-left"></i> ${product.description}</p>
                <p class="price"><i class="fa-solid fa-money-bill-wave"></i> ${product.price}</p>
            </div>
        </div>
    `).join('');
}


// Hàm load dữ liệu từ JSON
async function loadProducts() {
    const productList = document.getElementById('product-list');
    
    // Hiển thị loading
    productList.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Đang tải sản phẩm...</p>
        </div>
    `;

    try {
        const response = await fetch(JSON_PATH);
        if (!response.ok) {
            throw new Error(`Không thể tải file JSON (HTTP ${response.status})`);
        }
        
        const data = await response.json();
        if (!data.products || !Array.isArray(data.products)) {
            throw new Error('Cấu trúc JSON không đúng - cần có mảng "products"');
        }
        
        displayProducts(data.products);
        
    } catch (error) {
        console.error('Lỗi khi load products:', error);
        displayError(error.message);
    }
}

// Load sản phẩm khi trang được tải
window.addEventListener('DOMContentLoaded', loadProducts);
