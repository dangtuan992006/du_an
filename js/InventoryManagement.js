const btnAdd = document.getElementById("btnAdd");
const modal = document.getElementById("formAdd");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const tbody = document.querySelector(".data");

// Hiện form thêm sản phẩm
btnAdd.addEventListener("click", () => modal.style.display = "block");

// Ẩn form
cancelBtn.addEventListener("click", () => modal.style.display = "none");

// Thêm sản phẩm mới
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

  const tr = document.createElement("tr");
  [maSp, tenSp, loai, soLuong, donVi].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    tr.appendChild(th);
  });

  const action = document.createElement("th");
  const btnSua = document.createElement("button");
  btnSua.className = "sua";
  btnSua.textContent = "sửa";

  const btnXoa = document.createElement("button");
  btnXoa.className = "xoa";
  btnXoa.textContent = "xóa";

  action.appendChild(btnSua);
  action.appendChild(btnXoa);
  tr.appendChild(action);
  tbody.appendChild(tr);

  modal.style.display = "none";
});

// Xóa sản phẩm
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("xoa")) {
    const row = e.target.closest("tr");
    const ten = row.children[1].textContent;
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${ten}" không?`)) {
      row.remove();
    }
  }
});
