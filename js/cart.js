let productsData = [];

// 1. Load JSON
fetch("../data/products.json")
  .then((response) => response.json())
  .then((data) => {
    productsData = data;
    initCartEvents(); // KHỞI TẠO EVENT SAU KHI LOAD DATA
  })
  .catch((error) => console.error("Lỗi tải file JSON:", error));

// 2. Hàm lấy sản phẩm theo ID
function getCurrentProduct() {
  const product = productsData.find((p) => p.id === 1) || productsData[0];
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    qty: 1,
  };
}

// 3. Hàm lấy giỏ hàng hiện tại (của user hoặc tạm thời)
function getCurrentCart() {
  const userEmail = localStorage.getItem("currentUserEmail");
  console.log("getCurrentCart - UserEmail:", userEmail);

  if (userEmail) {
    const userCartKey = `cart_${userEmail}`;
    const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    console.log("getCurrentCart - User Cart:", cart);
    return cart;
  } else {
    const tempCart = JSON.parse(localStorage.getItem("temp_cart")) || [];
    console.log("getCurrentCart - Temp Cart:", tempCart);
    return tempCart;
  }
}

// 4. Hàm lưu giỏ hàng hiện tại
function saveCurrentCart(cart) {
  const userEmail = localStorage.getItem("currentUserEmail");
  if (userEmail) {
    const userCartKey = `cart_${userEmail}`;
    localStorage.setItem(userCartKey, JSON.stringify(cart));
  } else {
    localStorage.setItem("temp_cart", JSON.stringify(cart));
  }
}

// 5. Hàm cập nhật số lượng giỏ hàng trên UI
function updateCartCount() {
  const cart = getCurrentCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

// 6. KHỞI TẠO TẤT CẢ EVENT LISTENERS
function initCartEvents() {
  console.log("Đang khởi tạo cart events...");

  // Xử lý nút "MUA NGAY"
  const buyNowBtn = document.querySelector(".buy-now-btn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", function () {
      console.log("MUA NGAY clicked");

      if (!localStorage.getItem("currentUser")) {
        alert("Vui lòng đăng nhập để mua hàng!");
        window.location.href = "../pages/login.html";
        return;
      }

      const currentProduct = getCurrentProduct();
      if (!currentProduct) {
        alert("Không tìm thấy sản phẩm để mua!");
        return;
      }

      localStorage.setItem("paymentProduct", JSON.stringify(currentProduct));

      const popup = window.open(
        "../pages/payment-popup.html",
        "payment_window",
        "width=850,height=700,scrollbars=yes,resizable=yes"
      );

      if (!popup) {
        alert("Vui lòng cho phép popup để thanh toán!");
      }
    });
  }

  // Xử lý nút "THÊM VÀO GIỎ HÀNG"
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      console.log("THÊM VÀO GIỎ clicked");

      const product = getCurrentProduct();
      if (!product) {
        alert("Không tìm thấy sản phẩm!");
        return;
      }

      let cart = getCurrentCart();

      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
        });
      }

      saveCurrentCart(cart);
      updateCartCount();

      // Hiển thị thông báo
      const notif = document.getElementById("cartNotification");
      if (notif) {
        notif.classList.add("show");
        setTimeout(() => notif.classList.remove("show"), 2000);
      }

      console.log("Đã thêm vào giỏ:", product.name);
    });
  }

  // Xử lý nút "THANH TOÁN GIỎ HÀNG"
  // Xử lý nút "THANH TOÁN GIỎ HÀNG"
  const checkoutBtn = document.getElementById("checkoutCartBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      console.log("THANH TOÁN GIỎ HÀNG clicked");

      if (!localStorage.getItem("currentUser")) {
        alert("Vui lòng đăng nhập để thanh toán!");
        window.location.href = "../pages/login.html";
        return;
      }

      // KHÔNG truyền cart data, để popup tự đọc từ localStorage của user
      console.log("Opening payment popup...");

      const popup = window.open(
        "../pages/payment-popup.html",
        "payment_window",
        "width=850,height=700,scrollbars=yes,resizable=yes"
      );

      if (popup) {
        popup.focus();
        console.log("Popup opened successfully");
      } else {
        console.log("Popup blocked by browser");
        alert("Popup bị chặn! Vui lòng cho phép popup.");
      }
    });
  }

  // Xử lý mở giỏ hàng drawer
  const openCartBtn = document.getElementById("openCartPopup");
  if (openCartBtn) {
    openCartBtn.addEventListener("click", function () {
      console.log("MỞ GIỎ HÀNG clicked");
      document.getElementById("cartDrawer").classList.add("active");
      document.getElementById("cartOverlay").style.display = "block";

      // Gọi hàm render từ main.js
      if (typeof renderCartDrawer === "function") {
        renderCartDrawer();
      }
    });
  }

  console.log("Cart events đã được khởi tạo");
}

// 7. Khởi tạo cart count khi load trang
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Nếu products.json load nhanh, vẫn đảm bảo events được gắn
  setTimeout(() => {
    if (productsData.length === 0) {
      initCartEvents();
    }
  }, 1000);
});

// 8. Hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
  return localStorage.getItem("currentUser") !== null;
}
