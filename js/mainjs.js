/**
 * main.js - File JavaScript chính và duy nhất cho toàn bộ ứng dụng web
 *
 * File này chứa tất cả logic cho:
 * - Xác thực người dùng (Đăng nhập/Đăng ký cho khách và Admin)
 * - Quản lý giỏ hàng (Thêm, sửa, xóa, hiển thị giỏ hàng dạng drawer)
 * - Quản lý sản phẩm (Hiển thị, phân trang, tìm kiếm, lọc, sắp xếp)
 * - Xử lý thanh toán (cho sản phẩm đơn lẻ và cả giỏ hàng)
 * - Lịch sử đơn hàng của người dùng
 * - Carousel banner
 * - Các tương tác UI chung (dropdown user, thông báo)
 *
 * CÁCH HOẠT ĐỘNG:
 * - Script tự động phát hiện trang hiện tại và khởi tạo các module tương ứng.
 * - Sử dụng localStorage để lưu trữ dữ liệu người dùng, giỏ hàng, đơn hàng.
 * - Sử dụng Event Delegation để xử lý sự kiện trên các phần tử được tạo động.
 * - Quản lý trạng thái (bộ lọc, trang) trên URL để người dùng có thể chia sẻ link.
 */

// ========================================
// DỮ LIỆU TRỰC TIẾP (KHÔNG DÙNG FETCH)
// ========================================
const APP_DATA = {
  categories: [
    { id: "trai-cay", name: "trái cây" },
    { id: "qua-tang", name: "quà tặng" },
    { id: "dac-biet", name: "đặc biệt" },
  ],
  products: [
    {
      id: 1,
      name: "Banana",
      image: "../images/chuoi.webp",
      price: 25000,
      description:
        "Chuối vàng thơm ngọt, cung cấp năng lượng dồi dào và mang lại cảm giác thư thái dễ chịu.",
      category: "Đặc biệt",
      stock: 58,
    },
    {
      id: 2,
      name: "Dâu Tây",
      image: "../images/quatang2.jpeg",
      price: 180000,
      description:
        "Dâu tây đỏ mọng, vị ngọt nhẹ, hương thơm dịu dàng khiến ai cũng muốn thưởng thức mãi.",
      category: "Quà tặng trái cây",
      stock: 112,
    },
    {
      id: 3,
      name: "Cam Ngọt",
      image: "../images/cam.webp",
      price: 40000,
      description:
        "Cam ngọt tươi mát, mọng nước và giàu vitamin giúp bạn khởi đầu ngày mới thật sảng khoái.",
      category: "Trái cây Việt Nam",
      stock: 75,
    },
    {
      id: 4,
      name: "Nho Tím",
      image: "../images/nho.jpeg",
      price: 120000,
      description:
        "Nho tím đậm vị, lớp vỏ căng mọng và hương vị thanh tao khiến người thưởng thức say mê.",
      category: "Bán chạy nhất",
      stock: 180,
    },
    {
      id: 5,
      name: "Bơ",
      image: "../images/bo.jpeg",
      price: 60000,
      description:
        "Bơ sáp thơm béo, mềm mịn, chứa nhiều dưỡng chất giúp làn da mịn màng và cơ thể khỏe mạnh.",
      category: "Trái cây Việt Nam",
      stock: 64,
    },
    {
      id: 6,
      name: "Vải Thiều",
      image: "../images/vai.jpeg",
      price: 50000,
      description:
        "Vải thiều ngọt thanh, hương thơm quyến rũ, là món quà tinh tế mang hương vị mùa hè Việt.",
      category: "Trái cây Việt Nam",
      stock: 138,
    },
    {
      id: 7,
      name: "Lựu Đỏ",
      image: "../images/luu.jpeg",
      price: 130000,
      description:
        "Lựu đỏ mọng nước, hạt giòn ngọt, tượng trưng cho sự thịnh vượng và may mắn trong cuộc sống.",
      category: "Bán chạy nhất",
      stock: 91,
    },
    {
      id: 8,
      name: "Cherry Đỏ",
      image: "../images/cherry.jpeg",
      price: 250000,
      description:
        "Cherry đỏ tươi, vị ngọt thanh và hương thơm quyến rũ khiến bạn khó quên ngay lần đầu.",
      category: "Quà tặng trái cây",
      stock: 124,
    },
    {
      id: 9,
      name: "Dứa Vàng",
      image: "../images/duavang.jpeg",
      price: 30000,
      description:
        "Dứa vàng chín mọng, vị chua ngọt hài hòa mang lại cảm giác sảng khoái trong ngày oi bức.",
      category: "Bán chạy nhất",
      stock: 43,
    },
    {
      id: 10,
      name: "set trái cây quà tặng số 1",
      image: "../images/quatang1.jpeg",
      price: 350000,
      description:
        "Giỏ quà trái cây tươi ngon, được chọn lọc kỹ lưỡng, thể hiện sự tinh tế và chân thành khi tặng.",
      category: "Quà tặng trái cây",
      stock: 98,
    },
    {
      id: 11,
      name: "Chanh",
      image: "../images/chanh.jpeg",
      price: 20000,
      description:
        "Chanh tươi mọng nước, vị chua dịu nhẹ giúp thanh lọc cơ thể và mang lại cảm giác sảng khoái.",
      category: "Bán chạy nhất",
      stock: 172,
    },
    {
      id: 12,
      name: "Kiwi Xanh",
      image: "../images/kiwi.jpeg",
      price: 140000,
      description:
        "Kiwi xanh chua ngọt hài hòa, chứa nhiều vitamin giúp làn da tươi sáng và cơ thể khỏe mạnh.",
      category: "Bán chạy nhất",
      stock: 67,
    },
    {
      id: 13,
      name: "Táo",
      image: "../images/tao.jpeg",
      price: 90000,
      description:
        "Táo giòn ngọt, hương thơm dễ chịu, biểu tượng cho sức khỏe dồi dào và sự may mắn lâu dài.",
      category: "Bán chạy nhất",
      stock: 154,
    },
    {
      id: 14,
      name: "Mận",
      image: "../images/man.jpeg",
      price: 40000,
      description:
        "Mận chín đỏ, vị chua ngọt giòn tan, là món ăn thanh mát giúp xua tan mệt mỏi ngày hè.",
      category: "Bán chạy nhất",
      stock: 117,
    },
    {
      id: 15,
      name: "Carrot",
      image: "../images/carrot.jpg",
      price: 30000,
      description:
        "Cà rốt tươi giòn, giàu vitamin A, giúp sáng mắt, đẹp da và tăng cường sức đề kháng tự nhiên.",
      category: "Trái cây Việt Nam",
      stock: 134,
    },
    {
      id: 16,
      name: "set trái cây quà tặng số 2",
      image: "../images/quatang3.jpeg",
      price: 500000,
      description:
        "Hộp quà trái cây cao cấp, lựa chọn hoàn hảo để gửi gắm yêu thương và tri ân người thân yêu.",
      category: "Quà tặng trái cây",
      stock: 188,
    },
    {
      id: 17,
      name: "Dưa Hấu Đỏ",
      image: "../images/watermelon.jpg",
      price: 25000,
      description:
        "Dưa hấu đỏ ngọt thanh, mọng nước, giúp giải nhiệt và mang lại cảm giác mát lành tuyệt vời.",
      category: "Trái cây Việt Nam",
      stock: 142,
    },
    {
      id: 18,
      name: "Xoài",
      image: "../images/mango.jpg",
      price: 50000,
      description:
        "Xoài cát vàng chín ngọt, thơm lừng đặc trưng, mang hương vị đậm đà khó quên của miền nhiệt đới.",
      category: "Trái cây Việt Nam",
      stock: 88,
    },
  ],
  users: {
    "user@example.com": {
      name: "user",
      email: "user@example.com",
      password: "123456",
      phone: "0123456",
      join_date: "2025-10-01",
    },
  },
};

