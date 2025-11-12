// ======================================================
// 🔐 LOGIN SCRIPT – HỖ TRỢ NHIỀU ADMIN
// ======================================================

fetch("../data/admin.json")
  .then((response) => response.json())
  .then((data) => {
    // Đảm bảo dữ liệu admin đọc từ JSON là object
    // Nếu là mảng, chuyển thành object dạng { email: {info} }
    let adminData = {};
    if (Array.isArray(data)) {
      data.forEach((admin) => {
        if (admin.email) adminData[admin.email] = admin;
      });
    } else {
      adminData = data;
    }

    // Lấy dữ liệu user đã tồn tại trong localStorage
    const existingUsers =
      JSON.parse(localStorage.getItem("currentUsers")) || {};

    // 🔄 Gộp dữ liệu admin + user cũ
    const mergedUsers = { ...existingUsers, ...adminData };
    localStorage.setItem("curentUsers", JSON.stringify(mergedUsers));

    console.log("✅ Đã nạp admin.json vào localStorage (merge với dữ liệu cũ)");

    // Lấy form đăng nhập admin
    const adminForm = document.getElementById("adminLoginForm");
    if (!adminForm) {
      console.error("⚠️ Không tìm thấy form có id='adminLoginForm'");
      return;
    }

    // Xử lý sự kiện đăng nhập
    adminForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("adminEmail").value.trim();
      const password = document.getElementById("adminPassword").value;

      const users =
        JSON.parse(localStorage.getItem("registeredUsers")) || {};

      const user = users[email];

      if (!user) {
        alert("❌ Tài khoản không tồn tại!");
        return;
      }

      if (user.password !== password) {
        alert("❌ Sai mật khẩu!");
        return;
      }

      // ✅ Nếu là admin
      if (user.role && user.role.toLowerCase() === "admin") {
        localStorage.setItem("currentUserRole", "admin");
        localStorage.setItem("currentAdminEmail", email);
        localStorage.setItem("adminUser", user.name || "Administrator");
        localStorage.setItem("adminEmail", user.email || email);
        localStorage.setItem("adminPhone", user.phone || "N/A");
        localStorage.setItem("adminPassword", user.password || "");
        localStorage.setItem("adminJoinDate", user.join_date || "2024-01-01");

        alert(`✅ Đăng nhập thành công với quyền Admin: ${user.name}!`);
        window.open("../admin/index.html", "_blank");
      } else {
        alert("🚫 Tài khoản này không có quyền admin!");
      }
    });
  })
  .catch((error) => console.error("❌ Lỗi khi nạp JSON:", error));
