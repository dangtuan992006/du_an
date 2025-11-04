    document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById("user-list");
    const addUserBtn = document.getElementById("add-user-btn");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const USER_STORAGE_KEY = 'crud_users';

    let users = [];

    // --- CÁC HÀM QUẢN LÝ DỮ LIỆU ---

    /**
     * Lưu danh sách người dùng vào localStorage
     */
    const saveUsers = () => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    };

    /**
     * Vẽ lại toàn bộ bảng người dùng từ mảng `users`
     */
    const renderUsers = () => {
        userList.innerHTML = ''; // Xóa nội dung cũ
        const keyword = searchInput.value.toLowerCase().trim();

        const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(keyword) || 
        user.email.toLowerCase().includes(keyword)
        );

        if (filteredUsers.length === 0) {
        userList.innerHTML = `<tr><td colspan="6" style="text-align:center;">Không tìm thấy người dùng.</td></tr>`;
        return;
        }

        filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.email = user.email; // Dùng email làm định danh duy nhất
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.password}</td>
            <td>${user.joinDate}</td>
            <td>
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        userList.appendChild(row);
        });
    };

    /**
     * Tải người dùng từ localStorage hoặc khởi tạo từ HTML nếu chưa có
     */
    const loadUsers = () => {
        const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUsers) {
        users = JSON.parse(storedUsers);
        } else {
        // Nếu chưa có trong storage, đọc từ HTML để khởi tạo
        users = Array.from(userList.querySelectorAll('tr')).map(row => {
            const cells = row.querySelectorAll('td');
            return {
            name: cells[0].textContent,
            email: cells[1].textContent,
            phone: cells[2].textContent,
            password: cells[3].textContent,
            joinDate: cells[4].textContent,
            };
        });
        saveUsers(); // Lưu lại để dùng cho lần sau
        }
        renderUsers();
    };

    // --- XỬ LÝ SỰ KIỆN ---

    userList.addEventListener("click", (e) => {
        const target = e.target;
        const row = target.closest("tr");
        if (!row) return;

        const email = row.dataset.email;

        // --- XÓA NGƯỜI DÙNG ---
        if (target.closest(".delete-btn")) {
        const userToDelete = users.find(u => u.email === email);
        if (userToDelete && confirm(`Bạn có chắc chắn muốn xóa người dùng "${userToDelete.name}" không?`)) {
            users = users.filter(u => u.email !== email);
            saveUsers();
            renderUsers();
        }
        }

        // --- CHUYỂN SANG CHẾ ĐỘ SỬA ---
        if (target.closest(".edit-btn")) {
        const userToEdit = users.find(u => u.email === email);
        if (!userToEdit) return;

        row.innerHTML = `
            <td><input type="text" value="${userToEdit.name}"></td>
            <td>${userToEdit.email}</td>
            <td><input type="text" value="${userToEdit.phone}"></td>
            <td><input type="password" value="${userToEdit.password}"></td>
            <td><input type="date" value="${userToEdit.joinDate}"></td>
            <td>
            <button class="save-btn"><i class="fa-solid fa-save"></i></button>
            <button class="cancel-btn"><i class="fa-solid fa-times"></i></button>
            </td>
        `;
        }

        // --- LƯU SAU KHI SỬA ---
        if (target.closest(".save-btn")) {
        const inputs = row.querySelectorAll("input");
        const updatedUser = {
            name: inputs[0].value.trim(),
            email: email, // email không đổi
            phone: inputs[1].value.trim(),
            password: inputs[2].value.trim(),
            joinDate: inputs[3].value,
        };

        if (!updatedUser.name || !updatedUser.password || !updatedUser.joinDate) {
            alert("Tên, mật khẩu và ngày tham gia không được để trống!");
            return;
        }

        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex > -1) {
            users[userIndex] = updatedUser;
            saveUsers();
            renderUsers();
        }
        }

        // --- HỦY SỬA ---
        if (target.closest(".cancel-btn")) {
        renderUsers(); // Chỉ cần vẽ lại bảng là xong
        }
    });

    // --- THÊM NGƯỜI DÙNG MỚI ---
    addUserBtn.addEventListener("click", () => {
        if (document.querySelector(".new-user-row")) {
        alert("Vui lòng hoàn thành việc thêm người dùng hiện tại.");
        return;
        }

        const newRow = userList.insertRow(0);
        newRow.className = "new-user-row";
        newRow.innerHTML = `
        <td><input type="text" placeholder="Tên người dùng"></td>
        <td><input type="email" placeholder="Email"></td>
        <td><input type="text" placeholder="Số điện thoại"></td>
        <td><input type="password" placeholder="Mật khẩu"></td>
        <td><input type="date"></td>
        <td>
            <button class="save-btn"><i class="fa-solid fa-save"></i></button>
            <button class="cancel-btn"><i class="fa-solid fa-times"></i></button>
        </td>
        `;

        // Xử lý nút lưu cho người dùng mới
        newRow.querySelector('.save-btn').addEventListener('click', () => {
        const inputs = newRow.querySelectorAll('input');
        const newUser = {
            name: inputs[0].value.trim(),
            email: inputs[1].value.trim(),
            phone: inputs[2].value.trim(),
            password: inputs[3].value.trim(),
            joinDate: inputs[4].value,
        };

        if (!newUser.name || !newUser.email || !newUser.password || !newUser.joinDate) {
            alert("Tên, email, mật khẩu và ngày tham gia không được để trống!");
            return;
        }

        if (users.some(u => u.email === newUser.email)) {
            alert("Email này đã tồn tại!");
            return;
        }

        users.unshift(newUser); // Thêm vào đầu mảng
        saveUsers();
        renderUsers();
        });

        // Xử lý nút hủy cho người dùng mới
        newRow.querySelector('.cancel-btn').addEventListener('click', () => {
        newRow.remove();
        });
    });

    // --- TÌM KIẾM ---
    searchBtn.addEventListener("click", renderUsers);
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
        renderUsers();
        }
    });

    // --- KHỞI CHẠY ---
    loadUsers();
    });
