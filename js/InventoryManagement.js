const btnAdd = document.getElementById("btnAdd");
const modal = document.getElementById("formAdd");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const tbody = document.querySelector(".data");

let editingRow = null; // Hàng đang được sửa (nếu có)

// Hiện form thêm sản phẩm
btnAdd.addEventListener("click", () => {
  modal.style.display = "block";
  editingRow = null; // Đảm bảo là đang ở chế độ thêm
  document.querySelector("h2").textContent = "Thêm sản phẩm tồn kho";
  clearForm();
});

// Ẩn form
cancelBtn.addEventListener("click", () => modal.style.display = "none");

// Hàm xóa dữ liệu trên form
function clearForm() {
  document.getElementById("maSp").value = "";
  document.getElementById("tenSp").value = "";
  document.getElementById("loai").value = "";
  document.getElementById("soLuong").value = "";
  document.getElementById("donVi").value = "";
}

// Lưu (thêm mới hoặc cập nhật)
saveBtn.addEventListener("click", () => {
  const maSp = document.getElementById("maSp").value.trim();
  const tenSp = document.getElementById("tenSp").value.trim();
  const loai = document.getElementById("loai").value.trim();
  const soLuong = document.getElementById("soLuong").value.trim();
  const donVi = document.getElementById("donVi").value.trim();

  if (!maSp || !tenSp) {
    alert("Vui lòng nhập mã và tên sản phẩm!");
    return;
  }

  // Nếu đang sửa
 
  modal.style.display = "none";
  clearForm();
});

// Xóa hoặc Sửa sản phẩm
document.addEventListener("click", (e) => {
  const target = e.target;

  // Xóa
  if (target.classList.contains("xoa")) {
    const row = target.closest("tr");
    const ten = row.children[1].textContent;
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${ten}" không?`)) {
      
    }
  }

  // Sửa
  if (target.classList.contains("sua")) {
    editingRow = target.closest("tr");
    document.querySelector("h2").textContent = "Chỉnh sửa sản phẩm tồn kho";
    modal.style.display = "block";

    
  }
});
