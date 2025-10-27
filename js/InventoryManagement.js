function filterProducts() {
  const keyword = document.getElementById("searchName").value.toLowerCase();
  const category = document.getElementById("category").value;
  const rows = document.querySelectorAll("#productTable tr");

  rows.forEach(row => {
    const name = row.cells[1].textContent.toLowerCase();
    const type = row.cells[2].textContent;
    if (
      (keyword === "" || name.includes(keyword)) &&
      (category === "" || type === category)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function resetFilter() {
  document.getElementById("searchName").value = "";
  document.getElementById("category").value = "";
  document.querySelectorAll("#productTable tr").forEach(r => r.style.display = "");
}

// Chức năng sửa số lượng tồn
function editRow(button) {
  const row = button.closest("tr");
  const cell = row.cells[3];
  
  // Nếu đang ở chế độ chỉnh sửa
  if (button.textContent === "Lưu") {
    const input = cell.querySelector("input");
    const newValue = input.value;
    cell.textContent = newValue;
    button.textContent = "Sửa";
  } else {
    const currentValue = cell.textContent;
    cell.innerHTML = `<input type="number" value="${currentValue}" min="0" style="width:80px; text-align:center;">`;
    button.textContent = "Lưu";
  }
}
