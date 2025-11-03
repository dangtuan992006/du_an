/**
 * search.js - Xử lý chức năng tìm kiếm và lọc sản phẩm
 *
 * Tệp này chỉ lắng nghe sự kiện của người dùng. Nó không phụ thuộc vào thời điểm
 * main.js được tải xong, mà chỉ kiểm tra sự sẵn sàng của main.js KHI người dùng tương tác.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử DOM. Sử dụng cả ID và class để linh hoạt hơn.
  const searchInput =
    document.querySelector(".search-input") ||
    document.getElementById("searchInput");
  const searchButton = document.querySelector(".search-button");
  const categorySelect =
    document.querySelector(".category-select") ||
    document.getElementById("categoryFilter");

  /**
   * Hàm kích hoạt việc lọc sản phẩm.
   * Hàm này sẽ kiểm tra xem main.js đã sẵn sàng MỖI KHI nó được gọi.
   */
  const triggerFilter = () => {
    // Kiểm tra xem đối tượng App trong main.js đã tồn tại và hàm cần thiết có sẵn không
    if (
      window.App &&
      window.App.Products &&
      window.App.Products.handleFilterChange
    ) {
      // Nếu sẵn sàng, gọi hàm xử lý lọc trong main.js
      window.App.Products.handleFilterChange();
    } else {
      // Nếu chưa sẵn sàng, chỉ cần thông báo và không làm gì cả.
      // Người dùng có thể thử lại sau một giây lát.
      console.warn("Chức năng tìm kiếm đang tải. Vui lòng thử lại.");
    }
  };

  // --- Gắn các sự kiện lắng nghe ---

  if (searchButton) {
    searchButton.addEventListener("click", (e) => {
      e.preventDefault();
      triggerFilter();
    });
  }

  if (searchInput) {
    // Sự kiện khi người dùng gõ vào ô tìm kiếm (tìm kiếm tức thì)
    searchInput.addEventListener("input", triggerFilter);

    // Sự kiện khi nhấn phím "Enter"
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerFilter();
      }
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", triggerFilter);
  }
});
