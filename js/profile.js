document.addEventListener("DOMContentLoaded", () => {
  const userProfile = {
    name: "Tên Người Dùng",
    email: "user@example.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận XYZ, TP. HCM",
  };

  localStorage.setItem("userProfile", JSON.stringify(userProfile));

  const storedUserProfile = JSON.parse(localStorage.getItem("userProfile"));

  if (storedUserProfile) {
    document.getElementById("user-name").textContent = storedUserProfile.name;
    document.getElementById(
      "user-email"
    ).textContent = `Email: ${storedUserProfile.email}`;
    document.getElementById(
      "user-phone"
    ).textContent = `Số điện thoại: ${storedUserProfile.phone}`;
    document.getElementById(
      "user-address"
    ).textContent = `Địa chỉ: ${storedUserProfile.address}`;
  }
});
