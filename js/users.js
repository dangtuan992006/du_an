// Đường dẫn file JSON user ban đầu
const JSON_PATH = "../data/users.json";

// Hàm hiển thị user ra bảng
function displayUsers(users) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";

    if (!users || Object.keys(users).length === 0) {
        userList.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:20px;">
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
            <td>${user.join_date}</td>
            <td>
                <button class="delete-btn" data-email="${user.email}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        userList.appendChild(row);
    });

    // Gắn sự kiện xóa
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const email = btn.getAttribute("data-email");
            let users = JSON.parse(localStorage.getItem("users")) || {};
            delete users[email];
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
        const join_date = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

        if (email && name) {
            const newUser = { email, name, phone, password, join_date };
            addUser(newUser);
        }
    });
});