// ========================================
// ĐỐI TƯỢNG ỨNG DỤNG CHÍNH (APP)
// ========================================
const App = {
  // --- Trạng thái toàn cục ---
  productsData: [],
  categoriesData: new Set(),

  // --- Các module con ---
  Auth: {},
  Cart: {},
  Products: {},
  UI: {},
  Checkout: {},
  OrderHistory: {},
  Profile: {},
  Pagination: {},
  BannerCarousel: {},

  // --- Hàm khởi tạo chính ---
  init() {
    console.log("App initializing...");

    // 1. Khởi tạo các module cơ bản không phụ thuộc dữ liệu
    this.Auth.init();
    this.Cart.init();
    this.UI.init();
    this.BannerCarousel.init();

    // 2. Tải dữ liệu ban đầu (sản phẩm, danh mục)
    this.Products.loadInitialData().then(() => {
      // 3. Sau khi có dữ liệu, khởi tạo các module phụ thuộc
      this.Pagination.init();
      this.Products.initProductsPage(); // Hàm này bây giờ cũng setup search
      this.Cart.updateCount(); // Cập nhật số lượng giỏ hàng lần đầu
    });

    // 4. Khởi tạo các module cho các trang cụ thể
    this.Checkout.init();
    this.OrderHistory.init();
    this.Profile.init();

    console.log("App initialized.");
  },

  // --- Hàm tiện ích chung ---
  utils: {
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN").format(price);
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showNotification(message, type = "success", duration = 1500) {
      let notification = document.querySelector(".cart-notification");
      if (!notification) {
        notification = document.createElement("div");
        notification.className = "cart-notification";
        document.body.appendChild(notification);
        const style = document.createElement("style");
        style.textContent = `
          .cart-notification {
            position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white;
            padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000; animation: slideIn 0.3s ease; display: flex; align-items: center;
            gap: 10px; font-family: Arial, sans-serif; font-size: 14px;
          }
          .cart-notification.error { background: #f44336; }
          .cart-notification i { font-size: 18px; }
          @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
      }
      notification.innerHTML = `<i class="fas fa-${
        type === "success" ? "check-circle" : "exclamation-circle"
      }"></i> <span>${message}</span>`;
      notification.className = `cart-notification ${
        type === "error" ? "error" : ""
      }`;
      notification.style.display = "flex";
      setTimeout(() => {
        notification.style.display = "none";
      }, duration);
    },
  },
};

// ========================================
// MODULE XÁC THỰC (AUTH) - ĐÃ ĐƠN GIẢN HÓA
// ========================================
// ========================================
// MODULE XÁC THỰC (AUTH) - ĐÃ ĐƠN GIẢN HÓA
// ========================================
App.Auth = {
  init() {
    const existing = JSON.parse(localStorage.getItem("registeredUsers")) || {};
    const merged = { ...existing, ...APP_DATA.users };
    localStorage.setItem("registeredUsers", JSON.stringify(merged));
    console.log("Dữ liệu người dùng đã được nạp.");

    // Thêm sự kiện cho nút đăng nhập khách
    const guestLoginBtn = document.getElementById("guestLoginBtn");
    if (guestLoginBtn) {
      guestLoginBtn.addEventListener("click", this.handleGuestLogin.bind(this));
    }

    // Thêm sự kiện cho nút đăng ký nhanh
    const quickRegisterBtn = document.getElementById("quickRegisterBtn");
    if (quickRegisterBtn) {
      quickRegisterBtn.addEventListener(
        "click",
        this.handleQuickRegister.bind(this)
      );
    }

    const emailForm = document.getElementById("emailForm");
    if (emailForm) this.setupCustomerAuth(emailForm);
  },

  isProfileEmpty(email) {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};
      const u = users[email] || {};
      if (typeof u.profileCompleted === "boolean") return !u.profileCompleted;
      return !(u.phone?.trim() || u.address?.trim());
    } catch {
      return true;
    }
  },

  // Hàm xử lý đăng nhập khách vãng lai
  handleGuestLogin() {
    // Tạo ID ngẫu nhiên cho khách
    const guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const guestEmail = `${guestId}@guest.com`;
    const guestName = "Khách vãng lai";

    // Lưu thông tin khách vào localStorage
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};
    users[guestEmail] = {
      name: guestName,
      email: guestEmail,
      isGuest: true,
      created: new Date().toISOString(),
      profileCompleted: false,
    };
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    // Đăng nhập ngay
    localStorage.setItem("currentUser", guestName);
    localStorage.setItem("currentUserEmail", guestEmail);
    localStorage.setItem("currentUserRole", "customer");

    // Chuyển giỏ hàng tạm thời cho người dùng
    App.Cart.transferTempCartToUser(guestEmail);

    // Thông báo và chuyển hướng
    App.utils.showNotification("Đăng nhập thành công!");
    setTimeout(() => (window.location.href = "./index.html"), 1000);
  },

  // Hàm xử lý đăng ký nhanh
  handleQuickRegister() {
    const emailInput = document.getElementById("email");
    const email = emailInput ? emailInput.value.trim() : "";

    // Tạo email ngẫu nhiên nếu không có
    const userEmail =
      email && App.utils.isValidEmail(email)
        ? email
        : `user_${Date.now()}@pomegranate.com`;

    const username = email ? email.split("@")[0] : `user_${Date.now()}`;

    // Lưu thông tin người dùng mới
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};
    users[userEmail] = {
      name: username,
      email: userEmail,
      password: "", // Không cần mật khẩu
      created: new Date().toISOString(),
      profileCompleted: false,
      isQuickRegister: true,
    };
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    // Đăng nhập ngay
    localStorage.setItem("currentUser", username);
    localStorage.setItem("currentUserEmail", userEmail);
    localStorage.setItem("currentUserRole", "customer");

    // Chuyển giỏ hàng tạm thời cho người dùng
    App.Cart.transferTempCartToUser(userEmail);

    // Thông báo và chuyển hướng
    App.utils.showNotification("Đăng ký và đăng nhập thành công!");
    setTimeout(() => (window.location.href = "./index.html"), 1000);
  },

  setupCustomerAuth(form) {
    const emailInput = document.getElementById("email");
    const passwordGroup = document.getElementById("passwordGroup");
    const passwordInput = document.getElementById("password");
    const statusHint = document.getElementById("statusHint");
    const submitBtn = document.getElementById("submitBtn");
    let isNewAccount = false;

    emailInput.addEventListener("input", () => {
      const email = emailInput.value.trim();
      if (!email || !App.utils.isValidEmail(email)) {
        passwordGroup.style.display = "none";
        submitBtn.textContent = "Continue";
        return;
      }
      const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};
      if (users[email]) {
        passwordGroup.style.display = "block";
        submitBtn.textContent = "Đăng nhập";
        isNewAccount = false;
      } else {
        passwordGroup.style.display = "block";
        submitBtn.textContent = "Đăng nhập";
        isNewAccount = true;
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};

      if (!App.utils.isValidEmail(email)) return alert("Email không hợp lệ!");

      if (isNewAccount) {
        if (!password)
          return (statusHint.textContent = "Vui lòng nhập mật khẩu!");
        const username = email.split("@")[0];
        users[email] = {
          name: username,
          email,
          password,
          created: new Date().toISOString(),
          profileCompleted: false,
        };
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        localStorage.setItem("currentUser", username);
        localStorage.setItem("currentUserEmail", email);
        localStorage.setItem("currentUserRole", "customer");
        App.Cart.transferTempCartToUser(email);
        // App.utils.showNotification("Tạo tài khoản thành công!");
        setTimeout(() => (window.location.href = "./index.html"), 1000);
      } else {
        if (users[email]?.password === password) {
          localStorage.setItem("currentUser", users[email].name);
          localStorage.setItem("currentUserEmail", email);
          localStorage.setItem("currentUserRole", "customer");
          App.Cart.transferTempCartToUser(email);
          App.utils.showNotification(`Chào ${users[email].name}!`);
          setTimeout(() => (window.location.href = "./index.html"), 1000);
        } else {
          alert("Sai mật khẩu!");
        }
      }
    });
  },

  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserEmail");
    localStorage.removeItem("currentUserRole");
    App.utils.showNotification("Đã đăng xuất!");
    setTimeout(() => (window.location.href = "./index.html"), 600);
  },

  handleSocialLogin(provider) {
    const email = `user@${provider.toLowerCase()}.com`;
    const username = `${provider} User`;
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};
    if (!users[email]) {
      users[email] = {
        name: username,
        email,
        provider,
        created: new Date().toISOString(),
        isVerified: true,
        profileCompleted: false,
      };
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }
    localStorage.setItem("currentUser", username);
    localStorage.setItem("currentUserEmail", email);
    App.Cart.transferTempCartToUser(email);
    if (window.opener) {
      window.opener.location.href = "./index.html";
      window.close();
    } else {
      window.location.href = "./index.html";
    }
  },
};

