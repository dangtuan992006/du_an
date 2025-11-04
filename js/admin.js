document.addEventListener('DOMContentLoaded', function () {
  // Lấy các phần tử DOM
  const adminNameEl = document.getElementById("adminName");
  const adminEmailEl = document.getElementById("adminEmail");
  const adminPhoneEl = document.getElementById("adminPhone");
  const adminJoinDateEl = document.getElementById("adminJoinDate");

  const editBtn = document.getElementById("editBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const editForm = document.getElementById("editForm");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const editNameInput = document.getElementById("editName");
  const editEmailInput = document.getElementById("editEmail");
  const editPhoneInput = document.getElementById("editPhone");
  const editJoinDateInput = document.getElementById("editJoinDate");

  // Hàm để lấy tất cả người dùng từ localStorage
  function getUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers')) || {};
  }

  // Hàm để lưu lại danh sách người dùng
  function setUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  // Hàm để tải và hiển thị thông tin admin
  function loadAdminInfo() {
    const adminEmail = localStorage.getItem("adminEmail");
    if (!adminEmail) {
      alert("Vui lòng đăng nhập với tư cách admin!");
      window.location.href = "../pages/login.html";
      return;
    }

    const users = getUsers();
    const admin = users[adminEmail];

    if (admin) {
      adminNameEl.textContent = `Tên admin: ${admin.name || ''}`;
      adminEmailEl.textContent = admin.email || "";
      adminPhoneEl.textContent = admin.phone || "Chưa cập nhật";
      adminJoinDateEl.textContent = admin.join_date || 'Chưa cập nhật';
    }
  }

  // Xử lý sự kiện click nút "Sửa thông tin"
  editBtn.addEventListener("click", () => {
    const adminEmail = localStorage.getItem("adminEmail");
    const users = getUsers();
    const admin = users[adminEmail];

    if (admin) {
       // Điền thông tin hiện tại vào form
      editNameInput.value = admin.name || '';
      editEmailInput.value = admin.email || '';
      editPhoneInput.value = admin.phone || '';
      editJoinDateInput.value = admin.join_date || "";

      // Hiển thị form
      editForm.style.display = "block";
    }
  });

  // Xử lý sự kiện click nút "Hủy"
  cancelBtn.addEventListener("click", () => {
    editForm.style.display = "none";
  });

  // Xử lý sự kiện click nút "Lưu"
  saveBtn.addEventListener("click", () => {
     // Lấy giá trị mới từ các ô input
    const newName = editNameInput.value;
    const newEmail = editEmailInput.value;
    const newPhone = editPhoneInput.value;
    const newJoinDate = editJoinDateInput.value;

     // Cập nhật trực tiếp giao diện người dùng, không lưu vào localStorage
    adminNameEl.textContent = `Tên admin: ${newName || ''}`;
    adminEmailEl.textContent = newEmail || '';
    adminPhoneEl.textContent = newPhone || 'Chưa cập nhật';
    adminJoinDateEl.textContent = newJoinDate || 'Chưa cập nhật';

     // Ẩn form chỉnh sửa
    editForm.style.display = "none";
    alert("Cập nhật thông tin thành công!");
  });

  // Xử lý đăng xuất
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("currentUserRole");
    // Chuyển hướng về trang chủ sau khi đăng xuất
  });

  // Tải thông tin admin khi trang được load
  loadAdminInfo();
});