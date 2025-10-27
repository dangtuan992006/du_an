document.addEventListener("DOMContentLoaded", function () {
    const filterButton = document.querySelector(".loc");
    const resetButton = document.querySelector(".dl");
    const dateInput = document.querySelector(".dat");
    const stateSelect = document.getElementById("state");
    const searchInput = document.querySelector('.search input[type="text"]');
    const rows = document.querySelectorAll("tbody tr");

    // Khởi tạo trạng thái
    const allStates = ["Đang xử lý", "Đã giao"];
    allStates.forEach(st => {
        const option = document.createElement("option");
        option.value = st;
        option.textContent = st;
        stateSelect.appendChild(option);
    });

    // Lọc đơn hàng
    filterButton.addEventListener("click", () => {
        const selectedDate = dateInput.value;
        const selectedState = stateSelect.value;
        const searchText = searchInput.value.trim().toLowerCase();

        rows.forEach(row => {
            const orderCode = row.cells[0].textContent.toLowerCase();
            const orderDate = row.cells[4].textContent; // Ngày đặt nằm ở cột thứ 5
            const currentState = row.querySelector("select").value;

            const matchDate = !selectedDate || orderDate === selectedDate;
            const matchState = !selectedState || currentState === selectedState;
            const matchText = !searchText || orderCode.includes(searchText);

            if (matchDate && matchState && matchText) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Đặt lại bộ lọc
    resetButton.addEventListener("click", () => {
        dateInput.value = "";
        stateSelect.value = "";
        searchInput.value = "";
        rows.forEach(row => row.style.display = "");
    });
});
