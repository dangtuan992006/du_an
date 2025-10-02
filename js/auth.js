/*xu ly dang nhap */
// Khởi tạo danh sách người dùng nếu chưa có
if (!localStorage.getItem("registeredUsers")) {
  localStorage.setItem("registeredUsers", JSON.stringify({}));
}

const emailInput = document.getElementById("email");
const passwordGroup = document.getElementById("passwordGroup");
const passwordInput = document.getElementById("password");
const statusHint = document.getElementById("statusHint");
const emailForm = document.getElementById("emailForm");
const submitBtn = document.getElementById("submitBtn");

let isNewAccount = false;

//  Khi người dùng nhập email
emailInput.addEventListener("input", () => {
  const email = emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    statusHint.textContent = "";
    passwordGroup.style.display = "none";
    submitBtn.textContent = "Continue";
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
  // Loại bỏ admin để chỉ còn khách
  const users = Object.fromEntries(
    Object.entries(allUsers).filter(
      ([email, user]) => email !== "admin@gmail.com"
    )
  );
  if (users[email]) {
    // Nếu đã có tài khoản → chỉ hiện mật khẩu, không hiện thông báo
    passwordGroup.style.display = "block";
    submitBtn.textContent = "Đăng nhập";
    isNewAccount = false;
  } else {
    // Nếu chưa có tài khoản → hiện mật khẩu để tạo mới
    statusHint.textContent =
      "Email chưa có tài khoản. Hãy nhập mật khẩu để tạo tài khoản mới.";
    passwordGroup.style.display = "block";
    submitBtn.textContent = "Tạo tài khoản";
    isNewAccount = true;
  }
});

//  Khi submit form
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const users = JSON.parse(localStorage.getItem("registeredUsers"));

  if (!isValidEmail(email)) {
    alert("Vui lòng nhập email hợp lệ.");
    return;
  }

  if (isNewAccount) {
    //  Tạo tài khoản mới
    const username = email.split("@")[0];
    users[email] = {
      name: username,
      email: email,
      password: password, // ❗ không mã hóa
      created: new Date().toISOString(),
    };
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    localStorage.setItem("currentUser", username);
    localStorage.setItem("currentUserEmail", email);
    localStorage.setItem("currentUserRole", "customer");
    alert(` Tài khoản mới đã được tạo cho ${email}!`);
    window.location.href = "../pages/index.html";
  } else {
    //  Đăng nhập
    if (users[email].password === password) {
      localStorage.setItem("currentUser", users[email].name);
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("currentUserRole", "customer");
      alert(` Chào mừng trở lại, ${users[email].name}!`);
      window.location.href = "../pages/index.html";
    } else {
      alert(" Sai mật khẩu, vui lòng thử lại.");
    }
  }
});

//  Hàm kiểm tra email hợp lệ
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Xử lý social login - ĐÃ SỬA: không tạo mới nếu đã tồn tại
function handleSocialLogin(provider) {
  const email = `user@${provider.toLowerCase()}.com`;
  const username = `${provider} User`;

  const users = JSON.parse(localStorage.getItem("registeredUsers"));

  // Kiểm tra nếu email đã tồn tại
  if (!users[email]) {
    users[email] = {
      name: username,
      email: email,
      provider: provider,
      created: new Date().toISOString(),
      isVerified: true, // Social login thường đã xác minh
    };
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    alert(`Tài khoản mới đã được tạo qua ${provider}!`);
  } else {
    // Nếu đã tồn tại, chỉ thông báo đăng nhập
    alert(`Chào mừng trở lại, ${users[email].name}!`);
  }

  localStorage.setItem("currentUser", users[email].name);
  localStorage.setItem("currentUserEmail", email);
  // Nếu được mở từ popup, đóng login và quay lại popup
  if (window.opener && !window.opener.closed) {
    window.close();
  } else {
    window.location.href = "../pages/index.html";
  }
}

// Hàm kiểm tra xem user hiện tại đã đăng nhập chưa
function checkCurrentUser() {
  const currentUser = localStorage.getItem("currentUser");
  const currentUserEmail = localStorage.getItem("currentUserEmail");

  if (currentUser && currentUserEmail) {
    console.log(`User hiện tại: ${currentUser} (${currentUserEmail})`);
    return {
      name: currentUser,
      email: currentUserEmail,
    };
  }
  return null;
}

// Hàm đăng xuất
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentUserEmail");
  alert("Đã đăng xuất!");
  window.location.href = "login.html";
}

// Hàm kiểm tra email đã được sử dụng chưa
function isEmailRegistered(email) {
  const users = JSON.parse(localStorage.getItem("registeredUsers"));
  return !!users[email];
}

// Hàm lấy thông tin user bằng email
function getUserByEmail(email) {
  const users = JSON.parse(localStorage.getItem("registeredUsers"));
  return users[email] || null;
}
