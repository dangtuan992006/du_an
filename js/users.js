    document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById("user-list");
    const addUserBtn = document.getElementById("add-user-btn");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const pageNumbersContainer = document.getElementById("page-numbers");
    const prevPageBtn = document.querySelector(".pagination .pagination-arrow:first-of-type");
    const nextPageBtn = document.querySelector(".pagination .pagination-arrow:last-of-type");
    const USER_STORAGE_KEY = 'crud_users';

    // Biến để lưu trạng thái gốc của một hàng khi đang sửa
    let originalRowHTML = null;

    // --- XỬ LÝ SỰ KIỆN ---

    userList.addEventListener("click", (e) => {
        const target = e.target;
        const row = target.closest("tr");
        if (!row) return;
        const userName = row.querySelector('td:first-child').textContent;

        // --- RESET MẬT KHẨU ---
        if (target.closest(".reset-password-btn")) {
            alert(`Đã reset mật khẩu cho người dùng về "1".`);
        }

        // --- KHÓA/MỞ KHÓA TÀI KHOẢN ---
        if (target.closest(".toggle-lock-btn")) {
            row.classList.toggle('locked');
            // alert(`Đã thay đổi trạng thái cho người dùng.`);
        }

        // --- CHUYỂN SANG CHẾ ĐỘ SỬA ---
        if (target.closest(".edit-btn")) {
            // Nếu đang sửa một hàng khác, hủy nó trước
            if (document.querySelector('.editing')) {
                const editingRow = document.querySelector('.editing');
                editingRow.innerHTML = originalRowHTML;
                editingRow.classList.remove('editing');
            }

            // Lưu trạng thái hiện tại và chuyển sang chế độ sửa
            originalRowHTML = row.innerHTML;
            row.classList.add('editing');

            const cells = row.querySelectorAll('td');
            const name = cells[0].textContent;
            const email = cells[1].textContent;
            const phone = cells[2].textContent;
            const password = cells[3].textContent;
            const status = cells[4].textContent;
            const joinDate = cells[5].textContent;

            row.innerHTML = `
                <td><input type="text" value="${name}" style="width: 100%;"></td>
                <td>${email}</td>
                <td><input type="text" value="${phone}" style="width: 100%;"></td>
                <td><input type="password" value="${password}" style="width: 100%;"></td>
                <td>${status}</td>
                <td>${joinDate}</td>
                <td>
                    <button class="action-btn save-edit-btn" title="Lưu"><i class="fa-solid fa-save"></i></button>
                    <button class="action-btn cancel-edit-btn" title="Hủy"><i class="fa-solid fa-times"></i></button>
                </td>
            `;
        }

        // --- LƯU SAU KHI SỬA ---
        if (target.closest(".save-edit-btn")) {
            alert(`Đã cập nhật thông tin cho người dùng.`);
            // Khôi phục lại nội dung gốc của hàng
            row.innerHTML = originalRowHTML;
            row.classList.remove('editing');
            originalRowHTML = null;
        }

        // --- HỦY SỬA ---
        if (target.closest(".cancel-edit-btn")) {
            // Khôi phục lại nội dung gốc của hàng
            row.innerHTML = originalRowHTML;
            row.classList.remove('editing');
            originalRowHTML = null;
        }
    });

    // --- THÊM NGƯỜI DÙNG MỚI ---
    addUserBtn.addEventListener("click", () => {
        // Ngăn thêm nhiều hàng mới cùng lúc
        if (document.querySelector(".new-user-row")) {
            alert("Vui lòng hoàn thành việc thêm người dùng hiện tại.");
            return;
        }

        const newRow = userList.insertRow(0); // Thêm vào đầu bảng
        newRow.className = "new-user-row";
        newRow.innerHTML = `
            <td><input type="text" placeholder="Tên người dùng" style="width: 100%;"></td>
            <td><input type="email" placeholder="Email" style="width: 100%;"></td>
            <td><input type="text" placeholder="Số điện thoại" style="width: 100%;"></td>
            <td><input type="password" placeholder="Mật khẩu" style="width: 100%;"></td>
            <td>Hoạt động</td>
            <td><input type="date" style="width: 100%;"></td>
            <td>
                <button class="action-btn save-new-btn" title="Lưu"><i class="fa-solid fa-save"></i></button>
                <button class="action-btn cancel-new-btn" title="Hủy"><i class="fa-solid fa-times"></i></button>
            </td>
        `;

        // Xử lý nút lưu cho người dùng mới
        newRow.querySelector('.save-new-btn').addEventListener('click', () => {
            const nameInput = newRow.querySelector('input[type="text"]');
                alert("Đã thêm người dùng mới.");
            newRow.remove(); // Xóa hàng sau khi "lưu"
        });

        // Xử lý nút hủy cho người dùng mới
        newRow.querySelector('.cancel-new-btn').addEventListener('click', () => {
            newRow.remove(); // Chỉ cần xóa hàng đi
        });
    });

    // --- TÌM KIẾM ---
    const handleSearch = () => {
        const keyword = searchInput.value.toLowerCase().trim();
        const rows = userList.querySelectorAll('tr');
        let found = false;
        rows.forEach(row => {
            const name = row.cells[0]?.textContent.toLowerCase();
            const email = row.cells[1]?.textContent.toLowerCase();
            if (name.includes(keyword) || email.includes(keyword)) {
                row.style.display = '';
                found = true;
            } else {
                row.style.display = 'none';
            }
        });
    };

    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
        handleSearch();
        }
    });

    // --- CHỨC NĂNG PHÂN TRANG ẢO ---
    let currentPage = 1;
    const totalPages = 5; // Giả sử có 5 trang (4 số và dấu '...')

    const updatePaginationUI = () => {
        // Bỏ active ở tất cả các nút
        pageNumbersContainer.querySelectorAll('.page-number').forEach(btn => {
            btn.classList.remove('active');
        });
    
        // Thêm active cho nút của trang hiện tại
        // Tìm nút dựa trên vị trí của nó, không phải nội dung
        const currentBtn = pageNumbersContainer.querySelector(`.page-number:nth-child(${currentPage})`);
        if (currentBtn) {
            currentBtn.classList.add('active');
        }
    
        // Cập nhật trạng thái của nút Trước/Sau
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    };
    
    const goToPage = (page) => {
        currentPage = page;
        updatePaginationUI();
    };
    
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    });
    
    nextPageBtn.addEventListener("click", () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    });
    
    pageNumbersContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains('page-number') && !e.target.textContent.includes('...')) {
            // Lấy vị trí của nút được nhấn để xác định trang
            const allButtons = Array.from(pageNumbersContainer.querySelectorAll('.page-number'));
            const pageIndex = allButtons.indexOf(e.target);
            if (pageIndex !== -1) {
                const page = pageIndex + 1;
                if (page !== currentPage) goToPage(page);
            }
        }
    });

    updatePaginationUI(); // Cập nhật giao diện phân trang lần đầu
    });