window.logout = () => App.Auth.logout();
window.handleSocialLogin = (p) => App.Auth.handleSocialLogin(p);

// ========================================
// MODULE GIỎ HÀNG (CART)
// ========================================
App.Cart = {
  isInitialized: false,

  init() {
    if (this.isInitialized) return;
    document.addEventListener("click", (e) => {
      const target = e.target.closest.bind(e.target);
      if (target(".add-to-cart-btn")) {
        e.preventDefault();
        const id = parseInt(target(".add-to-cart-btn").dataset.productId);
        this.add(id, false);
      }
      if (target(".buy-now-btn")) {
        e.preventDefault();
        const id = parseInt(target(".buy-now-btn").dataset.productId);
        this.add(id, true);
      }
      if (e.target.id === "openCartPopup") this.openDrawer();
      if (e.target.id === "closeCartDrawer" || e.target.id === "cartOverlay")
        this.closeDrawer();
      if (e.target.id === "checkoutCartBtn") this.checkout();

      if (e.target.classList.contains("decrease-quantity"))
        this.updateQty(parseInt(e.target.dataset.id), -1);
      if (e.target.classList.contains("increase-quantity"))
        this.updateQty(parseInt(e.target.dataset.id), 1);
      if (e.target.classList.contains("remove-btn"))
        this.remove(parseInt(e.target.dataset.id));
    });
    this.isInitialized = true;
  },

  get() {
    const email = localStorage.getItem("currentUserEmail");
    const key = email ? `cart_${email}` : "temp_cart";
    return JSON.parse(localStorage.getItem(key)) || [];
  },

  save(cart) {
    const email = localStorage.getItem("currentUserEmail");
    const key = email ? `cart_${email}` : "temp_cart";
    localStorage.setItem(key, JSON.stringify(cart));
  },

  add(id, buyNow = false) {
    const product = App.Products.getById(id);
    if (!product)
      return App.utils.showNotification("Sản phẩm không tồn tại!", "error");

    if (buyNow && !localStorage.getItem("currentUser")) {
      App.utils.showNotification("Vui lòng đăng nhập để mua ngay!");
      setTimeout(() => (window.location.href = "./login.html"), 1500);
      return;
    }

    if (buyNow) {
      localStorage.setItem(
        "singleProductForPayment",
        JSON.stringify({ ...product, qty: 1 })
      );
      this.openPaymentPopup();
      App.utils.showNotification(`Chuẩn bị mua ngay: ${product.name}`);
      return;
    }

    let cart = this.get();
    const item = cart.find((i) => i.id === id);
    if (item) item.qty++;
    else cart.push({ ...product, qty: 1 });
    this.save(cart);
    this.updateCount();
    this.renderDrawer();
    App.utils.showNotification(`Đã thêm "${product.name}" vào giỏ!`);
  },

  updateQty(id, change) {
    let cart = this.get();
    const item = cart.find((i) => i.id === id);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
      this.save(cart);
      this.renderDrawer();
      this.updateCount();
    }
  },

  remove(id) {
    let cart = this.get().filter((i) => i.id !== id);
    this.save(cart);
    this.renderDrawer();
    this.updateCount();
  },

  updateCount() {
    const total = this.get().reduce((s, i) => s + i.qty, 0);
    document
      .querySelectorAll(".cart-count")
      .forEach((el) => (el.textContent = total));
  },

  renderDrawer() {
    const cart = this.get();
    const content = document.getElementById("cartDrawerContent");
    const footer = document.getElementById("cartDrawerFooter");
    if (!content || !footer) return;

    if (!cart.length) {
      content.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Giỏ hàng trống</p></div>`;
      footer.innerHTML = "";
      return;
    }

    let total = 0;
    const items = cart
      .map((item) => {
        total += item.price * item.qty;
        return `
        <div class="cart-item" data-id="${item.id}">
          <div class="item-image"><img src="${item.image}" alt="${
          item.name
        }"></div>
          <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-price">${App.utils.formatPrice(
              item.price
            )} VNĐ</div>
            <div class="quantity-controls">
              <button class="qty-btn decrease-quantity" data-id="${
                item.id
              }">-</button>
              <span class="quantity">${item.qty}</span>
              <button class="qty-btn increase-quantity" data-id="${
                item.id
              }">+</button>
              <button class="remove-btn" data-id="${
                item.id
              }"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>`;
      })
      .join("");

    content.innerHTML = items;
    const loggedIn = !!localStorage.getItem("currentUser");
    footer.innerHTML = `
      <div class="total-section">
        <span class="total-label">Tổng:</span>
        <span class="total-amount">${App.utils.formatPrice(total)} VNĐ</span>
      </div>
      <button class="checkout-btn ${!loggedIn ? "login-required" : ""}" 
              onclick="${
                !loggedIn
                  ? 'window.location.href="./login.html"'
                  : "App.Cart.checkout()"
              }">
        ${loggedIn ? "Thanh toán" : "Đăng nhập để thanh toán"}
      </button>`;
  },

  openDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    if (drawer && overlay) {
      drawer.classList.add("active");
      overlay.classList.add("active");
      this.renderDrawer();
    }
  },

  closeDrawer() {
    document.getElementById("cartDrawer")?.classList.remove("active");
    document.getElementById("cartOverlay")?.classList.remove("active");
  },

  checkout() {
    if (!this.get().length)
      return App.utils.showNotification("Giỏ hàng trống!");
    if (!localStorage.getItem("currentUser")) {
      App.utils.showNotification("Vui lòng đăng nhập!");
      setTimeout(() => (window.location.href = "./login.html"), 1500);
      return;
    }
    localStorage.removeItem("singleProductForPayment");
    this.openPaymentPopup();
  },

  openPaymentPopup() {
    const width = 850;
    const height = 700;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const win = window.open(
      "./payment-popup.html",
      "payment",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );
    if (!win) alert("Vui lòng cho phép popup!");
  },

  transferTempCartToUser(email) {
    const temp = JSON.parse(localStorage.getItem("temp_cart")) || [];
    if (!temp.length) return;
    const userKey = `cart_${email}`;
    const userCart = JSON.parse(localStorage.getItem(userKey)) || [];
    temp.forEach((t) => {
      const exist = userCart.find((u) => u.id === t.id);
      if (exist) exist.qty += t.qty;
      else userCart.push(t);
    });
    localStorage.setItem(userKey, JSON.stringify(userCart));
    localStorage.removeItem("temp_cart");
    this.updateCount();
  },
};

