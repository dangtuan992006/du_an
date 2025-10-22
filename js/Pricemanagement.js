// Pricemanagement.js
const btnAdd = document.getElementById("btnAdd");
const add = document.getElementById("add");
const btnCancel = document.getElementById("btnCancel");
const tableAdd = document.getElementById("tableAdd");
const tbody = document.querySelector(".data");

// Hiện/ẩn bảng thêm sản phẩm
btnAdd.addEventListener("click", () => {
  tableAdd.style.display = "table";
  btnAdd.style.display = "none";
});

btnCancel.addEventListener("click", () => {
  tableAdd.style.display = "none";
  btnAdd.style.display = "inline";
});

// Nút thêm trong bảng add
const addButtonInTable = tableAdd.querySelector("button");

// Thêm sản phẩm mới
addButtonInTable.addEventListener("click", (e) => {
  e.preventDefault();

  const inputs = tableAdd.querySelectorAll("tbody tr th input, tbody tr th select");
  const values = Array.from(inputs).map(i => i.value.trim());

  if (!values[0]) {
    alert("Vui lòng nhập tên sản phẩm.");
    return;
  }

  // Reset form
  inputs.forEach(i => {
    if (i.tagName.toLowerCase() === "select") i.selectedIndex = 0;
    else i.value = "";
  });

tableAdd.style.display = "none";
btnAdd.style.display = "inline";


  // Cột thao tác
  const actionTh = document.createElement("th");
  const btnSua = document.createElement("button");
  btnSua.className = "sua";
  btnSua.textContent = "sửa";

  const btnXoa = document.createElement("button");
  btnXoa.className = "xoa";
  btnXoa.textContent = "xóa";

  actionTh.appendChild(btnSua);
  actionTh.appendChild(btnXoa);
  tr.appendChild(actionTh);

  tbody.appendChild(tr);

  // Reset form
  inputs.forEach(i => {
    if (i.tagName.toLowerCase() === "select") i.selectedIndex = 0;
    else i.value = "";
  });

  tableAdd.style.display = "none";
  btnAdd.style.display = "inline";
});

// Xử lý sự kiện xóa và sửa
document.addEventListener("click", function (e) {
  const target = e.target;

  // Nút xóa
  if (target.classList.contains("xoa")) {
    const row = target.closest("tr");
    if (!row) return;
    const ten = row.children[0] ? row.children[0].textContent : "";
    const confirmDel = confirm(`Bạn có chắc muốn xóa sản phẩm "${ten}" không?`);
    return;
  }

  // Nút sửa
  if (target.classList.contains("sua")) {
    const row = target.closest("tr");
    if (!row) return;
    if (row.dataset.editing === "true") return;
    row.dataset.editing = "true";

    // Lưu giá trị cũ để phục hồi
    const oldValues = Array.from(row.children).slice(0, 5).map(cell => cell.textContent);

    // Biến 5 ô đầu thành input (vẫn hiển thị giá trị cũ)
    for (let i = 0; i < 5; i++) {
      const cell = row.children[i];
      const input = document.createElement("input");
      input.type = "text";
      input.value = oldValues[i];
      input.style.width = "95%";
      cell.textContent = "";
      cell.appendChild(input);
    }

    // Thay nút sửa/xóa bằng lưu/hủy
    const actionCell = row.children[5];
    actionCell.textContent = "";

    const btnLuu = document.createElement("button");
    btnLuu.className = "luu";
    btnLuu.textContent = "lưu";

    const btnHuy = document.createElement("button");
    btnHuy.className = "huy";
    btnHuy.textContent = "hủy";

    actionCell.appendChild(btnLuu);
    actionCell.appendChild(btnHuy);

    // Nút LƯU (không thay đổi dữ liệu — phục hồi giá trị cũ)
    btnLuu.addEventListener("click", function () {
      for (let i = 0; i < 5; i++) {
        const cell = row.children[i];
        cell.textContent = oldValues[i]; // giữ nguyên dữ liệu cũ
      }
      restoreButtons(row, actionCell);
    });

    // Nút HỦY (cũng phục hồi dữ liệu cũ)
    btnHuy.addEventListener("click", function () {
      for (let i = 0; i < 5; i++) {
        const cell = row.children[i];
        cell.textContent = oldValues[i];
      }
      restoreButtons(row, actionCell);
    });
  }

  // Hàm phục hồi nút sửa/xóa
  function restoreButtons(row, actionCell) {
    actionCell.textContent = "";
    const btnSuaNew = document.createElement("button");
    btnSuaNew.className = "sua";
    btnSuaNew.textContent = "sửa";
    const btnXoaNew = document.createElement("button");
    btnXoaNew.className = "xoa";
    btnXoaNew.textContent = "xóa";
    actionCell.appendChild(btnSuaNew);
    actionCell.appendChild(btnXoaNew);
    delete row.dataset.editing;
  }
});
