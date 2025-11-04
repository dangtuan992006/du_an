// 📁 Đường dẫn tới file JSON mặc định (khi chưa có dữ liệu trong localStorage)
const JSON_PATH = '../data/products.json';

/* =====================================================
                🧩 HIỂN THỊ DANH SÁCH SẢN PHẨM
   ===================================================== */
function displayProducts(products) {
    const productList = document.getElementById('product-list');

    // Nếu không có sản phẩm, hiển thị trạng thái rỗng
    if (!products || products.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <p>Chưa có sản phẩm nào</p>
            </div>
        `;
        return;
    }

    // Hiển thị danh sách sản phẩm (mỗi sản phẩm là 1 thẻ card)
    productList.innerHTML = products.map(product => `
        <div class="product-card ${product.hidden ? 'hidden' : ''}" data-id="${product.id}">
            <!-- Hình ảnh -->
            <img src="${product.image}" 
                alt="${product.name}" 
                class="product-image" 
                onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">

            <!-- Tên -->
            <div class="product-name">${product.name}</div>

            <!-- Thông tin chi tiết -->
            <div class="product-info">
                <h3>${product.name}</h3>
                <p><i>${product.category}</i></p>
                <p><i class="fa-solid fa-align-left"></i> ${product.description}</p>
                <p class="price"><i class="fa-solid fa-money-bill-wave"></i> ${product.price} đồng/kg</p>
                <p class="stock">Còn: ${product.stock}</p>
            </div>
            
            <!-- Hàng nút chức năng -->
            <div class="actions-top">
                <!-- Nút sửa -->
                <button class="edit-btn" data-id="${product.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <!-- Nút ẩn/hiện -->
                <button class="hide-btn" data-id="${product.id}">
                    <i class="fa-solid ${product.hidden ? 'fa-eye' : 'fa-eye-slash'}"></i>
                </button>

                <!-- Nút xóa -->
                <button class="delete-btn" data-id="${product.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Gắn sự kiện cho các nút sau khi render
    attachEvents();
}

/* =====================================================
        🔗 GẮN SỰ KIỆN CHO CÁC NÚT: XÓA / ẨN / SỬA
   ===================================================== */
function attachEvents() {
    const products = JSON.parse(localStorage.getItem('products')) || [];

    /* 🗑️ XÓA SẢN PHẨM */
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const newProducts = products.filter(p => p.id != id);
            localStorage.setItem('products', JSON.stringify(newProducts));
            displayProducts(newProducts);
        };
    });

    /* 👁️ ẨN / HIỆN SẢN PHẨM */
    document.querySelectorAll('.hide-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            products.forEach(p => { 
                if (p.id == id) p.hidden = !p.hidden; // đảo trạng thái ẩn/hiện
            });
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts(products);
        };
    });

    /* ✏️ SỬA SẢN PHẨM */
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const product = products.find(p => p.id == id);
            if (!product) return;

            const card = btn.closest('.product-card');

            // Biến card thành form sửa
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

            // Nút lưu thay đổi
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

            // Nút hủy chỉnh sửa
            card.querySelector('#cancel-edit').onclick = () => displayProducts(products);
        };
    });
}

/* =====================================================
                    ➕ THÊM SẢN PHẨM MỚI
   ===================================================== */
function createAddProductCard() {
    const productList = document.getElementById('product-list');
    const card = document.createElement('div');
    card.classList.add('product-card', 'new-product-card');

    // Tạo form nhập thông tin sản phẩm mới
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

    // 🟢 Lưu sản phẩm mới
    card.querySelector('#save-product').onclick = () => {
        const newProduct = {
            id: Date.now(), // tạo id ngẫu nhiên dựa trên timestamp
            name: card.querySelector('#new-name').value,
            image: card.querySelector('#new-image').value,
            price: parseInt(card.querySelector('#new-price').value),
            description: card.querySelector('#new-description').value,
            category: card.querySelector('#new-category').value,
            stock: parseInt(card.querySelector('#new-stock').value),
            hidden: false
        };

        // Kiểm tra dữ liệu đầu vào
        if (!newProduct.name || !newProduct.image || isNaN(newProduct.price)) {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
            return;
        }

        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts(products);
    };

    // 🔴 Hủy thêm sản phẩm
    card.querySelector('#cancel-product').onclick = () => card.remove();
}




// ==========================
// 🧩 HÀM LOAD DỮ LIỆU LẦN ĐẦU
// ==========================
async function loadProducts() {
    try {
        // 1️⃣ Lấy dữ liệu từ localStorage
        let products = JSON.parse(localStorage.getItem('products'));

        // 2️⃣ Nếu đã có dữ liệu, chỉ cần hiển thị luôn
        if (products && products.length > 0) {
            console.log("✅ Dữ liệu lấy từ localStorage");
            displayProducts(products);
            return;
        }

        // 3️⃣ Nếu chưa có, fetch từ file JSON
        console.log("🌐 Lần đầu truy cập - đang tải dữ liệu từ file JSON...");
        const response = await fetch('../data/products.json');

        // Kiểm tra phản hồi từ server
        if (!response.ok) {
            throw new Error(`Không thể tải file products.json (status: ${response.status})`);
        }

        // 4️⃣ Chuyển dữ liệu JSON sang object
        products = await response.json();

        // 5️⃣ Lưu vào localStorage để dùng cho lần sau
        localStorage.setItem('products', JSON.stringify(products));

        console.log("✅ Dữ liệu đã lưu vào localStorage thành công");
        displayProducts(products);

    } catch (error) {
        console.error("❌ Lỗi khi load dữ liệu sản phẩm:", error);
        alert("Không thể tải dữ liệu sản phẩm. Vui lòng kiểm tra lại file JSON!");
    }
}




/* =====================================================
                🚀 KHI TRANG VỪA LOAD
   ===================================================== */
window.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // tải dữ liệu ban đầu

    // Gắn sự kiện cho nút "Thêm sản phẩm"
    const addBtn = document.getElementById('add-product-btn');
    if (addBtn) addBtn.addEventListener('click', createAddProductCard);
});