// ========================================
// MODULE SẢN PHẨM (PRODUCTS) - ĐÃ GỘP SEARCH
// ========================================
App.Products = {
  init() {
    // Logic khởi tạo ban đầu đã được chuyển vào initProductsPage
  },

  async loadInitialData() {
    try {
      App.productsData = APP_DATA.products;
      App.categoriesData = new Set(
        APP_DATA.categories.map((c) => (typeof c === "object" ? c.name : c))
      );
      window.productsData = APP_DATA.products;
      console.log("Dữ liệu sản phẩm và danh mục đã được nạp.");
    } catch (e) {
      App.utils.showNotification("Lỗi tải dữ liệu!", "error");
    }
  },

  initProductsPage() {
    // Hàm này được gọi sau khi dữ liệu đã tải xong
    if (!document.getElementById("productsContainer")) return;

    // 1. Hiển thị sản phẩm lần đầu
    this.applyFiltersAndSort();
    this.populateCategoryFilter();

    // 2. GỘP LOGIC TỪ SEARCH.JS VÀO ĐÂY
    this.setupSearchAndFilterListeners();
  },

  setupSearchAndFilterListeners() {
    // Lấy các phần tử DOM. Sử dụng cả ID và class để linh hoạt hơn.
    const searchInput =
      document.querySelector(".search-input") ||
      document.getElementById("searchInput");
    const searchButton = document.querySelector(".search-button");
    const categorySelect =
      document.querySelector(".category-select") ||
      document.getElementById("categoryFilter");
    const sortSelect = document.getElementById("sortSelect");

    const triggerFilter = () => {
      // Hàm này giờ đã an toàn để gọi vì được gọi từ bên trong module Products
      this.handleFilterChange();
    };

    if (searchButton) {
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        triggerFilter();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", triggerFilter);
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          triggerFilter();
        }
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", triggerFilter);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", triggerFilter);
    }
  },

  populateCategoryFilter() {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;
    filter.innerHTML = '<option value="">Tất cả danh mục</option>';
    App.categoriesData.forEach((cat) => {
      const opt = new Option(cat, cat);
      filter.add(opt);
    });
  },

  handleFilterChange() {
    App.Pagination.currentPage = 1;
    this.applyFiltersAndSort();
    App.Pagination.updateURL();
  },

  applyFiltersAndSort() {
    // --- SỬA LỖI TÌM KIẾM ---
    const searchInputElement =
      document.querySelector(".search-input") ||
      document.getElementById("searchInput");
    const search = (searchInputElement?.value || "").toLowerCase();

    // --- SỬA LỖI BỘ LỌC DANH MỤC ---
    // Tìm kiếm select một cách linh hoạt (theo class hoặc id)
    const categorySelectElement =
      document.querySelector(".category-select") ||
      document.getElementById("categoryFilter");
    let cat = categorySelectElement?.value || "";

    // Xử lý trường hợp giá trị là "ALL" (từ HTML của bạn) hoặc rỗng
    if (cat === "ALL") {
      cat = "";
    }

    const sort = document.getElementById("sortSelect")?.value || "default";

    // Lọc sản phẩm dựa trên tìm kiếm và danh mục
    App.Pagination.filteredProducts = App.productsData.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search);
      const matchCat = !cat || p.category === cat;
      return matchSearch && matchCat;
    });

    // Sắp xếp sản phẩm
    App.Pagination.filteredProducts.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Cập nhật phân trang
    App.Pagination.renderProducts();
    App.Pagination.renderPagination();
  },
  getById(id) {
    return App.productsData.find((p) => p.id === parseInt(id));
  },

  createProductCardHTML(p) {
    return `
      <div class="product-card" data-product-id="${p.id}">
        <a href="./product-detail.html?id=${p.id}" class="product-link">
          <div class="product-image">${this.getProductImageHTML(p)}</div>
        </a>
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          ${
            p.category
              ? `<span class="product-category">${p.category}</span>`
              : ""
          }
          <p class="product-description">${p.description}</p>
          <div class="product-price">${App.utils.formatPrice(p.price)} VNĐ</div>
          <div class="product-actions">
            <button class="buy-now-btn" data-product-id="${
              p.id
            }">Mua ngay</button>
            <button class="add-to-cart-btn" data-product-id="${p.id}">
              <i class="fas fa-shopping-cart"></i> Thêm giỏ
            </button>
          </div>
        </div>
      </div>`;
  },

  getProductImageHTML(p) {
    return p.image?.endsWith(".glb")
      ? `<model-viewer src="${p.image}" alt="${p.name}" auto-rotate camera-controls style="width:100%;height:100%;"></model-viewer>`
      : `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
  },
};

// ========================================
// MODULE PHÂN TRANG
// ========================================
App.Pagination = {
  currentPage: 1,
  productsPerPage: 12,
  filteredProducts: [],

  init() {
    this.bindEvents();
    window.addEventListener("popstate", () => this.applyStateFromURL());
  },

  bindEvents() {
    document
      .getElementById("prev-page")
      ?.addEventListener("click", () => this.goToPage(this.currentPage - 1));
    document
      .getElementById("")
      ?.addEventListener("click", () => this.goToPage(this.currentPage + 1));
  },

  renderProducts() {
    const container = document.getElementById("productsContainer");
    if (!container) return;
    const items = this.getPaginatedProducts();

    // Đảm bảo container luôn hiển thị, ngay cả khi không có sản phẩm
    container.style.display = "grid";

    if (items.length === 0) {
      container.innerHTML = `<div class="no-products"><i class="fas fa-search"></i><h3>Không tìm thấy sản phẩm</h3></div>`;
      return;
    }

    container.innerHTML = items
      .map((p) => App.Products.createProductCardHTML(p))
      .join("");
  },

  renderPagination() {
    const container = document.getElementById("paginationContainer");
    if (!container) return;

    const total = Math.ceil(
      this.filteredProducts.length / this.productsPerPage
    );

    // Luôn hiển thị phân trang, ngay cả khi chỉ có 1 trang
    container.style.display = "flex";

    // Cập nhật thông tin trang
    document.getElementById("current-page").textContent = this.currentPage;
    document.getElementById("total-pages").textContent = total || 1;

    // Cập nhật trạng thái nút
    document.getElementById("prev-page").disabled = this.currentPage === 1;
    document.getElementById("next-page").disabled = this.currentPage >= total;
  },

  getPaginatedProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    return this.filteredProducts.slice(start, start + this.productsPerPage);
  },

  goToPage(page) {
    const total = Math.ceil(
      this.filteredProducts.length / this.productsPerPage
    );
    if (page < 1 || page > total) return;
    this.currentPage = page;
    this.renderProducts();
    this.renderPagination();
    this.updateURL();
    document
      .getElementById("productsContainer")
      ?.scrollIntoView({ behavior: "smooth" });
  },

  updateURL() {
    const p = new URLSearchParams();
    if (this.currentPage > 1) p.set("page", this.currentPage);
    ["search", "category", "sort"].forEach((key) => {
      const val = document.getElementById(
        key + (key === "sort" ? "Select" : "Input")
      )?.value;
      if (val && (key !== "sort" || val !== "default")) p.set(key, val);
    });
    const url = `${location.pathname}?${p.toString()}`;
    history.pushState({ path: url }, "", url);
  },

  applyStateFromURL() {
    const p = new URLSearchParams(location.search);
    this.currentPage = parseInt(p.get("page")) || 1;
    ["searchInput", "categoryFilter", "sortSelect"].forEach((id) => {
      const el = document.getElementById(id);
      if (el)
        el.value =
          p.get(id.replace(/Input|Select/, "").toLowerCase()) ||
          (id === "sortSelect" ? "default" : "");
    });
    App.Products.applyFiltersAndSort();
  },
};

// ========================================
// MODULE GIAO DIỆN (UI)
// ========================================
App.UI = {
  init() {
    this.updateAuthUI();
    this.setupUserDropdown();
  },

  updateAuthUI() {
    const user = localStorage.getItem("currentUser");
    document
      .querySelectorAll(".user-text")
      .forEach((el) => (el.textContent = user || "Đăng nhập"));
  },

  setupUserDropdown() {
    const toggle = document.querySelector(".user-toggle");
    const menu = document.querySelector(".dropdown-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (localStorage.getItem("currentUser")) menu.classList.toggle("show");
      else window.location.href = "./login.html";
    });

    document.addEventListener("click", () => menu.classList.remove("show"));

    // SỬA LỖI ĐĂNG XUẤT: Xử lý logic đăng xuất ngay trong menu
    menu.addEventListener("click", (e) => {
      e.stopPropagation(); // Giữ menu mở khi click vào các mục bên trong

      // Kiểm tra xem nút đăng xuất có được nhấn không
      if (e.target.closest(".logout-btn")) {
        console.log("Nút đăng xuất đã được nhấn từ trong menu!");
        e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
        App.Auth.logout(); // Gọi hàm đăng xuất
      }
    });
  },
};

// ========================================
// MODULE HỒ SƠ (PROFILE)
// ========================================
App.Profile = {
  init() {
    if (!location.pathname.includes("settings.html")) return;
    if (!localStorage.getItem("currentUserEmail"))
      return (location.href = "./login.html");

    this.cacheDom();
    this.bindEvents();
    this.loadProfile();
  },

  cacheDom() {
    this.form = document.getElementById("profileForm");
    this.nameInput = document.getElementById("fullName");
    this.emailInput = document.getElementById("email");
    this.phoneInput = document.getElementById("phone");
    this.addressInput = document.getElementById("address");
    this.createdAt = document.getElementById("createdAt");
    this.saveBtn = document.getElementById("saveProfileBtn");
    this.cancelBtn = document.getElementById("cancelProfileBtn");
  },

  bindEvents() {
    this.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveProfile();
    });
    this.cancelBtn?.addEventListener(
      "click",
      () => (location.href = "./thongtintaikhoan.html")
    );
  },

  getUsers() {
    return JSON.parse(localStorage.getItem("registeredUsers")) || {};
  },

  setUsers(map) {
    localStorage.setItem("registeredUsers", JSON.stringify(map));
  },

  loadProfile() {
    const email = localStorage.getItem("currentUserEmail");
    const user = this.getUsers()[email] || {};
    this.nameInput.value =
      user.name || localStorage.getItem("currentUser") || "";
    this.emailInput.value = user.email || email || "";
    this.phoneInput.value = user.phone || "";
    this.addressInput.value = user.address || "";
    this.createdAt.textContent = this.formatDate(user.created);
  },

  saveProfile() {
    const oldEmail = localStorage.getItem("currentUserEmail");
    const users = this.getUsers();
    const user = users[oldEmail] || {};

    const name = this.nameInput.value.trim();
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();
    const address = this.addressInput.value.trim();

    if (!name || !email || !App.utils.isValidEmail(email)) {
      App.utils.showNotification(
        "Vui lòng nhập đầy đủ thông tin hợp lệ!",
        "error"
      );
      return;
    }

    if (email !== oldEmail && users[email]) {
      App.utils.showNotification("Email đã tồn tại!", "error");
      return;
    }

    const updated = {
      ...user,
      name,
      email,
      phone,
      address,
      profileCompleted: true,
      created: user.created || new Date().toISOString(),
    };

    if (email !== oldEmail) {
      delete users[oldEmail];
      this.migrateEmailKeys(oldEmail, email);
      localStorage.setItem("currentUserEmail", email);
    }
    users[email] = updated;
    this.setUsers(users);
    localStorage.setItem("currentUser", name);

    App.utils.showNotification("Cập nhật hồ sơ thành công!", "success", 1200);
    setTimeout(() => {
      sessionStorage.removeItem("needsProfileUpdate");
      location.href = "./index.html";
    }, 1300);
  },

  migrateEmailKeys(oldE, newE) {
    ["cart", "orders"].forEach((prefix) => {
      const oldK = `${prefix}_${oldE}`;
      const newK = `${prefix}_${newE}`;
      const data = localStorage.getItem(oldK);
      if (data && !localStorage.getItem(newK)) localStorage.setItem(newK, data);
      localStorage.removeItem(oldK);
    });
  },

  formatDate(iso) {
    try {
      const d = new Date(iso);
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(
        2,
        "0"
      )}:${String(d.getMinutes()).padStart(2, "0")}`;
    } catch {
      return iso;
    }
  },
};

