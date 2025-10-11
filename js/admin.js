// Đường dẫn tới file JSON chứa dữ liệu người dùng
const USERS_JSON_PATH = '../data/users.json';

// Giả định: Admin hiện tại đã đăng nhập. 
// Trong ứng dụng thực tế, email này sẽ được lưu trong session/localStorage sau khi đăng nhập thành công.
const CURRENT_ADMIN_EMAIL = 'admin@gmail.com'; 
const DEFAULT_AVATAR_PATH = '../images/admin.png';


/*
 * Hàm tải dữ liệu người dùng từ file JSON
 * @returns {Promise<Object>} Dữ liệu người dùng
 */
async function loadUserData() {
    try {
        const response = await fetch(USERS_JSON_PATH);
        if (!response.ok) {
            throw new Error(`Không thể tải file JSON (HTTP ${response.status})`);
        }
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu người dùng:', error);
        // Trả về đối tượng rỗng nếu lỗi
        return {}; 
    }
}

/**
 * Hàm hiển thị thông tin Admin lên giao diện
 * @param {Object} userData - Dữ liệu của người dùng hiện tại
 */
function displayAdminInfo(userData) {
    
    // Khởi tạo thông tin cơ bản
    const adminData = {
        name: userData.name || "Administrator",
        email: userData.email || "N/A",
        phone: userData.phone || "N/A",
        join_date: userData.join_date || "N/A",
    };
    
    // Lấy div chứa thông tin Admin
    const adminInfoDiv = document.querySelector('.admin-info');

    // 1. Tạo HTML nội dung (Sử dụng các ID bạn đã comment trong HTML)
    adminInfoDiv.innerHTML = `
        <h2>Tên Admin: <span id="adminUser">${adminData.name}</span> </h2>
        <p><strong>Email:</strong> <span id="adminEmail">${adminData.email}</span></p>
        <p><strong>Số điện thoại:</strong> <span id="currentPhoneNumber">${adminData.phone}</span></p>
        <p><strong>Ngày tham gia:</strong> <span id="dateJoin">${formatDate(adminData.join_date)}</span></p>
        <button class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</button>
    `;

    // 2. Cập nhật ảnh đại diện (giả định dùng ảnh mặc định)
    const avatarImg = document.querySelector('.admin-profile .avatar');
    if (avatarImg) {
        avatarImg.src = DEFAULT_AVATAR_PATH;
    }

    // 3. Thêm sự kiện cho nút đăng xuất (Logout)
    document.querySelector('.logout-btn').addEventListener('click', () => {
        // Trong thực tế: Xóa token/session
        alert(`Đã đăng xuất tài khoản ${adminData.email}!`);
        // Chuyển hướng về trang đăng nhập/trang chủ
        location.href = '../pages/index.html'; 
    });
}

/**
 * Hàm định dạng ngày tháng từ YYYY-MM-DD sang DD/MM/YYYY
 * @param {string} dateString 
 * @returns {string} Ngày tháng đã định dạng
 */
function formatDate(dateString) {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
        const parts = dateString.split('-'); // Tách YYYY-MM-DD
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // Định dạng DD/MM/YYYY
    } catch (e) {
        return dateString;
    }
}


/**
 * Logic chính để khởi tạo trang Admin
 */
async function initAdminPage() {
    const allUsers = await loadUserData();
    
    // Lấy dữ liệu của Admin hiện tại (theo email giả định)
    const currentAdmin = allUsers[CURRENT_ADMIN_EMAIL];

    if (currentAdmin) {
        displayAdminInfo(currentAdmin);
    } else {
        // Xử lý trường hợp không tìm thấy Admin
        console.warn(`Không tìm thấy dữ liệu Admin cho email: ${CURRENT_ADMIN_EMAIL}.`);
        // Hiển thị thông tin mặc định
        displayAdminInfo({
            name: "Admin Default",
            email: CURRENT_ADMIN_EMAIL,
            phone: "0000000000",
            join_date: "2024-01-01"
        });
    }
}

// Chạy logic chính khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', initAdminPage);