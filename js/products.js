document.addEventListener("DOMContentLoaded", () => {
  const productList = document.querySelector(".product-list");
  const addProductBtn = document.getElementById("add-product-btn");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-b");
  const pageNumbersContainer = document.getElementById("page-numbers");
  const prevPageBtn = document.querySelector(".pagination-arrow:first-of-type");
  const nextPageBtn = document.querySelector(".pagination-arrow:last-of-type");

  // --- CHỨC NĂNG TÌM KIẾM ---
  const filterProducts = () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const allProducts = productList.querySelectorAll(".product-card:not(.new-product-card)");
    let found = false;

    allProducts.forEach(card => {
      const nameElement = card.querySelector(".product-info p:first-child");
      if (nameElement) {
        const name = nameElement.textContent.toLowerCase();
        if (name.includes(keyword)) {
          card.style.display = "flex";
          found = true;
        } else {
          card.style.display = "none";
        }
      }
    });

    // Cập nhật lại thông báo nếu không tìm thấy sản phẩm
    updateEmptyState(found ? productList.children.length : 0);
  };

  searchBtn.addEventListener("click", filterProducts);

  // --- CHỨC NĂNG PHÂN TRANG ẢO ---
  let currentPage = 1;
  const totalPages = 5; // Giả sử có 10 trang

  const renderPagination = () => {
    pageNumbersContainer.innerHTML = ""; // Xóa các số trang cũ
    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("span");
      pageNumber.className = "page-number";
      pageNumber.textContent = i;
      pageNumber.dataset.page = i;
      if (i === currentPage) {
        pageNumber.classList.add("active");
      }
      pageNumbersContainer.appendChild(pageNumber);
    }
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  };

  const goToPage = (page) => {
    currentPage = page;
    renderPagination();
  };

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  });

  pageNumbersContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("page-number")) {
      const page = parseInt(e.target.dataset.page);
      if (page !== currentPage) {
        goToPage(page);
      }
    }
  });

  // --- CHỨC NĂNG THÊM SẢN PHẨM ---
  addProductBtn.addEventListener("click", () => {
    // Kiểm tra xem có form thêm sản phẩm nào đang mở không
    

    const newProductCard = document.createElement("div");
    newProductCard.className = "product-card new-product-card";
    newProductCard.innerHTML = `
      <input type="text" placeholder="URL Hình ảnh (VD: ../images/ten.jpg)" id="new-image">
      <input type="text" placeholder="Tên sản phẩm" id="new-name">
      <select id="new-type">
        <option>Bán chạy nhất</option>
        <option>Quà tặng trái cây</option>
        <option>Trái cây Việt Nam</option>
        <option>Đặc biệt</option>
      </select>
      
      <textarea id="new-desc" placeholder="Giới thiệu"></textarea>
      <div class="actions">
        <button id="save-new-product">Lưu</button>
        <button id="cancel-new-product">Hủy</button>
      </div>
    `;
    productList.prepend(newProductCard);

    // Nút Hủy
    document.getElementById("cancel-new-product").addEventListener("click", () => {
      newProductCard.remove();
    });

    // Nút Lưu
    document.getElementById("save-new-product").addEventListener("click", () => {
      const imageUrl = document.getElementById("new-image").value.trim(); 
      const name = document.getElementById("new-name").value.trim(); // Vẫn lấy tên từ input có id="new-name"
      const description = document.getElementById("new-desc").value.trim();

      

      // Thay vì tạo sản phẩm mới, chỉ ẩn form và thông báo
      newProductCard.remove();
      alert("Sản phẩm đã được thêm.");
    });
  });

  // --- SỬ DỤNG EVENT DELEGATION CHO CÁC NÚT XÓA, SỬA, ẨN ---
  productList.addEventListener("click", (e) => {
    const target = e.target;
    const productCard = target.closest(".product-card");

    if (!productCard) return;

    // Chức năng Xóa
    if (target.closest(".delete-btn")) {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
        alert("Sản phẩm đã được xóa.");
      }
    }

    // Chức năng Ẩn/Hiện
    if (target.closest(".hide-btn")) {
      productCard.classList.toggle("hidden");
      const icon = target.closest(".hide-btn").querySelector("i");
      if (productCard.classList.contains("hidden")) {
        icon.className = "fa-solid fa-eye"; // Đổi icon thành "hiện"
      } else {
        icon.className = "fa-solid fa-eye-slash"; // Đổi icon thành "ẩn"
      }
    }

    // Chức năng Sửa
    if (target.closest(".edit-btn")) {
      const infoDiv = productCard.querySelector(".product-info");
      const imageElement = productCard.querySelector("img");
      const paragraphs = infoDiv.querySelectorAll("p");

      // Lấy dữ liệu hiện tại
      const originalImageUrl = imageElement.src;
      const originalName = paragraphs[0].textContent.replace("Tên sản phẩm: ", "");
      const originalcategory = paragraphs[1].textContent.replace("Loại sản phẩm: ", "");
      const originalDesc = paragraphs[2].textContent.replace("Giới thiệu: ", "");

      // Lưu lại nội dung HTML gốc để khôi phục khi hủy
      productCard.dataset.originalHtml = infoDiv.innerHTML;
      productCard.dataset.originalImage = originalImageUrl;

      // Tạo danh sách các tùy chọn cho thẻ select
      const categories = ["Bán chạy nhất", "Quà tặng trái cây", "Trái cây Việt Nam", "Đặc biệt"];
      const optionsHtml = categories.map(category => 
        `<option value="${category}" ${category === originalcategory ? 'selected' : ''}>${category}</option>`
      ).join('');

      // Tạo form chỉnh sửa
      infoDiv.innerHTML = `
        <input type="text" value="${originalImageUrl}" class="edit-input" placeholder="URL Hình ảnh">
        <input type="text" value="${originalName}" class="edit-input">
        <select class="edit-input">
          ${optionsHtml}
        </select>
        <textarea class="edit-input">${originalDesc}</textarea>
        <button class="save-edit-btn">Lưu</button>
        <button class="cancel-edit-btn">Hủy</button>
      `;
    }

    // Nút Lưu sau khi sửa
    if (target.closest(".save-edit-btn")) {
        const infoDiv = productCard.querySelector(".product-info");
        const imageElement = productCard.querySelector("img");
        const inputs = infoDiv.querySelectorAll("input");

        // Thay vì cập nhật, khôi phục lại trạng thái ban đầu và thông báo
        if (productCard.dataset.originalHtml) { 
            infoDiv.innerHTML = productCard.dataset.originalHtml; 
            imageElement.src = productCard.dataset.originalImage;
            delete productCard.dataset.originalHtml;
            delete productCard.dataset.originalImage;
        }
        alert("Sản phẩm đã được cập nhật.");
    }

    // Nút Hủy sau khi sửa
    if (target.closest(".cancel-edit-btn")) {
        const infoDiv = productCard.querySelector(".product-info");
        const imageElement = productCard.querySelector("img");
        // Khôi phục lại nội dung HTML từ dataset đã lưu
        if (productCard.dataset.originalHtml) {
            infoDiv.innerHTML = productCard.dataset.originalHtml;
            imageElement.src = productCard.dataset.originalImage;
            delete productCard.dataset.originalHtml; // Xóa đi để dọn dẹp
            delete productCard.dataset.originalImage;
        }
    }
  });

  // --- HÀM TIỆN ÍCH ---

  // Hàm tạo một thẻ sản phẩm mới
  function createProductCard(name, description, imageUrl, category) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="actions-top">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="hide-btn"><i class="fa-solid fa-eye-slash"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
      <img src="${imageUrl}" alt="${name}" onerror="this.src='../images/placeholder.png';">
      <div class="product-info">
        <p>Tên sản phẩm: ${name}</p>
        <p>Loại sản phẩm: ${category}</p>
        <p>Giới thiệu: ${description}</p>
      </div>
    `;
    return card;
  }

  // Hàm kiểm tra và hiển thị thông báo nếu không có sản phẩm nào
  function updateEmptyState(productCount) {
    const existingEmptyState = productList.querySelector(".empty-state");
    if (existingEmptyState) {
        existingEmptyState.remove();
    }

    if (productCount === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <i class="fa-solid fa-box-open"></i>
        <p>${searchInput.value ? 'Không tìm thấy sản phẩm nào.' : 'Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!'}</p>
      `;
      productList.appendChild(emptyState);
    }
  }

  // Kiểm tra lần đầu khi tải trang
  updateEmptyState(productList.querySelectorAll(".product-card:not(.new-product-card)").length);
  updatePaginationUI(); // Cập nhật giao diện phân trang lần đầu
});