// ========================================
// MODULE THANH TOÁN (CHECKOUT)
// ========================================
App.Checkout = {
  init() {
    if (!location.pathname.includes("payment-popup.html")) return;
    if (localStorage.getItem("singleProductForPayment"))
      this.loadSingleProduct();
    else this.loadCart();
  },

  loadSingleProduct() {
    const data = localStorage.getItem("singleProductForPayment");
    if (!data) return this.showError("Không có sản phẩm!");
    this.renderSingleProduct(JSON.parse(data));
  },

  renderSingleProduct(p) {
    const user = this.getUserInfo();
    document.body.innerHTML = `
      <div class="checkout-container">
        <div class="checkout-header"><h2>Thanh Toán</h2><p>Xin chào: <strong>${
          user.name
        }</strong></p></div>
        <div class="checkout-body">
          <div class="checkout-section">
            <h3>Sản phẩm</h3>
            <div class="product-info">
              <div class="product-image">${App.Products.getProductImageHTML(
                p
              )}</div>
              <div class="product-details">
                <h3>${p.name}</h3>
                <div class="product-price">${App.utils.formatPrice(
                  p.price
                )} VNĐ</div>
                <div class="quantity-selector">
                  <label>Số lượng:</label>
                  <div class="quantity-controls">
                    <button class="qty-btn" id="dec">-</button>
                    <input type="number" id="qty" min="1" value="1">
                    <button class="qty-btn" id="inc">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="checkout-section"><h3>Phương thức</h3>
            <div class="payment-methods">
              <div class="payment-option"><input type="radio" name="pm" value="banking" id="bank"><label for="bank">Chuyển khoản</label></div>
              <div class="payment-option"><input type="radio" name="pm" value="cash" id="cash" checked><label for="cash">Tiền mặt</label></div>
            </div>
          </div>
          <div class="checkout-section"><h3>Địa chỉ</h3>
            <div class="address-options">
              <div class="address-option"><input type="radio" name="addr" value="saved" id="saved" checked><label for="saved">Mặc định: ${
                user.address || "Chưa có"
              }</label></div>
              <div class="address-option"><input type="radio" name="addr" value="new" id="new"><label for="new">Địa chỉ mới</label></div>
            </div>
            <textarea id="newAddr" placeholder="Nhập địa chỉ mới..." style="display:none; width:100%; margin-top:8px;"></textarea>
          </div>
          <div class="checkout-summary">
            <div class="summary-row"><span>Tạm tính:</span><span id="subtotal">${App.utils.formatPrice(
              p.price
            )} VNĐ</span></div>
            <div class="summary-row"><span>Phí vận chuyển:</span><span>0 VNĐ</span></div>
            <div class="summary-row total"><span>Tổng:</span><span id="total">${App.utils.formatPrice(
              p.price
            )} VNĐ</span></div>
          </div>
          <div class="checkout-actions">
            <button  class="btn btn-primary">Xác nhận</button>
            <button onclick="window.close()" class="btn btn-secondary">Hủy</button>
          </div>
          <div id="msg"></div>
        </div>
      </div>`;
    this.setupSingleProduct(p);
  },

  setupSingleProduct(p) {
    const qtyInput = document.getElementById("qty");
    const update = () => {
      const qty = parseInt(qtyInput.value) || 1;
      const total = p.price * qty;
      document.getElementById("subtotal").textContent =
        App.utils.formatPrice(total) + " VNĐ";
      document.getElementById("total").textContent =
        App.utils.formatPrice(total) + " VNĐ";
    };
    document.getElementById("dec").onclick = () => {
      if (qtyInput.value > 1) {
        qtyInput.value--;
        update();
      }
    };
    document.getElementById("inc").onclick = () => {
      qtyInput.value++;
      update();
    };
    qtyInput.onchange = update;

    document
      .querySelectorAll(".payment-option, .address-option")
      .forEach((el) => {
        el.addEventListener("click", () => {
          el.querySelector("input").checked = true;
          document.getElementById("newAddr").style.display =
            el.querySelector("input").value === "new" ? "block" : "none";
        });
      });
  },

  confirmSingle() {
    try {
      const p = JSON.parse(localStorage.getItem("singleProductForPayment"));
      const qty = parseInt(document.getElementById("qty").value) || 1;
      const pm = document.querySelector('input[name="pm"]:checked')?.value;
      const addrType = document.querySelector(
        'input[name="addr"]:checked'
      )?.value;

      if (!pm)
        return this.showMessage(
          "Vui lòng chọn phương thức thanh toán!",
          "error"
        );
      if (!addrType)
        return this.showMessage("Vui lòng chọn loại địa chỉ!", "error");

      let addr = "";
      if (addrType === "new") {
        addr = document.getElementById("newAddr").value.trim();
        if (!addr)
          return this.showMessage("Vui lòng nhập địa chỉ giao hàng!", "error");
      } else {
        addr = this.getUserInfo().address;
        if (!addr)
          return this.showMessage(
            "Địa chỉ mặc định không tồn tại. Vui lòng chọn địa chỉ mới!",
            "error"
          );
      }

      const order = {
        id: Date.now().toString(),
        items: [{ ...p, qty: qty }],
        total: p.price * qty,
        customerInfo: { ...this.getUserInfo(), address: addr },
        paymentMethod: pm,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      this.saveOrder(order);
      localStorage.removeItem("singleProductForPayment");

      this.showMessage(
        `
        <div>
          <strong>Thanh toán thành công!</strong><br>
          <small>Mã đơn hàng: ${order.id}</small><br>
          <small>Tổng tiền: ${App.utils.formatPrice(
            order.total
          )} VNĐ</small><br>
        </div>
      `,
        "success"
      );

      setTimeout(() => {
        if (opener && !opener.closed) {
          opener.location.reload();
        }
        window.close();
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
    }
  },

  loadCart() {
    const cart = App.Cart.get();
    if (!cart.length)
      return (document.body.innerHTML = `<div class="checkout-container"><h2>Giỏ trống!</h2><button onclick="window.close()">Đóng</button></div>`);
    this.renderCart(cart);
  },

  renderCart(cart) {
    const user = this.getUserInfo();
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const items = cart
      .map(
        (i) => `
      <div class="checkout-item">
        <div class="item-info"><div class="item-name">${
          i.name
        }</div><div class="item-price">${App.utils.formatPrice(
          i.price
        )} VNĐ</div></div>
        <div class="item-quantity">x${i.qty}</div>
        <div class="item-total">${App.utils.formatPrice(
          i.price * i.qty
        )} VNĐ</div>
      </div>`
      )
      .join("");

    document.body.innerHTML = `
      <div class="checkout-container" style="background-color: #f9cbd6;">
        <div class="checkout-header"><h2>Thanh Toán Giỏ Hàng</h2><p>Xin chào: <strong>${
          user.name
        }</strong></p></div>
        <div class="checkout-body">
          <div class="checkout-section"><h3>Sản phẩm</h3><div class="checkout-items">${items}</div></div>
          <div class="checkout-section"><h3>Phương thức</h3>
            <div class="payment-methods">
              <div class="payment-option"><input type="radio" name="pm" value="banking" id="bank"><label for="bank">Chuyển khoản</label></div>
              <div class="payment-option"><input type="radio" name="pm" value="cash" id="cash" checked><label for="cash">Tiền mặt</label></div>
            </div>
          </div>
          <div class="checkout-section"><h3>Địa chỉ</h3>
            <div class="address-options">
              <div class="address-option"><input type="radio" name="addr" value="saved" id="saved" checked><label for="saved">Mặc định: ${
                user.address || "Chưa có"
              }</label></div>
              <div class="address-option"><input type="radio" name="addr" value="new" id="new"><label for="new">Địa chỉ mới</label></div>
            </div>
            <textarea id="newAddr" placeholder="Nhập địa chỉ mới..." style="display:none; width:100%; margin-top:8px;"></textarea>
          </div>
          <div class="checkout-summary">
            <div class="summary-row"><span>Tạm tính:</span><span>${App.utils.formatPrice(
              total
            )} VNĐ</span></div>
            <div class="summary-row"><span>Phí vận chuyển:</span><span>0 VNĐ</span></div>
            <div class="summary-row total"><span>Tổng:</span><span>${App.utils.formatPrice(
              total
            )} VNĐ</span></div>
          </div>
          <div class="checkout-actions">
            <button onclick="App.Checkout.confirmCart()" class="btn btn-primary">Xác nhận</button>
            <button onclick="window.close()" class="btn btn-secondary">Hủy</button>
          </div>
          <div id="msg"></div>
        </div>
      </div>`;
    document
      .querySelectorAll(".payment-option, .address-option")
      .forEach((el) => {
        el.addEventListener("click", () => {
          el.querySelector("input").checked = true;
          document.getElementById("newAddr").style.display =
            el.querySelector("input").value === "new" ? "block" : "none";
        });
      });
  },

  confirmCart() {
    try {
      // Kiểm tra phương thức thanh toán
      const pm = document.querySelector('input[name="pm"]:checked')?.value;
      const addrType = document.querySelector(
        'input[name="addr"]:checked'
      )?.value;

      if (!pm)
        return this.showMessage(
          "Vui lòng chọn phương thức thanh toán!",
          "error"
        );
      if (!addrType)
        return this.showMessage("Vui lòng chọn loại địa chỉ!", "error");

      // Lấy địa chỉ
      let addr = "";
      if (addrType === "new") {
        addr = document.getElementById("newAddr").value.trim();
        if (!addr)
          return this.showMessage("Vui lòng nhập địa chỉ giao hàng!", "error");
      } else {
        addr = this.getUserInfo().address;
        if (!addr)
          return this.showMessage(
            "Địa chỉ mặc định không tồn tại. Vui lòng chọn địa chỉ mới!",
            "error"
          );
      }

      // Lấy giỏ hàng và kiểm tra
      const cart = App.Cart.get();
      if (!cart || cart.length === 0) {
        return this.showMessage("Giỏ hàng trống!", "error");
      }

      // Tạo đơn hàng
      const order = {
        id: Date.now().toString(),
        items: [...cart],
        total: cart.reduce((s, i) => s + i.price * i.qty, 0),
        customerInfo: {
          ...this.getUserInfo(),
          address: addr,
        },
        paymentMethod: pm,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Lưu đơn hàng và xóa giỏ hàng
      this.saveOrder(order);
      App.Cart.save([]);

      // Hiển thị thông báo thành công
      this.showMessage(
        `
      <div>
        <strong>Thanh toán thành công!</strong><br>
        <small>Mã đơn hàng: ${order.id}</small><br>
        <small>Tổng tiền: ${App.utils.formatPrice(order.total)} VNĐ</small><br>
        <small>Đơn hàng sẽ được đóng tự động sau 2 giây...</small>
      </div>
    `,
        "success"
      );

      // Tự động đóng sau 2 giây
      setTimeout(() => {
        if (opener && !opener.closed) {
          opener.location.reload();
        }
        window.close();
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi xác nhận giỏ hàng:", error);
      this.showMessage(`Có lỗi xảy ra: ${error.message}`, "error");
    }
  },

  // Hàm hiển thị thông báo có thể đóng
  showMessage(message, type = "info") {
    const msgEl = document.getElementById("msg");
    if (!msgEl) return;

    const colors = {
      success: "#d4edda",
      error: "#f8d7da",
      info: "#d1ecf1",
      warning: "#fff3cd",
    };

    const textColors = {
      success: "#155724",
      error: "#721c24",
      info: "#0c5460",
      warning: "#856404",
    };

    msgEl.innerHTML = `
    <div style="
      padding: 15px 40px 15px 20px; 
      margin: 10px 0; 
      border-radius: 6px; 
      background: ${colors[type] || colors.info}; 
      color: ${textColors[type] || textColors.info};
      border: 1px solid ${textColors[type] || textColors.info}30;
      position: relative;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      <button onclick="this.parentElement.style.display='none'" 
        style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 18px; cursor: pointer; color: #666; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
        ×
      </button>
      ${message}
    </div>
  `;
    msgEl.style.display = "block";

    // Tự động ẩn thông báo lỗi sau 5 giây
    if (type === "error") {
      setTimeout(() => {
        const messageDiv = msgEl.querySelector("div");
        if (messageDiv) {
          messageDiv.style.display = "none";
        }
      }, 5000);
    }
  },

  getUserInfo() {
    const email = localStorage.getItem("currentUserEmail");
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};
    const u = users[email] || {};
    return {
      name: localStorage.getItem("currentUser") || "Khách",
      email: email || "",
      phone: u.phone || "",
      address: u.address || "",
    };
  },

  saveOrder(order) {
    const email = localStorage.getItem("currentUserEmail");
    if (!email) return;
    const key = `orders_${email}`;
    const orders = JSON.parse(localStorage.getItem(key)) || [];
    orders.push({
      ...order,
      id: Date.now(),
      date: new Date().toISOString(),
      status: "pending",
    });
    localStorage.setItem(key, JSON.stringify(orders));
  },

  showError(msg) {
    document.body.innerHTML = `<div class="error-container">${msg}</div>`;
  },
};

// ========================================
// MODULE LỊCH SỬ ĐƠN HÀNG
// ========================================

App.OrderHistory = {
  init() {
    // Chỉ chạy trên trang lịch sử đơn hàng
    if (!location.pathname.includes("order-history.html")) return;

    // Kiểm tra đăng nhập
    if (!localStorage.getItem("currentUserEmail")) {
      App.utils.showNotification(
        "Vui lòng đăng nhập để xem lịch sử đơn hàng!",
        "error"
      );
      setTimeout(() => (window.location.href = "./login.html"), 1500);
      return;
    }

    const userEmail = localStorage.getItem("currentUserEmail");
    const orders = this.getOrders(userEmail);
    this.displayOrders(orders);

    // Xử lý đóng drawer
    document
      .getElementById("closeOrderDrawer")
      ?.addEventListener("click", this.closeDrawer.bind(this));
    document
      .getElementById("orderDetailOverlay")
      ?.addEventListener("click", this.closeDrawer.bind(this));

    // Event delegation cho các nút hành động trong danh sách đơn hàng
    const orderListEl = document.getElementById("orderList");
    if (orderListEl) {
      orderListEl.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const orderId = btn.getAttribute("data-order-id");
        const action = btn.getAttribute("data-action");
        if (!orderId || !action) return;
        if (action === "view") return this.viewDetail(orderId);
        if (action === "cancel") return this.cancelOrder(orderId);
        if (action === "reorder") return this.reorderItems(orderId);
      });
    }
  },

  getOrders(email) {
    const key = `orders_${email}`;
    let orders = JSON.parse(localStorage.getItem(key)) || [];
    if (!orders.length) {
      // Nếu không có đơn hàng nào, tạo dữ liệu mẫu để người dùng thấy giao diện
      const sampleOrders = [
        {
          id: "ORD001",
          date: "2023-11-20",
          status: "delivered",
          items: [
            {
              id: 1,
              name: "Banana",
              price: 25000,
              quantity: 2,
              image: "./images/chuoi.webp",
            },
            {
              id: 3,
              name: "Cam Ngọt",
              price: 40000,
              quantity: 1,
              image: "./images/cam.webp",
            },
          ],
          total: 90000,
          shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
          paymentMethod: "Thanh toán khi nhận hàng",
        },
        {
          id: "ORD002",
          date: "2023-11-25",
          status: "processing",
          items: [
            {
              id: 2,
              name: "Dâu Tây",
              price: 180000,
              quantity: 1,
              image: "./images/quatang2.jpeg",
            },
            {
              id: 8,
              name: "Cherry Đỏ",
              price: 250000,
              quantity: 1,
              image: "./images/cherry.jpeg",
            },
          ],
          total: 430000,
          shippingAddress: "456 Đường XYZ, Quận 3, TP.HCM",
          paymentMethod: "Thẻ tín dụng",
        },
      ];
      localStorage.setItem(key, JSON.stringify(sampleOrders));
      orders = sampleOrders;
    }
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  displayOrders(orders) {
    const list = document.getElementById("orderList");
    const empty = document.getElementById("emptyOrders");
    if (!list) return;

    if (!orders.length) {
      list.style.display = "none";
      empty.style.display = "block";
      return;
    }

    // SỬA LỖI: Lưu trữ 'this' vào một biến tạm
    const self = this;

    list.innerHTML = orders.map((o) => self.createOrderCard(o)).join("");
  },

  createOrderCard(order) {
    const date = new Date(order.date).toLocaleString("vi-VN");
    // Xác định văn bản và class cho trạng thái
    let statusText = "Chờ xử lý";
    let statusClass = "status-pending";
    switch (order.status) {
      case "processing":
        statusText = "Đang xử lý";
        statusClass = "status-processing";
        break;
      case "shipped":
        statusText = "Đang vận chuyển";
        statusClass = "status-shipped";
        break;
      case "delivered":
        statusText = "Đã giao";
        statusClass = "status-delivered";
        break;
      case "cancelled":
        statusText = "Đã hủy";
        statusClass = "status-cancelled";
        break;
    }

    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">Mã đơn: ${order.id}</div>
            <div class="order-date">Ngày đặt: ${date}</div>
          </div>
          <div class="order-status ${statusClass}">${statusText}</div>
        </div>
        <div class="order-footer">
          <div class="order-total">${App.utils.formatPrice(
            order.total
          )} VNĐ</div>
          <div class="order-actions">
            <button class="btn btn-secondary" data-action="view" data-order-id="${
              order.id
            }">Xem chi tiết</button>
            ${
              order.status === "delivered"
                ? `<button class="btn btn-primary" data-action="reorder" data-order-id="${order.id}">Đặt lại</button>`
                : ""
            }
            ${
              order.status === "pending" || order.status === "processing"
                ? `<button class="btn btn-secondary" data-action="cancel" data-order-id="${order.id}">Hủy đơn</button>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  },

  viewDetail(id) {
    const email = localStorage.getItem("currentUserEmail");
    const orders = this.getOrders(email);
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const items = order.items
      .map(
        (i) => `
      <div class="detail-item">
        <span>${i.name}</span>
        <span>x${i.quantity || i.qty}</span>
        <span>${App.utils.formatPrice(
          (i.price || 0) * (i.quantity || i.qty)
        )} VNĐ</span>
      </div>`
      )
      .join("");

    // Xử lý ngày tháng với giá trị mặc định
    const orderDate = order.date
      ? new Date(order.date).toLocaleString("vi-VN")
      : "Chưa có ngày đặt";

    // Lấy thông tin khách hàng với giá trị mặc định
    const customerName =
      order.customerInfo?.fullName ||
      order.customerInfo?.name ||
      "Nguyễn Văn A";
    const customerPhone = order.customerInfo?.phone || "0123456789";
    const customerAddress = order.customerInfo?.address || "TP HCM";

    // Xử lý phương thức thanh toán với giá trị mặc định
    let paymentMethodText = "Tiền Mặt";
    if (order.paymentMethod === "banking") {
      paymentMethodText = "Chuyển khoản";
    } else if (order.paymentMethod === "cash") {
      paymentMethodText = "Tiền mặt";
    }

    document.getElementById("orderDetailContent").innerHTML = `
      <div class="detail-header">
        <h3>Chi tiết đơn hàng #${order.id}</h3>
        <p>Ngày: ${orderDate}</p>
      </div>
      <div class="detail-section">
        <h4>Sản phẩm</h4>
        ${items || "<p>Chưa có thông tin sản phẩm.</p>"}
      </div>
      <div class="detail-section">
        <h4>Thông tin nhận hàng</h4>
        <p><strong>Người nhận:</strong> ${customerName}</p>
        <p><strong>Điện thoại:</strong> ${customerPhone}</p>
        <p><strong>Địa chỉ:</strong> ${customerAddress}</p>
      </div>
      <div class="detail-section">
        <h4>Thanh toán</h4>
        <p><strong>Phương thức:</strong> ${paymentMethodText}</p>
        <p><strong>Tổng cộng:</strong> ${App.utils.formatPrice(
          order.total || 0
        )} VNĐ</p>
      </div>
    `;
    document.getElementById("orderDetailOverlay").style.display = "block";
    document.getElementById("orderDetailDrawer").classList.add("active");
  },

  closeDrawer() {
    document.getElementById("orderDetailOverlay").style.display = "none";
    document.getElementById("orderDetailDrawer").classList.remove("active");
  },

  cancelOrder(orderId) {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    const email = localStorage.getItem("currentUserEmail");
    const key = `orders_${email}`;
    let orders = JSON.parse(localStorage.getItem(key)) || [];
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = "cancelled";
      localStorage.setItem(key, JSON.stringify(orders));
      this.displayOrders(orders);
      App.utils.showNotification("Đơn hàng đã được hủy.", "success");
    }
  },

  reorderItems(orderId) {
    const email = localStorage.getItem("currentUserEmail");
    const orders = this.getOrders(email);
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.items.forEach((item) => {
      App.Cart.add(item.id, false, item.quantity || item.qty);
    });
    App.utils.showNotification("Đã thêm sản phẩm vào giỏ hàng!", "success");
    setTimeout(
      () => (window.location.href = "../pages/payment-popup.html"),
      1000
    );
  },
};

// ========================================
// MODULE BANNER CAROUSEL
// ========================================
App.BannerCarousel = {
  init() {
    const carousel = document.getElementById("hero-carousel");
    if (!carousel) return;

    const track = document.getElementById("carousel-track");
    const slides = document.querySelectorAll(".slide");
    const prev = document.getElementById("prev-slide");
    const next = document.getElementById("next-slide");
    const dots = document.querySelectorAll(".indicator");
    let idx = 0;
    const total = slides.length;

    const goTo = (i) => {
      idx = (i + total) % total;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle("active", j === idx));
    };

    let interval = setInterval(() => goTo(idx + 1), 5000);
    const reset = () => {
      clearInterval(interval);
      interval = setInterval(() => goTo(idx + 1), 5000);
    };

    prev?.addEventListener("click", () => {
      reset();
      goTo(idx - 1);
    });
    next?.addEventListener("click", () => {
      reset();
      goTo(idx + 1);
    });
    dots.forEach((d, i) =>
      d.addEventListener("click", () => {
        reset();
        goTo(i);
      })
    );
    carousel.addEventListener("mouseenter", () => clearInterval(interval));
    carousel.addEventListener("mouseleave", reset);

    goTo(0);
  },
};

// ========================================
// KHỞI CHẠY
// ========================================
window.addEventListener("DOMContentLoaded", () => App.init());

console.log("main.js loaded successfully!");
