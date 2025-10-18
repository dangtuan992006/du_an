// Đường dẫn file JSON user ban đầu
const JSON_PATH = "../data/users.json";

// Hàm hiển thị user ra bảng
function displayUsers(users) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";

    if (!users || Object.keys(users).length === 0) {
        userList.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">
                    <i class="fa-solid fa-users-slash"></i> Chưa có người dùng nào
                </td>
            </tr>
        `;
        return;
    }

    Object.values(users).forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.password}</td>
            <td>${user.join_date}</td>
            <td>
                <button class="edit-btn" data-email="${user.email}">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </td>
            <td>
                <button class="delete-btn" data-email="${user.email}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        userList.appendChild(row);
    });

    // ===== GẮN SỰ KIỆN XOÁ =====
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const email = btn.dataset.email;
            let users = JSON.parse(localStorage.getItem("users")) || {};
            if (confirm(`Xoá người dùng "${email}"?`)) {
                delete users[email];
                localStorage.setItem("users", JSON.stringify(users));
                displayUsers(users);
            }
        });
    });

    // ===== GẮN SỰ KIỆN SỬA =====
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const email = btn.dataset.email;
            let users = JSON.parse(localStorage.getItem("users")) || {};
            const user = users[email];
            if (!user) return;

            const newName = prompt("Tên mới:", user.name) || user.name;
            const newEmail = prompt("Email mới:", user.email) || user.email;
            const newPhone = prompt("Số điện thoại mới:", user.phone) || user.phone;
            const newPassword = prompt("Mật khẩu mới:", user.password) || user.password;
            const newDate = prompt("Ngày tham gia mới:", user.join_date) || user.join_date;

            // Kiểm tra định dạng ngày (nếu nsgười dùng nhập)
            const validDate = /^\d{4}-\d{2}-\d{2}$/.test(newDate);
            const finalJoinDate = validDate ? newJoinDate : user.join_date;
            

            users[email] = {
                ...user,
                name: newName,
                email: newEmail,
                phone: newPhone,
                password: newPassword,
                join_date: finalJoinDate
            };

            localStorage.setItem("users", JSON.stringify(users));
            displayUsers(users);
        });
    });
}

// Load dữ liệu từ JSON (lần đầu) hoặc localStorage
async function loadUsers() {
    let users = JSON.parse(localStorage.getItem("users"));

    if (!users) {
        try {
            const res = await fetch(JSON_PATH);
            if (!res.ok) throw new Error("Không thể tải users.json");
            users = await res.json();
            localStorage.setItem("users", JSON.stringify(users));
        } catch (err) {
            console.error("Lỗi:", err);
            users = {};
        }
    }

    displayUsers(users);
}

// Thêm user mới
function addUser(newUser) {
    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[newUser.email]) {
        alert("Email này đã tồn tại!");
        return;
    }

    users[newUser.email] = newUser;
    localStorage.setItem("users", JSON.stringify(users));
    displayUsers(users);
}

// Khi DOM load xong
window.addEventListener("DOMContentLoaded", () => {
    loadUsers();

    const addBtn = document.getElementById("add-user-btn");
    addBtn.addEventListener("click", () => {
        const email = prompt("Nhập email:");
        const name = prompt("Nhập tên:");
        const phone = prompt("Nhập số điện thoại:");
        const password = prompt("Nhập mật khẩu:");
        const join_date = new Date().toISOString().split("T")[0];

        if (email && name) {
            const newUser = { email, name, phone, password, join_date };
            addUser(newUser);
        } else {
            alert("Vui lòng nhập ít nhất email và tên!");
        }
    });
});


// ===== GẮN SỰ KIỆN TÌM KIẾM =====
document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("user-list");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    // Lấy dữ liệu người dùng (ví dụ từ localStorage hoặc JSON)
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};

    function renderUsers(data) {
        userList.innerHTML = "";

        Object.values(data).forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.password}</td>
                <td>${user.join_date}</td>
            `;
            userList.appendChild(row);
        });
    }

    // Hiển thị toàn bộ user ban đầu
    renderUsers(users);

    // --- Sự kiện tìm kiếm ---
    searchBtn.addEventListener("click", () => {
        const keyword = searchInput.value.toLowerCase().trim();

        if (keyword === "") {
            renderUsers(users);
            return;
        }

        // Lọc danh sách theo tên hoặc email
        const filtered = Object.values(users).filter(user =>
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)
        );

        renderUsers(filtered.length ? filtered : []);
    });

    // --- Nhấn Enter cũng tìm được ---
    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
});
