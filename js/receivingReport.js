// ===================== MỞ / ĐÓNG MODAL THÊM PHIẾU =====================
const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

// Mở modal thêm phiếu nhập
addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Hủy thêm phiếu nhập
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  clearForm();
});

// Xóa nội dung form sau khi thêm/hủy
function clearForm() {
  document.getElementById("maPhieu").value = "";
  document.getElementById("ngayNhap").value = "";
  document.getElementById("tenSp").value = "";
  document.getElementById("tongSl").value = "";
  document.getElementById("tongGt").value = "";
}

// ===================== NÚT LƯU PHIẾU NHẬP =====================
saveBtn.addEventListener("click", () => {
  const maPhieu = document.getElementById("maPhieu").value.trim();
  const ngayNhap = document.getElementById("ngayNhap").value;
  const tenSp = document.getElementById("tenSp").value.trim();
  const tongSl = document.getElementById("tongSl").value.trim();
  const tongGt = document.getElementById("tongGt").value.trim();

  // Kiểm tra dữ liệu hợp lệ
  if (!maPhieu || !ngayNhap || !tenSp || !tongSl || !tongGt) {
    alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Kiểm tra trùng mã phiếu
  const allCodes = Array.from(document.querySelectorAll("tbody tr th:first-child"))
    .map(th => th.textContent.trim());
  if (allCodes.includes(maPhieu)) {
    alert("❌ Mã phiếu này đã tồn tại!");
    return;
  }

  // Tạo dòng mới
  const tbody = document.querySelector("tbody");
  const newRow = document.createElement("tr");
  newRow.classList.add("tablesp");

  const id = document.querySelectorAll(".see").length + 1;
  newRow.innerHTML = `
    <th>${maPhieu}</th>
    <th>${formatDate(ngayNhap)}</th>
    <th>${tenSp}</th>
    <th>${tongSl}</th>
    <th>${tongGt}</th>
    <th><button class="see" id="${id}">xem</button></th>
  `;

  tbody.appendChild(newRow);

  // Gắn lại sự kiện “xem” cho nút mới
  attachViewListeners();

  // Đóng modal + reset form
  clearForm();
  modal.style.display = "none";
  alert("✅ Đã thêm phiếu nhập mới!");
});

// ===================== ĐỊNH DẠNG NGÀY =====================
function formatDate(dateStr) {
  if (!dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

// ===================== XEM CHI TIẾT PHIẾU =====================
const viewModal = document.getElementById("viewModal");
const closeBtn = document.querySelector(".close");

function attachViewListeners() {
  const seeButtons = document.querySelectorAll(".see");
  seeButtons.forEach((btn) => {
    btn.onclick = (e) => {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll("th");

      document.getElementById("maPhieuInfo").textContent = cells[0].textContent;
      document.getElementById("ngayNhapInfo").textContent = cells[1].textContent;
      document.getElementById("tenSpInfo").textContent = cells[2].textContent;
      document.getElementById("tongSlInfo").textContent = cells[3].textContent;
      document.getElementById("tongGtInfo").textContent = cells[4].textContent;

      viewModal.style.display = "flex";
    };
  });
}

// Đóng modal xem chi tiết
closeBtn.addEventListener("click", () => {
  viewModal.style.display = "none";
});

// Click ra ngoài để đóng modal
window.addEventListener("click", (event) => {
  if (event.target === modal) modal.style.display = "none";
  if (event.target === viewModal) viewModal.style.display = "none";
});

// ===================== TÌM KIẾM PHIẾU NHẬP =====================
const searchInput = document.querySelector(".search input");

searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(keyword) ? "" : "none";
  });
});

// Gán sự kiện “xem” khi trang load
attachViewListeners();
