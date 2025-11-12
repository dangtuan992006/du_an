// ======== HIỂN THỊ / ẨN BẢNG THÊM SẢN PHẨM ========
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const tableAdd = document.getElementById("tableAdd");

btnAdd.addEventListener("click", () => {
  tableAdd.style.display = "table";
});

btnCancel.addEventListener("click", () => {
  tableAdd.style.display = "none";
});


// ======== THÊM SẢN PHẨM MỚI ========
// → Thêm id="add" vào nút "Thêm" trong HTML hoặc chọn bằng vị trí
const addButton = tableAdd.querySelector("button:not(#btnCancel)");
const dataTable = document.querySelector(".data");

addButton.addEventListener("click", () => {
  const inputs = tableAdd.querySelectorAll("input");
  const select = tableAdd.querySelector("select");

  const tenSP = inputs[0].value.trim();
  const loai = select.value;
  const giaVon = parseFloat(inputs[1].value.replace(/,/g, ""));
  const loiNhuan = parseFloat(inputs[2].value);

  // Kiểm tra dữ liệu hợp lệ
  if (!tenSP || !loai || isNaN(giaVon) || isNaN(loiNhuan)) {
    alert("⚠️ Vui lòng nhập đầy đủ và đúng định dạng dữ liệu!");
    return;
  }

  // Tính giá bán
  const giaBan = Math.round(giaVon * (1 + loiNhuan / 100));

  // Tạo dòng mới
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <th>${tenSP}</th>
    <th>${loai}</th>
    <th>${giaVon.toLocaleString()}</th>
    <th>${loiNhuan}%</th>
    <th>${giaBan.toLocaleString()}</th>
    <th>
      <button class="sua">sửa</button>
      <button class="xoa">xóa</button>
    </th>
  `;

  dataTable.appendChild(newRow);

  // Reset form
  inputs.forEach(input => input.value = "");
  select.selectedIndex = 0;

  // Ẩn bảng thêm
  tableAdd.style.display = "none";
});


// ======== XÓA SẢN PHẨM ========
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("xoa")) {
    const row = e.target.closest("tr");
    const tenSP = row.children[0].textContent;
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${tenSP}" không?`)) {
      row.remove();
    }
  }
});


// ======== SỬA SẢN PHẨM ========
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("sua")) {
    const row = e.target.closest("tr");
    const cells = row.querySelectorAll("th");

    const tenSP = cells[0].textContent;
    const giaVonCu = parseFloat(cells[2].textContent.replace(/,/g, ""));
    const loiNhuanCu = parseFloat(cells[3].textContent.replace("%", ""));

    const giaVonMoi = prompt(`Nhập giá vốn mới cho "${tenSP}" (VND):`, giaVonCu);
    const loiNhuanMoi = prompt(`Nhập lợi nhuận mới (%) cho "${tenSP}":`, loiNhuanCu);

    if (giaVonMoi !== null && loiNhuanMoi !== null && !isNaN(giaVonMoi) && !isNaN(loiNhuanMoi)) {
      const giaBanMoi = Math.round(parseFloat(giaVonMoi) * (1 + parseFloat(loiNhuanMoi) / 100));
      cells[2].textContent = Number(giaVonMoi).toLocaleString();
      cells[3].textContent = loiNhuanMoi + "%";
      cells[4].textContent = giaBanMoi.toLocaleString();
    } else {
      alert("⚠️ Dữ liệu nhập không hợp lệ!");
    }
  }
});


// ======== TÌM KIẾM SẢN PHẨM ========
const searchInput = document.querySelector(".manager input");
searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  const rows = dataTable.querySelectorAll("tr");

  rows.forEach(row => {
    const tenSP = row.children[0].textContent.toLowerCase();
    const loaiSP = row.children[1].textContent.toLowerCase();
    row.style.display = (tenSP.includes(keyword) || loaiSP.includes(keyword)) ? "" : "none";
  });
});

