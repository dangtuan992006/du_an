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
      this.Products.initProductsPage();
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
// MODULE XÁC THỰC (AUTH)
// ========================================
App.Auth = {
  init() {
    // Nạp users.json vào localStorage
    fetch("../data/users.json")
      .then((res) => res.json())
      .then((data) => {
        const existing =
          JSON.parse(localStorage.getItem("registeredUsers")) || {};
        const merged = { ...existing, ...data };
        localStorage.setItem("registeredUsers", JSON.stringify(merged));
        console.log("users.json đã được nạp.");
      })
      .catch((err) => console.error("Lỗi nạp users.json:", err));

    // Admin login
    const adminForm = document.getElementById("adminLoginForm");
    if (adminForm)
      adminForm.addEventListener("submit", this.handleAdminLogin.bind(this));

    // Customer login/register
    const emailForm = document.getElementById("emailForm");
    if (emailForm) this.setupCustomerAuth(emailForm);

    // Logout button
    this.setupLogoutHandler();
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

  setupLogoutHandler() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".logout-btn")) {
        e.preventDefault();
        this.logout();
      }
    });
  },

  handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    fetch("../data/admin.json")
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được admin.json");
        return res.json();
      })
      .then((data) => {
        const admins = Array.isArray(data) ? data : Object.values(data);
        const admin = admins.find(
          (a) => a.email === email && a.password === password
        );
        if (admin) {
          localStorage.setItem("currentUserRole", "admin");
          localStorage.setItem("adminUser", admin.name);
          localStorage.setItem("adminEmail", admin.email);
          if (admin.permissions) {
            localStorage.setItem(
              "adminPermissions",
              JSON.stringify(admin.permissions)
            );
          }
          App.utils.showNotification(`Chào Admin ${admin.name}!`);
          setTimeout(() => window.open("../admin/index.html", "_blank"), 1000);
        } else {
          App.utils.showNotification("Sai tài khoản hoặc mật khẩu!", "error");
        }
      })
      .catch(() => App.utils.showNotification("Lỗi hệ thống!", "error"));
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
      const filtered = Object.fromEntries(
        Object.entries(users).filter(([e]) => e !== "admin@gmail.com")
      );
      if (filtered[email]) {
        passwordGroup.style.display = "block";
        submitBtn.textContent = "Đăng nhập";
        isNewAccount = false;
      } else {
        statusHint.textContent =
          "Email chưa tồn tại. Nhập mật khẩu để tạo tài khoản.";
        passwordGroup.style.display = "block";
        submitBtn.textContent = "Tạo tài khoản";
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
        App.utils.showNotification("Tạo tài khoản thành công!");
        setTimeout(() => (window.location.href = "../pages/index.html"), 1000);
      } else {
        if (users[email]?.password === password) {
          localStorage.setItem("currentUser", users[email].name);
          localStorage.setItem("currentUserEmail", email);
          localStorage.setItem("currentUserRole", "customer");
          App.Cart.transferTempCartToUser(email);
          App.utils.showNotification(`Chào ${users[email].name}!`);
          setTimeout(
            () => (window.location.href = "../pages/index.html"),
            1000
          );
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
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminEmail");
    App.utils.showNotification("Đã đăng xuất!");
    setTimeout(() => (window.location.href = "../pages/index.html"), 600);
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
      window.opener.location.href = "../pages/index.html";
      window.close();
    } else {
      window.location.href = "../pages/index.html";
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
      setTimeout(() => (window.location.href = "../pages/login.html"), 1500);
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
                  ? 'window.location.href="../pages/login.html"'
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
      setTimeout(() => (window.location.href = "../pages/login.html"), 1500);
      return;
    }
    localStorage.removeItem("singleProductForPayment");
    this.openPaymentPopup();
  },

  openPaymentPopup() {
    const win = window.open(
      "../pages/payment-popup.html",
      "payment",
      "width=850,height=700,scrollbars=yes"
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
// MODULE SẢN PHẨM (PRODUCTS)
// ========================================
App.Products = {
  init() {
    const search = document.getElementById("searchInput");
    const cat = document.getElementById("categoryFilter");
    const sort = document.getElementById("sortSelect");
    [search, cat, sort].forEach((el) =>
      el?.addEventListener("input", () => this.handleFilterChange())
    );
    if (sort) sort.addEventListener("change", () => this.handleFilterChange());
  },

  async loadInitialData() {
    try {
      const [prods, cats] = await Promise.all([
        fetch("../data/products.json").then((r) => r.json()),
        fetch("../data/categories.json").then((r) => r.json()),
      ]);
      App.productsData = prods;
      App.categoriesData = new Set(
        cats.map((c) => (typeof c === "object" ? c.name : c))
      );
      window.productsData = prods;
    } catch (e) {
      App.utils.showNotification("Lỗi tải dữ liệu!", "error");
    }
  },

  initProductsPage() {
    if (!document.getElementById("productsContainer")) return;
    this.applyFiltersAndSort();
    this.populateCategoryFilter();
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
    const search = (
      document.getElementById("searchInput")?.value || ""
    ).toLowerCase();
    const cat = document.getElementById("categoryFilter")?.value || "";
    const sort = document.getElementById("sortSelect")?.value || "default";

    App.Pagination.filteredProducts = App.productsData.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search);
      const matchCat = !cat || p.category === cat;
      return matchSearch && matchCat;
    });

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

    App.Pagination.renderProducts();
    App.Pagination.renderPagination();
  },

  getById(id) {
    return App.productsData.find((p) => p.id === parseInt(id));
  },

  createProductCardHTML(p) {
    return `
      <div class="product-card" data-product-id="${p.id}">
        <a href="../pages/product-detail.html?id=${p.id}" class="product-link">
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
      .getElementById("next-page")
      ?.addEventListener("click", () => this.goToPage(this.currentPage + 1));
  },

  renderProducts() {
    const container = document.getElementById("productsContainer");
    if (!container) return;
    const items = this.getPaginatedProducts();
    container.innerHTML = items.length
      ? items.map((p) => App.Products.createProductCardHTML(p)).join("")
      : `<div class="no-products"><i class="fas fa-search"></i><h3>Không tìm thấy sản phẩm</h3></div>`;
  },

  renderPagination() {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    const total = Math.ceil(
      this.filteredProducts.length / this.productsPerPage
    );
    if (total <= 1) return (container.style.display = "none");
    container.style.display = "flex";
    document.getElementById("current-page").textContent = this.currentPage;
    document.getElementById("total-pages").textContent = total;
    document.getElementById("prev-page").disabled = this.currentPage === 1;
    document.getElementById("next-page").disabled = this.currentPage === total;
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
      else window.location.href = "../pages/login.html";
    });

    document.addEventListener("click", () => menu.classList.remove("show"));
    menu.addEventListener("click", (e) => e.stopPropagation());
  },
};

// ========================================
// MODULE HỒ SƠ (PROFILE)
// ========================================
App.Profile = {
  init() {
    if (!location.pathname.includes("settings.html")) return;
    if (!localStorage.getItem("currentUserEmail"))
      return (location.href = "../pages/login.html");

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
      () => (location.href = "../pages/thongtintaikhoan.html")
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
      location.href = "../pages/index.html";
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
              <div class="payment-option"><input type="radio" name="pm" value="cash" id="cash"><label for="cash">Tiền mặt</label></div>
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
            <button onclick="App.Checkout.confirmSingle()" class="btn btn-primary">Xác nhận</button>
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
    const p = JSON.parse(localStorage.getItem("singleProductForPayment"));
    const qty = parseInt(document.getElementById("qty").value);
    const pm = document.querySelector('input[name="pm"]:checked')?.value;
    const addrType = document.querySelector(
      'input[name="addr"]:checked'
    )?.value;
    if (!pm || !addrType) return this.showMessage("Chọn đầy đủ!", "error");
    const addr =
      addrType === "new"
        ? document.getElementById("newAddr").value.trim()
        : this.getUserInfo().address;
    if (!addr) return this.showMessage("Nhập địa chỉ!", "error");

    const order = {
      items: [{ ...p, quantity: qty }],
      total: p.price * qty,
      customerInfo: { ...this.getUserInfo(), address: addr },
      paymentMethod: pm,
    };
    this.saveOrder(order);
    localStorage.removeItem("singleProductForPayment");
    this.showMessage("Thanh toán thành công!", "success");
    setTimeout(() => {
      window.close();
      opener?.location.reload();
    }, 2000);
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
      <div class="checkout-container">
        <div class="checkout-header"><h2>Thanh Toán Giỏ Hàng</h2><p>Xin chào: <strong>${
          user.name
        }</strong></p></div>
        <div class="checkout-body">
          <div class="checkout-section"><h3>Sản phẩm</h3><div class="checkout-items">${items}</div></div>
          <div class="checkout-section"><h3>Phương thức</h3>
            <div class="payment-methods">
              <div class="payment-option"><input type="radio" name="pm" value="banking" id="bank"><label for="bank">Chuyển khoản</label></div>
              <div class="payment-option"><input type="radio" name="pm" value="cash" id="cash"><label for="cash">Tiền mặt</label></div>
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
    const pm = document.querySelector('input[name="pm"]:checked')?.value;
    const addrType = document.querySelector(
      'input[name="addr"]:checked'
    )?.value;
    if (!pm || !addrType) return this.showMessage("Chọn đầy đủ!", "error");
    const addr =
      addrType === "new"
        ? document.getElementById("newAddr").value.trim()
        : this.getUserInfo().address;
    if (!addr) return this.showMessage("Nhập địa chỉ!", "error");

    const cart = App.Cart.get();
    const order = {
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      customerInfo: { ...this.getUserInfo(), address: addr },
      paymentMethod: pm,
    };
    this.saveOrder(order);
    App.Cart.save([]);
    this.showMessage("Thanh toán thành công!", "success");
    setTimeout(() => {
      window.close();
      opener?.location.reload();
    }, 2000);
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

  showMessage(msg, type) {
    const overlay = document.createElement("div");
    overlay.id = "paymentOverlay";
    overlay.className = "payment-overlay";
    overlay.innerHTML = `<div class="payment-message ${type}">${msg}</div>`;
    document.body.appendChild(overlay);
    if (type !== "error") setTimeout(() => overlay.remove(), 2000);
  },
};

// ========================================
// MODULE LỊCH SỬ ĐƠN HÀNG
// ========================================
App.OrderHistory = {
  init() {
    if (!location.pathname.includes("order-history.html")) return;
    if (!localStorage.getItem("currentUserEmail"))
      return (location.href = "../pages/login.html");

    const email = localStorage.getItem("currentUserEmail");
    const orders = this.getOrders(email);
    this.displayOrders(orders);

    document
      .getElementById("closeOrderDrawer")
      ?.addEventListener("click", this.closeDrawer.bind(this));
    document
      .getElementById("orderDetailOverlay")
      ?.addEventListener("click", this.closeDrawer.bind(this));
  },

  getOrders(email) {
    const key = `orders_${email}`;
    let orders = JSON.parse(localStorage.getItem(key)) || [];
    if (!orders.length) {
      const sample = [
        {
          id: 1,
          date: "2025-10-01T10:00:00",
          total: 1500000,
          status: "completed",
          items: [{ name: "Sample Product", qty: 1, price: 1500000 }],
        },
      ];
      localStorage.setItem(key, JSON.stringify(sample));
      orders = sample;
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
    list.style.display = "grid";
    empty.style.display = "none";
    list.innerHTML = orders.map((o) => this.createOrderCard(o)).join("");
  },

  createOrderCard(order) {
    const date = new Date(order.date).toLocaleString("vi-VN");
    return `
      <div class="order-card" onclick="App.OrderHistory.viewDetail(${
        order.id
      })">
        <div class="order-id">#${order.id}</div>
        <div class="order-date">${date}</div>
        <div class="order-total">${App.utils.formatPrice(order.total)} VNĐ</div>
        <div class="order-status status-${order.status}">${
      order.status === "pending" ? "Chờ xử lý" : "Hoàn thành"
    }</div>
      </div>`;
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

    document.getElementById("orderDetailContent").innerHTML = `
      <div class="detail-header">
        <h3>Chi tiết đơn hàng #${order.id}</h3>
        <p>Ngày: ${new Date(order.date).toLocaleString("vi-VN")}</p>
      </div>
      <div class="detail-section">
        <h4>Sản phẩm</h4>
        ${items}
      </div>
      <div class="detail-section">
        <h4>Thông tin nhận hàng</h4>
        <p><strong>Người nhận:</strong> ${
          order.customerInfo?.fullName || order.customerInfo?.name || "N/A"
        }</p>
        <p><strong>Điện thoại:</strong> ${
          order.customerInfo?.phone || "N/A"
        }</p>
        <p><strong>Địa chỉ:</strong> ${order.customerInfo?.address || "N/A"}</p>
      </div>
      <div class="detail-section">
        <h4>Thanh toán</h4>
        <p><strong>Phương thức:</strong> ${
          order.paymentMethod === "banking" ? "Chuyển khoản" : "Tiền mặt"
        }</p>
        <p><strong>Tổng cộng:</strong> ${App.utils.formatPrice(
          order.total
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
