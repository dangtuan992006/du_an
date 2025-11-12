// ../js/orderProcessing.js

document.addEventListener('DOMContentLoaded', () => {
  // Element modal và các trường hiển thị
  const modal = document.getElementById('orderModal');
  const closeBtn = modal.querySelector('.close');
  const orderIdEl = document.getElementById('orderId');
  const customerNameEl = document.getElementById('customerName');
  const orderDateEl = document.getElementById('orderDate');
  const orderTotalEl = document.getElementById('orderTotal');
  const orderStatusEl = document.getElementById('orderStatus');

  const tableBody = document.querySelector('tbody.data');

  // Hàm hiển thị modal với dữ liệu từ một <tr>
  function showOrderDetails(row) {
    // Lấy các ô trong hàng (giả định cấu trúc giống HTML hiện tại)
    const cells = row.querySelectorAll('th, td');
    // Theo cấu trúc của bạn: mã đơn, tên, ngày, tổng, trạng thái, hành động
    const code = cells[0]?.textContent?.trim() || '';
    const name = cells[1]?.textContent?.trim() || '';
    const date = cells[2]?.textContent?.trim() || '';
    const total = cells[3]?.textContent?.trim() || '';
    // trạng thái nằm trong span.status
    const statusSpan = row.querySelector('.status');
    const statusText = statusSpan ? statusSpan.textContent.trim() : '';

    orderIdEl.textContent = code;
    customerNameEl.textContent = name;
    orderDateEl.textContent = date;
    orderTotalEl.textContent = total;
    orderStatusEl.textContent = statusText;

    modal.style.display = 'block';
  }

  // Đóng modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Event delegation cho các nút xem / xóa trong bảng
  tableBody.addEventListener('click', (e) => {
    const target = e.target;
    // nếu click vào nút xem
    if (target.classList.contains('xem')) {
      const row = target.closest('tr');
      if (row) showOrderDetails(row);
      return;
    }

    // nếu click vào nút xóa
    if (target.classList.contains('xoa')) {
      const row = target.closest('tr');
      if (!row) return;
      const code = row.querySelectorAll('th, td')[0]?.textContent?.trim() || '';
      const customer = row.querySelectorAll('th, td')[1]?.textContent?.trim() || '';

      const confirmDelete = confirm(`Bạn chắc chắn muốn xóa đơn ${code} - ${customer} ?`);
      if (confirmDelete) {
        
      }
      return;
    }
  });

  // Đóng modal khi bấm X
  closeBtn.addEventListener('click', closeModal);

  // Đóng modal khi click ra ngoài nội dung modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Đóng modal khi bấm Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // (Tùy chọn) xử lý nút phân trang trước/next (nếu bạn muốn)
  // const prevBtn = document.querySelector('.pagination .prev');
  // const nextBtn = document.querySelector('.pagination .next');
  // prevBtn?.addEventListener('click', () => { /* xử lý */ });
  // nextBtn?.addEventListener('click', () => { /* xử lý */ });

});
