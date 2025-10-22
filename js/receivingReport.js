document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const modal = document.getElementById('modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');

    addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Ẩn form khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    
});

// Lấy modal và các phần tử chính
const viewModal = document.getElementById("viewModal");
const closeBtn = document.querySelector(".close");
const seeButtons = document.querySelectorAll(".see");

// Các phần tử thông tin cơ bản trong modal
const maPhieuInfo = document.getElementById("maPhieuInfo");
const ngayNhapInfo = document.getElementById("ngayNhapInfo");
const tenSpInfo = document.getElementById("tenSpInfo");
const tongSlInfo = document.getElementById("tongSlInfo");
const tongGtInfo = document.getElementById("tongGtInfo");

// Lưu dữ liệu chi tiết nhà sản xuất
let productDetails = [];

// 🔹 Đọc dữ liệu từ file JSON
fetch("../data/products.json")
  .then((response) => response.json())
  .then((data) => (productDetails = data))
  .catch((err) => console.error("Không thể tải file JSON:", err));

// 🔹 Gắn sự kiện cho các nút “xem”
seeButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Lấy dữ liệu từ hàng tương ứng
    const row = this.closest("tr");
    const maPhieu = row.children[0].textContent;
    const ngayNhap = row.children[1].textContent;
    const tenSp = row.children[2].textContent;
    const tongSl = row.children[3].textContent;
    const tongGt = row.children[4].textContent;

    // Gán thông tin cơ bản vào modal
    maPhieuInfo.textContent = maPhieu;
    ngayNhapInfo.textContent = ngayNhap;
    tenSpInfo.textContent = tenSp;
    tongSlInfo.textContent = tongSl;
    tongGtInfo.textContent = tongGt;

    // Xóa phần “Nhà sản xuất” cũ nếu có
    const oldExtra = viewModal.querySelector(".extra-info");
    if (oldExtra) oldExtra.remove();

    // Tìm thông tin thêm từ file JSON
    const detail = productDetails.find((p) => p.maPhieu === maPhieu);

    // Nếu tìm thấy → tạo thêm dòng hiển thị
    if (detail) {
      const extraInfo = document.createElement("div");
      extraInfo.classList.add("extra-info");
      extraInfo.innerHTML = `
        <hr>
        <p><strong>Nhà sản xuất:</strong> ${detail.nhaSanXuat}</p>
        <p><strong>Xuất xứ:</strong> ${detail.xuatXu}</p>
      `;
      // Gắn vào cuối phần nội dung modal
      viewModal.querySelector(".modal-content").appendChild(extraInfo);
    }

    // Hiển thị modal
    viewModal.style.display = "block";
  });
});

// 🔹 Đóng modal
closeBtn.addEventListener("click", () => {
  viewModal.style.display = "none";
});

// 🔹 Đóng khi click ra ngoài
window.addEventListener("click", (e) => {
  if (e.target === viewModal) {
    viewModal.style.display = "none";
  }
});






