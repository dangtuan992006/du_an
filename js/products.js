// --- CHỨC NĂNG THÊM SẢN PHẨM ---





document.addEventListener("DOMContentLoaded", () => {
  const productList = document.querySelector(".product-list");
  const addProductBtn = document.getElementById("add-product-btn");

  // --- CHỨC NĂNG THÊM SẢN PHẨM ---
  addProductBtn.addEventListener("click", () => {
    // Kiểm tra xem có form thêm sản phẩm nào đang mở không
    if (document.querySelector(".new-product-card")) {
      alert("Vui lòng hoàn thành việc thêm sản phẩm hiện tại.");
      return;
    }

    const newProductCard = document.createElement("div");
    newProductCard.className = "product-card new-product-card";
    newProductCard.innerHTML = `
      <input type="text" placeholder="URL Hình ảnh (VD: ../images/ten.jpg)" id="new-image">
      <input type="text" placeholder="Tên sản phẩm" id="new-name">
      <input type="text" placeholder="Giới thiệu" id="new-desc">
      <input type="number" placeholder="Giá (VNĐ)" id="new-price">
      <input type="number" placeholder="Số lượng (kg)" id="new-stock">
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
      const name = document.getElementById("new-name").value.trim();
      const description = document.getElementById("new-desc").value.trim();
      const price = document.getElementById("new-price").value;
      const stock = document.getElementById("new-stock").value;

      if (!imageUrl || !name || !description || !price || !stock) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      const card = createProductCard(name, description, price, stock, imageUrl);
      productList.prepend(card);
      newProductCard.remove();
      updateEmptyState();
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
        productCard.remove();
        updateEmptyState();
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
      const paragraphs = infoDiv.querySelectorAll("p");

      // Lấy dữ liệu hiện tại
      const originalName = paragraphs[0].textContent.replace("Tên sản phẩm: ", "");
      const originalDesc = paragraphs[1].textContent.replace("Giới thiệu: ", "");
      const originalPriceText = paragraphs[2].textContent.replace("Giá: ", "").replace(" VNĐ/kg", "");
      const originalStock = paragraphs[3].textContent.replace("Số lượng còn: ", "").replace(" kg", "");

      // Lưu lại nội dung HTML gốc để khôi phục khi hủy
      productCard.dataset.originalHtml = infoDiv.innerHTML;

      // Tạo form chỉnh sửa
      // Chuyển đổi giá từ '12.000' thành '12000' để input number có thể hiển thị
      const priceForInput = originalPriceText.replace(/\./g, "");

      infoDiv.innerHTML = `
        <input type="text" value="${originalName}" class="edit-input">
        <input type="text" value="${originalDesc}" class="edit-input">
        <input type="number" value="${priceForInput}" class="edit-input">
        <input type="number" value="${originalStock}" class="edit-input">
        <button class="save-edit-btn">Lưu</button>
        <button class="cancel-edit-btn">Hủy</button>
      `;
    }

    // Nút Lưu sau khi sửa
    if (target.classList.contains("save-edit-btn")) {
        const infoDiv = productCard.querySelector(".product-info");
        const inputs = infoDiv.querySelectorAll("input");
        const newName = inputs[0].value;
        const newDesc = inputs[1].value;
        const newPrice = Number(inputs[2].value).toLocaleString('de-DE');
        const newStock = inputs[3].value;

        infoDiv.innerHTML = `
            <p>Tên sản phẩm: ${newName}</p>
            <p>Giới thiệu: ${newDesc}</p>
            <p>Giá: ${newPrice} VNĐ/kg</p>
            <p>Số lượng còn: ${newStock} kg</p>
        `;
    }

    // Nút Hủy sau khi sửa
    if (target.classList.contains("cancel-edit-btn")) {
        const infoDiv = productCard.querySelector(".product-info");
        // Khôi phục lại nội dung HTML từ dataset đã lưu
        if (productCard.dataset.originalHtml) {
            infoDiv.innerHTML = productCard.dataset.originalHtml;
            delete productCard.dataset.originalHtml; // Xóa đi để dọn dẹp
        }
    }
  });

  // --- HÀM TIỆN ÍCH ---

  // Hàm tạo một thẻ sản phẩm mới
  function createProductCard(name, description, price, stock, imageUrl) {
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
        <p>Giới thiệu: ${description}</p>
        <p>Giá: ${Number(price).toLocaleString('de-DE')} VNĐ/kg</p>
        <p>Số lượng còn: ${stock} kg</p>
      </div>
    `;
    return card;
  }

  // Hàm kiểm tra và hiển thị thông báo nếu không có sản phẩm nào
  function updateEmptyState() {
    const existingEmptyState = productList.querySelector(".empty-state");
    if (existingEmptyState) {
        existingEmptyState.remove();
    }

    if (productList.children.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <i class="fa-solid fa-box-open"></i>
        <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</p>
      `;
      productList.appendChild(emptyState);
    }
  }

  // Kiểm tra lần đầu khi tải trang
  updateEmptyState();
});
