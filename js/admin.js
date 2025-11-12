document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử DOM cần thiết
  const editBtn = document.getElementById("editBtn");
  const editForm = document.getElementById("editForm");
  const editModalOverlay = document.getElementById("editModalOverlay");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // Các phần tử hiển thị thông tin admin
  const adminNameDisplay = document.getElementById("adminName");
  const adminEmailDisplay = document.getElementById("adminEmail");
  const adminPhoneDisplay = document.getElementById("adminPhone");
  const adminJoinDateDisplay = document.getElementById("adminJoinDate");

  // Các trường input trong form sửa
  const editNameInput = document.getElementById("editName");
  const editEmailInput = document.getElementById("editEmail");
  const editPhoneInput = document.getElementById("editPhone");
  const editJoinDateInput = document.getElementById("editJoinDate");

  // Xử lý khi nhấn nút "Sửa thông tin"
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      // Lấy dữ liệu hiện tại và điền vào form
      editNameInput.value = adminNameDisplay.textContent.replace("Tên admin: ", "").trim();
      editEmailInput.value = adminEmailDisplay.textContent.trim();
      editPhoneInput.value = adminPhoneDisplay.textContent.trim();
      
      const dateParts = adminJoinDateDisplay.textContent.trim().split('/');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        editJoinDateInput.value = `${year}-${month}-${day}`;
      }

      // Hiển thị form
      if (editModalOverlay) editModalOverlay.style.display = "flex";
    });
  }

  // Xử lý khi nhấn nút "Lưu"
  saveBtn?.addEventListener("click", () => {
    alert("Đã cập nhật thông tin thành công!"); // Hiển thị thông báo
    if (editModalOverlay) editModalOverlay.style.display = "none"; // Ẩn modal đi
  });

  // Xử lý khi nhấn nút "Hủy"
  cancelBtn?.addEventListener("click", () => {
    if (editModalOverlay) editModalOverlay.style.display = "none"; // Chỉ cần ẩn modal đi
  });
});