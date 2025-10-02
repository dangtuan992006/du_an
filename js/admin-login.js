//  Nạp file JSON vào localStorage trước
fetch("../data/users.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("registeredUsers", JSON.stringify(data));
    console.log(" Đã nạp file JSON vào localStorage");

    //  Chỉ sau khi JSON đã nạp xong thì mới gắn sự kiện đăng nhập

    document
      .getElementById("adminLoginForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;

        const users = JSON.parse(localStorage.getItem("registeredUsers")) || {};

        if (
          users[email] &&
          users[email].password === password &&
          email === "admin@gmail.com"
        ) {
          localStorage.setItem("currentUser", users[email].name);
          localStorage.setItem("currentUserEmail", email);
          localStorage.setItem("currentUserRole", "admin");

          alert(" Đăng nhập Admin thành công!");
          (window.location.href = "../admin/index.html"), (target = "_blank"); // chuyển đến trang quản trị
        } else {
          alert(" Sai tài khoản hoặc mật khẩu admin");
        }
      });
  })
  .catch((error) => console.error(" Lỗi khi nạp JSON:", error));
