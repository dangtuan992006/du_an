// ======================================================
// 🧠 ADMIN PAGE SCRIPT (phiên bản tương thích login.js)
// ======================================================

// 🖼️ Ảnh đại diện mặc định
const DEFAULT_AVATAR_PATH = "../images/admin.png";

/**
* Hàm định dạng ngày tháng từ YYYY-MM-DD sang DD/MM/YYYY
* @param {string} dateString 
* @returns {string}
*/
    function formatDate(dateString) {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
        const parts = dateString.split("-");
        if (parts.length !== 3) return dateString;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch {
        return dateString;
    }
}

/**
* Hiển thị thông tin admin lên giao diện
*/
function displayAdminInfo() {
    // 🔹 Lấy thông tin từ localStorage (do file login đã lưu)
    const name = localStorage.getItem("adminUser") || "Administrator";
    const email = localStorage.getItem("adminEmail") || "admin@gmail.com";
    const phone = localStorage.getItem("adminPhone") || "N/A";
    const join_date = localStorage.getItem("adminjoi_date") || "2024-01-01"; // đúng key trong file bạn gửi
    const role = localStorage.getItem("currentUserRole") || "guest";

    // 🧩 Lấy div chứa thông tin Admin
    const adminInfoDiv = document.querySelector(".admin-info");
    if (!adminInfoDiv) {
        console.warn("⚠️ Không tìm thấy phần tử .admin-info trong HTML!");
        return;
    }

    // 🧱 Hiển thị thông tin admin
    adminInfoDiv.innerHTML = `
        <h2>Tên Admin: <span id="adminUser">${name}</span></h2>
        <p><strong>Email:</strong> <span id="adminEmail">${email}</span></p>
        <p><strong>Số điện thoại:</strong> <span id="currentPhoneNumber">${phone}</span></p>
        <p><strong>Ngày tham gia:</strong> <span id="dateJoin">${formatDate(join_date)}</span></p>
        <button class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</button>
    `;

    // 🖼️ Cập nhật ảnh đại diện
    const avatarImg = document.querySelector(".admin-profile .avatar");
    if (avatarImg) {
        avatarImg.src = DEFAULT_AVATAR_PATH;
    }

    // 🚪 Đăng xuất
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn đăng xuất không?")) {
            // Xóa toàn bộ key admin
            localStorage.removeItem("currentUserRole");
            localStorage.removeItem("adminUser");
            localStorage.removeItem("adminEmail");
            localStorage.removeItem("adminPhone");
            localStorage.removeItem("adminPassword");
            localStorage.removeItem("adminjoi_date");

            alert("Đăng xuất thành công!");
            window.location.href = "../pages/index.html";
        }
    });
}
}

/**
* Chạy khi DOM sẵn sàng
*/
document.addEventListener("DOMContentLoaded", displayAdminInfo);
