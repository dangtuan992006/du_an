document.addEventListener("DOMContentLoaded", () => {
  const detailRows = document.querySelectorAll(".detail-row");
  const totalInvoiceInput = document.querySelector(".price"); // tổng giá trị phiếu nhập
  const saveBtn = document.querySelector(".save"); // nút Lưu
  const tableBody = document.querySelector(".list tbody"); // bảng danh sách

  // ====== GẮN SỰ KIỆN CHO MỖI DÒNG CHI TIẾT ======
  detailRows.forEach(row => {
    const qtyInput = row.querySelector('input[placeholder="Số Lượng"]');
    const priceInput = row.querySelector('input[placeholder="Giá Nhập"]');
    const totalInput = row.querySelector('input[placeholder="Tổng Tiền"]');

    priceInput.addEventListener("input", () => {
      let value = priceInput.value.replace(/\./g, "").replace(/\D/g, "");
      priceInput.value = value ? Number(value).toLocaleString("vi-VN") : "";
      updateRowTotal();
      updateInvoiceTotal();
    });

    qtyInput.addEventListener("input", () => {
      qtyInput.value = qtyInput.value.replace(/\D/g, "");
      updateRowTotal();
      updateInvoiceTotal();
    });

    function updateRowTotal() {
      const qty = parseInt(qtyInput.value.replace(/\D/g, "")) || 0;
      const price = parseInt(priceInput.value.replace(/\D/g, "")) || 0;
      const total = qty * price;
      totalInput.value = total > 0 ? total.toLocaleString("vi-VN") : "";
    }
  });

  // ====== HÀM TÍNH TỔNG HÓA ĐƠN ======
  function updateInvoiceTotal() {
    let sum = 0;
    document.querySelectorAll('.detail-row input[placeholder="Tổng Tiền"]').forEach(input => {
      const value = parseInt(input.value.replace(/\D/g, "")) || 0;
      sum += value;
    });
    totalInvoiceInput.value = sum > 0 ? sum.toLocaleString("vi-VN") : "";
  }

  // ====== KHI ẤN NÚT LƯU ======
  saveBtn.addEventListener("click", () => {
    const maPhieu = document.querySelector('input[placeholder="Nhập mã phiếu"]').value.trim();
    const ngayNhap = document.querySelector('input[type="date"]').value;
    const tongGiaTri = totalInvoiceInput.value;

    if (!maPhieu || !ngayNhap || !tongGiaTri) {
      alert("Vui lòng nhập đầy đủ Mã phiếu, Ngày nhập và Chi tiết sản phẩm!");
      return;
    }

    // Lấy danh sách sản phẩm chi tiết
    let chiTiet = [];
    document.querySelectorAll(".detail-row").forEach((row, index) => {
      const maSP = row.querySelector('input[placeholder="Mã SP"]').value.trim();
      const tenSP = row.querySelector('input[placeholder="TÊN SP"]').value.trim();
      const soLuong = row.querySelector('input[placeholder="Số Lượng"]').value.trim();
      const giaNhap = row.querySelector('input[placeholder="Giá Nhập"]').value.trim();
      const tongTien = row.querySelector('input[placeholder="Tổng Tiền"]').value.trim();

      if (maSP && tenSP && soLuong && giaNhap && tongTien) {
        chiTiet.push({ stt: index + 1, maSP, tenSP, soLuong, giaNhap, tongTien });
      }
    });

    if (chiTiet.length === 0) {
      alert("Vui lòng nhập ít nhất một dòng chi tiết sản phẩm!");
      return;
    }

    // Tạo hàng mới trong bảng
    const newId = `view-${Date.now()}`; // tạo id duy nhất
    const newRow = document.createElement("tr");
    newRow.classList.add("tablesp");
    newRow.innerHTML = `
      <th>${maPhieu}</th>
      <th>${formatDate(ngayNhap)}</th>
      <th>${tongGiaTri}</th>
      <th>
        <input type="checkbox" id="${newId}" hidden>
        <label for="${newId}" class="see">Xem</label>
        <div class="modal2">
          <div class="modal-content">
            <label for="${newId}" class="close">&times;</label>
            <h2>Thông tin chi tiết</h2>
            <p><strong>Mã phiếu:</strong> ${maPhieu}</p>
            <p><strong>Ngày nhập:</strong> ${formatDate(ngayNhap)}</p>
            <table>
              <thead>
                <th>Số thứ tự</th>
                <th>Mã Sản Phẩm</th>
                <th>Tên Sản Phẩm</th>
                <th>Giá nhập</th>
                <th>Số lượng</th>
                <th>Tổng Tiền</th>
              </thead>
              <tbody>
                ${chiTiet.map(ct => `
                  <tr>
                    <th>${ct.stt}</th>
                    <th>${ct.maSP}</th>
                    <th>${ct.tenSP}</th>
                    <th>${ct.giaNhap}</th>
                    <th>${ct.soLuong}</th>
                    <th>${ct.tongTien}</th>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </th>
    `;
    tableBody.appendChild(newRow);

    alert("✅ Đã thêm phiếu nhập thành công!");
    // Reset form
    document.querySelector('input[placeholder="Nhập mã phiếu"]').value = "";
    document.querySelector('input[type="date"]').value = "";
    totalInvoiceInput.value = "";
    document.querySelectorAll(".detail-row input").forEach(input => input.value = "");
  });

  // ====== HÀM ĐỊNH DẠNG NGÀY (yyyy-mm-dd → dd/mm/yyyy) ======
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
});
